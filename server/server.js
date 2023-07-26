import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from './config';
import userRouter from './routers/userRouter';
import orderRouter from './routers/orderRouter';
import productRouter, { createProductReview, deleteProductReview } from './routers/productRouter';
import uploadRouter from './routers/uploadRouter';

mongoose
  .set('strictQuery', true)
  .connect(config.MONGODB_URL)
  .then(() => {
    console.log('Connected to mongodb.');
  })
  .catch((error) => {
    console.log(error.reason);
  });

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

// Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', ' PUT', 'DELETE'],
  },
});

// Middleware to authenticate incoming client connections
io.use((socket, next) => {
  const { token } = socket.handshake.auth;
  // console.log(`token: ${token}`);
  if (!token) next(new Error('No token supplied!'));

  jwt.verify(token, config.JWT_SECRET, (err) => {
    if (err) next(new Error('Invalid Token'));
  });

  next();
});

const initSocketEvents = (ioConn, socket) => {
  socket.on('create-review', (params) => createProductReview({ io: ioConn, ...params }));
  socket.on('delete-review', (params) => deleteProductReview({ io: ioConn, ...params }));
};

io.on('connection', (socket) => {
  console.log('user connected', socket.id);
  initSocketEvents(io, socket);
});

// Routes
app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.get('/api/paypal/clientId', (req, res) => {
  res.send({ clientId: config.PAYPAL_CLIENT_ID });
});
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.all('*', (req, res) => {
  res.status(404).send({ message: `הכתובת ${req.originalUrl} לא קיימת בשרת!` });
});
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.name && err.name === 'ValidationError' ? 400 : 500;
  res.status(status).send({ message: err.message });
});

server.listen(config.PORT || 5000, () => {
  console.log(`serve at http://localhost:${config.PORT || 5000}`);
});
