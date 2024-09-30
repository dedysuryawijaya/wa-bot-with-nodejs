import { WhatsAppInstance } from "../service/instanceService.js";
import { logger } from "../application/logging.js";

const init = async (req, res, next) => {
    try {
        const instance = new WhatsAppInstance();
        const data = await instance.connect();
        WhatsAppInstance["dedy"] = instance;

        res.status(200).json({
            success: true,
            message: 'Initializing successfully',
            qrCode: {
                url: "http://127.0.0.1:3000/instance/qr"
            }
        });
    } catch (e) {
        next(e);
    }
}

const qrbase64 = async (req, res, next) => {
    try {
        const qrcode = await WhatsAppInstance["dedy"].instance.qr;
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