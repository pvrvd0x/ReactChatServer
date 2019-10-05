import socketIO from 'socket.io';

const configureSockets = (socketIO: socketIO.Server) => {
    socketIO.on('connection', (socket: any) => {
        console.log('User Connected');

        socket.emit('test', 'qweqweqwe');
    });
};

export default configureSockets;