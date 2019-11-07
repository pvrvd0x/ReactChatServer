import core from 'express';
import express from 'express';
import socketIO from 'socket.io';
import bodyParser from "body-parser";
import {DialogsController, MessagesController, UserController, UploadFileController} from "../controllers";
import {loginValidation, registerValidation} from "../validations";
import uploader from "./uploader";
import path from 'path';

import {checkAuth, updateLastSeen} from "../middleware";

const configureRoutes = (app: core.Express, io: socketIO.Server) => {
    const UserCtrl = new UserController(io),
        DialogsCtrl = new DialogsController(io),
        MessagesCtrl = new MessagesController(io),
        UploadCtrl = new UploadFileController();

    app.use(express.static(__dirname));
    app.use(express.static(path.join(__dirname, '../../build')));
    app.use(bodyParser.json());
    app.use(checkAuth);
    app.use(updateLastSeen);

    app.get(['/', '/login', '/register'], (req: express.Request, res: express.Response) => {
        res.sendFile(path.join(__dirname, '../..', 'build', 'index.html'));
    });

    app.get('/user/me', UserCtrl.getMe);
    app.get('/user/verify', UserCtrl.verify);
    app.post('/user/register', registerValidation, UserCtrl.create);
    app.post('/user/login', loginValidation, UserCtrl.login);
    app.get('/user/find', UserCtrl.findUsers);
    app.get('/user/:id', UserCtrl.index);
    app.delete('/user/remove/:id', UserCtrl.delete);

    app.get('/dialogs', DialogsCtrl.index);
    app.post('/dialogs', DialogsCtrl.create);
    app.delete('/dialogs/:id', DialogsCtrl.delete);

    app.get('/messages/:id', MessagesCtrl.index);
    app.post('/messages', MessagesCtrl.create);
    app.delete('/messages/:id', MessagesCtrl.delete);

    app.post('/files', uploader.single('file'), UploadCtrl.create);
    app.delete('/files', UploadCtrl.delete);
};

export default configureRoutes;