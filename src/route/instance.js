import express from 'express';
import instanceController from '../controller/instanceController.js';

const instance = new express.Router();

instance.post('/init', instanceController.init)
instance.get('/qr', instanceController.qrbase64)

export {
    instance
}

