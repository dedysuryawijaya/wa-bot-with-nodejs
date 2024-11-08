import express from "express";
import { instance } from "../router/instance.js";
import { message } from "../router/message.js";
import { errorMiddleware } from "../middleware/errorMiddleware.js";
import { apiKeyVerification } from "../middleware/apiKeyMiddleware.js";

export const web = express();
web.use(express.json());
web.use(errorMiddleware);
web.use(apiKeyVerification);
web.use(express.json({ limit: '50mb' }));
web.use(express.urlencoded({ extended: true }));

web.use('/instance', instance);
web.use('/message', message);