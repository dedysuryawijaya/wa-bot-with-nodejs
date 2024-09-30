import express from "express";
import { instance } from "../route/instance.js";
import { message } from "../route/message.js";

export const web = express();
web.use(express.json());

web.use('/instance', instance)
web.use('/message', message)