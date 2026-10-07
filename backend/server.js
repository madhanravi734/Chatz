const http = require('http');
const {Server} = require('socket.io');
const {initSocket} = require('./sockets/chatSocket.js');
const connectdb=require('./config/db.js')
const express= require('express')
const PORT = process.env.PORT || 5000;
const authRoutes=require('./routes/authRoutes.js')
const roomRoutes=require('./routes/roomRoutes.js')
const messageRoutes=require('./routes/messageRoutes.js')
const app=express()
const cors=require('cors')
require('dotenv').config()
const server=http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chatz-fawn.vercel.app"]
  }
});
initSocket(io)
app.use(cors({
  origin: ["http://localhost:5173", "https://chatz-fawn.vercel.app"]
}))
app.use(express.json())
connectdb()
app.use('/api/auth',authRoutes)
app.use('/api/rooms',roomRoutes)
app.use('/api/messages',messageRoutes)
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
