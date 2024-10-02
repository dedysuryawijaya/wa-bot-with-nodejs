import { logger } from "../application/logging.js";
import { WhatsAppInstance } from "../service/instanceService.js";

const text = async (req, res, next) => {
    try {
        const data = await WhatsAppInstance[req.body.key].sendTextMessage(
            req.body.id,
            req.body.message
        )
        return res.status(201).json({
            success: true,
            data: data
        })
    } catch (e) {
        next(e)
    }
}

const image = async (req, res, next) => {
    try {
        const data = await WhatsAppInstance[req.body.key].sendMediaFile(
            req.body.id,
            req.file,
            'image',
            req.body?.caption
        )
        return res.status(201).json({
            success: true,
            data: data
        })
    } catch (e) {
        next(e)
    }
}

export default{
    text,
    image
}