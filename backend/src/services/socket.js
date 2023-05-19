const { Server } = require('socket.io');
const http = require('http');

function initialize(server, msg) {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.emit('event', msg)
    });
}

module.exports = { initialize };
