import core from 'express';
import {DialogsController, MessagesController, UserController} from "../controllers";
import {loginValidation} from "../validations";

const configureRoutes = (app: core.Express) => {
    app.get('/user/me', UserController.getMe);
    app.get('/user/:id', UserController.index);
    app.post('/user/register', UserController.create);
    app.delete('/user/remove/:id', UserController.delete);
    app.post('/user/login', loginValidation, UserController.login);

    app.get('/dialogs', DialogsController.index);
    app.post('/dialogs/start', DialogsController.create);
    app.delete('/dialogs/:id', DialogsController.delete);

    app.get('/messages/:id', MessagesController.index);
    app.post('/messages', MessagesController.create);
    app.delete('/messages/:id', MessagesController.delete);
};

export default configureRoutes;