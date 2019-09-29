import express from 'express';
import http from 'http';
import socket from 'socket.io';
import bodyParser from "body-parser";
import dotenv from 'dotenv';

import './core/db';
import configureRoutes from './core/routes';

import { updateLastSeen, checkAuth } from "./middleware";

const app = express();
const server = http.createServer(app);
const io = socket(server);

dotenv.config();

app.use(bodyParser.json());
app.use(checkAuth);
app.use(updateLastSeen);

configureRoutes(app);

io.on('connection', (socket: any) => {
    console.log('User Connected');

    socket.emit('test', 'qweqweqwe');

    socket.on('say', (msg: number) => {
        console.log(`User say: ${msg}`);
    })
});

server.listen(1337, function() {
    console.log(`Listening to your speech nigga on port ${process.env.PORT}`);
});