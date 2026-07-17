require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { initSocket } = require('./socket/socket');

const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app); // wrap Express app in a raw HTTP server


// Connect to MongoDB
connectDB();
initSocket(server); //Initialize socket.io with the HTTP server

// Middleware 
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5500', 'http://localhost:5500'], // your future Vite frontend
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});