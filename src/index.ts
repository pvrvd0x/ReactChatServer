import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import dotenv from 'dotenv';


dotenv.config();

import configureDBConnection from './core/db';
import configureRoutes from './core/routes';
import configureSockets from "./core/io";

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

configureDBConnection(
    'localhost',
    27017,
    'chat',
    {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

configureRoutes(app, io);

configureSockets(io);

server.listen(process.env.PORT, function() {
    console.log(`Listening to your speech nigga on port ${process.env.PORT}`);
});