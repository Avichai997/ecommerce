/* eslint-disable no-console */
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import app from './app';
import config from './config';
import { initSocketProductEvents } from './routers/productRouter';

const { PORT, MONGODB_URL, JWT_SECRET } = config;

// catch errors in program
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  // console.log(err);
  process.exit(1);
});

mongoose
  .set('strictQuery', true)
  .connect(MONGODB_URL)
  .then(() => {
    console.log('DB connection successful!', '\x1b[0m');
  })
  .catch((error) => {
    console.log(error.reason);
  });

// Socket.io
const server = http.createServer(app);
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

// catch async errors
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err, err.name, err.message);
  // Shutdown the server gracefully
  server.close(() => {
    process.exit(1);
  });
});

server.listen(PORT, () => {
  console.log('\x1b[32m', `App running on Port: ${config.PORT}...`);
});
