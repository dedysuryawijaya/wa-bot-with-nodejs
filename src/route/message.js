import express from "express";
import messageController from "../controller/messageController.js";

const message = express.Router();

message.post('/sendMessage', messageController.text)

export {
    message
}