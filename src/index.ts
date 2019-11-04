import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import mongodb from 'mongodb';

dotenv.config();

import configureRoutes from './core/routes';
import configureSockets from "./core/io";

mongoose.connect('mongodb+srv://slim-chat:138za3228shit@cluster0-bcnom.mongodb.net/chat?retryWrites=true&w=majority', 
                {
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    useFindAndModify: false,
                    useUnifiedTopology: true,
                },
                (err: mongodb.MongoError) => {
                    if (err) {
                        console.log(err);
                    }
                }
);

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// useCreateIndex: true,
// useFindAndModify: false,
// useUnifiedTopology: true,

configureRoutes(app, io);

configureSockets(io);

server.listen(process.env.PORT || 1337, function() {
    console.log(`Listening to your speech nigga on port ${process.env.PORT}`);
});
