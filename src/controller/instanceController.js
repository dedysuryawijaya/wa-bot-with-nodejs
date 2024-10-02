import { WhatsAppInstance } from "../service/instanceService.js";
import { logger } from "../application/logging.js";
import config from "../application/config.js";
 
const init = async (req, res, next) => {

    const key = req.body.key;
    const appUrl = config.appUrl;

    try {
        const instance = new WhatsAppInstance(key);
        const data = await instance.connect();
        WhatsAppInstance[data.key] = instance;

        res.status(200).json({
            success: true,
            message: 'Initializing successfully',
            key: data.key,
            qrCode: {
                url: `${config.app_url}/instance/qr`
            }
        });
    } catch (e) {
        next(e);
    }
}

const qrbase64 = async (req, res, next) => {
    try {
        const qrcode = await WhatsAppInstance[req.body.key].instance.qr;
        logger.info(qrcode)
        res.status(200).json({
            success: true,
            message: 'QR Base64 fetched successfully',
            qrcode: qrcode
        })
    } catch (e) {
        next(e);
    }
}

export default {
    init,
    qrbase64,
}