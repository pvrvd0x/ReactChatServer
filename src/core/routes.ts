import core from 'express';
import {DialogsController, MessagesController, UserController} from "../controllers";
import {loginValidation, registerValidation} from "../validations";
import socketIO from 'socket.io';

const configureRoutes = (app: core.Express, io: socketIO.Server) => {
    const UserCtrl = new UserController(io),
        DialogsCtrl = new DialogsController(io),
        MessagesCtrl = new MessagesController(io);

    app.get('/user/me', UserCtrl.getMe);
    app.get('/user/verify', UserCtrl.verify);
    app.post('/user/register', registerValidation, UserCtrl.create);
    app.post('/user/login', loginValidation, UserCtrl.login);
    app.get('/user/:id', UserCtrl.index);
    app.delete('/user/remove/:id', UserCtrl.delete);

    app.get('/dialogs', DialogsCtrl.index);
    app.post('/dialogs/start', DialogsCtrl.create);
    app.delete('/dialogs/:id', DialogsCtrl.delete);

    app.get('/messages/:id', MessagesCtrl.index);
    app.post('/messages', MessagesCtrl.create);
    app.delete('/messages/:id', MessagesCtrl.delete);
};

export default configureRoutes;