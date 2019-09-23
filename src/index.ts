import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import dotenv from 'dotenv';

import {
    UserController,
    DialogsController,
    MessageController } from "./controllers";
import { updateLastSeen } from "./middleware";

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(updateLastSeen);

const User = new UserController();
const Dialogs = new DialogsController();
const Messages = new MessageController();

mongoose.connect('mongodb://localhost:27017/chat', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
});

app.get('/user/:id', User.index);
app.post('/user/register', User.create);
app.delete('/user/remove/:id', User.delete);

app.get('/dialogs/:id', Dialogs.index);
app.post('/dialogs/start', Dialogs.create);
app.delete('/dialogs/:id', Dialogs.delete);

app.get('/messages/:id', Messages.index);
app.post('/messages', Messages.create);
app.delete('/messages/:id', Messages.delete);

app.listen(1337, function() {
    console.log(`Listening to your speech nigga on port ${process.env.PORT}`);
});