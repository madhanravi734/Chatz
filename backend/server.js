require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app.js');
const connectdb = require('./config/db.js');
const allowedOrigins = require('./config/origins.js');
const { initSocket } = require('./sockets/chatSocket.js');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigins },
});

initSocket(io);
connectdb();

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});