import express from "express";
import { instance } from "../route/instance.js";
import { message } from "../route/message.js";

export const web = express();
web.use(express.json());
web.use(express.json({ limit: '50mb' }))
web.use(express.urlencoded({ extended: true }))

web.use('/instance', instance)
web.use('/message', message)