const { Server } = require('socket.io');

let io;
const userSocketMap = {}; // { userId: socketId }

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5500', 'http://localhost:5500'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    // Let everyone know who's currently online
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
      delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
  });
};

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

module.exports = { initSocket, getReceiverSocketId, getIO: () => io };