/* eslint-disable no-console */
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import app from './app';
import { PORT, MONGODB_URL, JWT_SECRET } from './config';
import { initSocketProductEvents } from './routers/productRouter';

// 1) Connect to mongoose and server.
const server = http.createServer(app);

mongoose
  .set('strictQuery', true)
  .connect(MONGODB_URL)
  .then(() => {
    console.log('DB connection successful!', '\x1b[0m');
  })
  .catch((error) => {
    console.log(error.reason);
  });

// 2) Initialize Socket.io instance.
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://ecommerce-fe-lyu8.onrender.com/'],
    methods: ['GET', 'POST', ' PUT', 'DELETE'],
  },
});
io.use((socket, next) => {
  const { token } = socket.handshake.auth;
  if (!token) next(new Error('No token supplied!'));

  jwt.verify(token, JWT_SECRET, (err) => {
    if (err) next(new Error('Invalid Token'));
  });

  next();
});

io.on('connection', (socket) => {
  console.log('user connected', socket.id);
  initSocketProductEvents(io, socket);
});

// 3) Handler server crash/unknown errors.

// Catch errors in program.
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Catch async errors
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err, err.name, err.message);
  server.close(() => {
    // Shutdown the server gracefully
    process.exit(1);
  });
});

server.listen(PORT, () => {
  console.log('\x1b[32m', `App running on Port: ${PORT}...`);
});
