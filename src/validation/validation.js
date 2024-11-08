import { ResponseError } from "../error/responseError.js";

const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnkown: false
    })

    if (result.error) {
        throw new ResponseError(400, result.error.message)
    } else {
        return result.value;
    }
}

export {
    validate
}