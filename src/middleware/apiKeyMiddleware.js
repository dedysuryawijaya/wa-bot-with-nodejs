import config from '../application/config.js';
import { ResponseError } from "../error/responseError.js";

const apiKeyVerification = async (req, res, next) => {
    const bearer = req.headers.authorization;
    const token = bearer?.slice(7)?.toString();
    if (!token) {
        res.status(403).json({
            success: false,
            errors: 'no bearer token header was present'
        }).end();
    }

    if (config.api_key !== token) {
        res.status(403).json({
            success: false,
            errors: 'invalid bearer token supplied'
        }).end();
    }
    next()
}

export {
    apiKeyVerification
}