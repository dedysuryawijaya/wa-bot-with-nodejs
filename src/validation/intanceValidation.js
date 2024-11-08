import Joi from "joi";

const qrValidation = Joi.object({
    key: Joi.string().required()
})