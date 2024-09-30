import { WhatsAppInstance } from "../service/instanceService.js";

const text = async (req, res, next) => {
    try {
        const data = await WhatsAppInstance['dedy'].sendTextMessage(
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

export default{
    text
}