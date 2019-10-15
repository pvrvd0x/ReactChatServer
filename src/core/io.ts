import socketIO from 'socket.io';

const configureSockets = (socketIO: socketIO.Server) => {
    socketIO.on('connection', (socket: any) => {
        socket.emit('test', 'qweqweqwe');
    });
};

export default configureSockets;