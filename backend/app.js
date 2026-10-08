require('dotenv').config();
const express = require('express');
const cors = require('cors');
const allowedOrigins = require('./config/origins.js');
const authRoutes = require('./routes/authRoutes.js');
const roomRoutes = require('./routes/roomRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');

const app = express();

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

module.exports = app;