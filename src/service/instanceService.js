import QRCode from 'qrcode'
import { makeWASocket, DisconnectReason, useMultiFileAuthState} from '@whiskeysockets/baileys';
import useMongoDBAuthState from '../helper/mongoAuthState.js'
import { logger } from '../application/logging.js';
import config from '../application/config.js';
import Chat from '../model/instanceModel.js'

class WhatsAppInstance {
    socketConfig = {
        defaultQueryTimeoutMs: undefined,
        printQRInTerminal: false,
    }
    key = ''
    authState
    instance = {
        key: this.key,
        qr: '',
        qrRetry: 0
    }

    constructor(key){
        this.key = key
    }

    async connect() {
        this.collection = mongoClient.db('whatsapp-bot').collection(this.key)
        const { state, saveCreds } = await useMongoDBAuthState(this.collection)
        this.authState = { state: state, saveCreds: saveCreds };
        this.socketConfig.auth = this.authState.state;
        this.instance.sock = makeWASocket(this.socketConfig);
        this.setHandler();
        return this
    }

    setHandler() {
        const sock = this.instance.sock;

        sock?.ev.on('creds.update', this.authState.saveCreds);

        sock?.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            logger.info(connection);

            if (connection === 'connecting') return true;

            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode != DisconnectReason.loggedOut;
                if (shouldReconnect) {
                    await this.connect()
                } else {
                    await this.collection.drop().then((result) => {
                        logger.info('STATE: Droped collection')
                    })
                }
            } else if (connection === 'open') {
                if(config.mongoose.enable) {
                    let alreadyThere = await Chat.findOne({
                        key: this.key
                    }).exec()
                    if (!alreadyThere) {
                        const saveChat = new Chat({
                            key: this.key
                        })
                        await saveChat.save()
                    }
                }
            }

            if (qr) {
                QRCode.toDataURL(qr)
                    .then((url) => {
                        this.instance.qr = url;
                        this.instance.qrRetry++
                        if (this.instance.qrRetry >= 3) {
                            //  Tutup koneksi WA
                            this.instance.sock.ws.close();
                            // tutup semua event
                            this.instance.sock.ev.removeAllListeners();
                            this.instance.qr = '';
                            logger.info("socket connection terminated")
                        }
                    })
            }
        })
    }

    getWhatsAppId(id) {
        if (id.includes('@g.us') || id.includes('@s.whatsapp.net')) return id
        return id.includes('-') ? `${id}@g.us` : `${id}@s.whatsapp.net`
    }

    async verifyId(id) {
        if (id.includes('@g.us')) return id
        const [result] = await this.instance.sock?.onWhatsApp(id);
        if (result?.exists) return true
        throw new error('no account exists');
    }

    async sendTextMessage(to, message) {
        const id = this.getWhatsAppId(to)
        await this.verifyId(id);
        const data = await this.instance.sock?.sendMessage(
            id,
            { text: message }
        )
        return data
    }

    async sendMediaFile(to, file, type, caption = '', filename) {
        const id = this.getWhatsAppId(to);
        await this.verifyId(id);
        const data = await this.instance.sock?.sendMessage(
            id,
            {
                mimetype: file.mimetype,
                [type] : file.buffer,
                caption: caption,
                ptt: type === 'audio' ? true : false,
                filename: filename ? filename : file.originalname,
            }

        )
        return data
    }
}

export {
    WhatsAppInstance
}