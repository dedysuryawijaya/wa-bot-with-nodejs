import { logger } from "../application/logging.js";
import { ResponseError } from "../error/responseError.js";

const errorMiddleware = async (err, req, res, next) => {
    if(!err) {
        next();
        return;
    }

    if (err instanceof ResponseError) {
        res.status(err.status).json({
            success: false,
            errors: err.message
        }).end();
    } else {
        res.status(500).json({
            success: false,
            errors: err.message
        }).end();
    }
}

export {
    errorMiddleware
}