const jwt = require('jsonwebtoken');
const Message = require('../models/Message.js');
const initSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication failed: no token"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error("Authentication failed: invalid token"));
    }
  });

  io.on('connection', (socket) => {
    console.log("connected");

    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`socket joined room ${roomId}`);
    });

    socket.on('send_message', async (data) => {
      try {
        const { roomId, chat } = data;
        const senderId = socket.user.user.id;

        const message = new Message({
          chat,
          sentby: senderId,
          room: roomId
        });

        await message.save();
await message.populate("sentby", "username");
io.to(roomId).emit('receive_message', message);
      } catch (error) {
        console.log(error);
      }
    });
});
};

module.exports = { initSocket };