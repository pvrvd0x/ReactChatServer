import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import bodyParser from "body-parser";
import dotenv from 'dotenv';

import configureDBConnection from './core/db';
import configureRoutes from './core/routes';
import { updateLastSeen, checkAuth } from "./middleware";
import configureSockets from "./core/io";

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

dotenv.config();

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

app.use(bodyParser.json());
app.use(checkAuth);
app.use(updateLastSeen);

configureRoutes(app, io);

configureSockets(io);

server.listen(1337, function() {
    console.log(`Listening to your speech nigga on port ${process.env.PORT}`);
});