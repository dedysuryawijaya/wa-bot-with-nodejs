import express from "express";
import messageController from "../controller/messageController.js";

const message = express.Router();

message.post('/text', messageController.text)
message.post('/image', messageController.image)

export {
    message
}