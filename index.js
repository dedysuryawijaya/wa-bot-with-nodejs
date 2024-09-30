const makeWASocket = require("@whiskeysockets/baileys").default;
const { DisconnectReason, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

async function connectionLogic() {

    const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
    const sock = makeWASocket({

        printQRInTerminal: true,
        auth: state,
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update
        if (qr) {
            console.log(qr);

        }

        if (connection === 'close') {
            const shouldReconnect = 
                lastDisconnect?.error?.output?.statusCode != DisconnectReason.loggedOut;

            if (shouldReconnect) {
                connectionLogic();
            }
        }
    });

    sock.ev.on('messages.upsert', async (message) => {
        var dataMessage = message.messages[0];
        console.log('Ada Pesan baru \n' + dataMessage.pushName + ' : ' + dataMessage.message.conversation);
        if ( dataMessage.key.fromMe == false && dataMessage.key.participant === undefined) {
            const response = "Ini yang balas BOT\nJangan ganggu dedy sedang tidur\nPesan mu dibales sesok"
            // const response = await gemini(message.messages[0].message.conversation);
            // console.log('Membalas ke : ' + message.messages[0].pushName + "\n" + response)
            console.log('Membalas ke : ' + message.messages[0].pushName + "\n" + response)
            await sock.sendMessage(message.messages[0].key.remoteJid, { text: response})
        }
    })
    
    sock.ev.on("creds.update", saveCreds);

}

async function gemini(pesan) {
    
    dotenv.config();

    const configuration = new GoogleGenerativeAI("AIzaSyCgEeCj2ax89l_8pquQ3bQBsxPjs7AYaSw");
    const modelId = "gemini-pro";
    const model = configuration.getGenerativeModel({ model: modelId });

    try {
        const prompt = pesan;

        const result = await model.generateContent(prompt)
        const response = result.response;
        const text = response.text();
        
        return text
    } catch (e) {
        console.log(e);
        return "gagal ambil data dari google"
    }
}

connectionLogic();

