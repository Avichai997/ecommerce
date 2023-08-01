import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, PAYPAL_CLIENT_ID } from './config';
import userRouter from './routers/userRouter';
import orderRouter from './routers/orderRouter';
import productRouter, { initSocketProductEvents } from './routers/productRouter';
import uploadRouter from './routers/uploadRouter';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', ' PUT', 'DELETE'],
  },
});

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

// Socket.io
io.use((socket, next) => {
  const { token } = socket.handshake.auth;
  if (!token) next(new Error('No token supplied!'));

  jwt.verify(token, JWT_SECRET, (err) => {
    if (err) next(new Error('Invalid Token'));
  });

  next();
});

io.on('connection', (socket) => {
  console.log('Socket.io user connected: ', socket.id);
  initSocketProductEvents(io, socket);
});

// Routes
app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.get('/api/paypal/clientId', (req, res) => res.send({ clientId: PAYPAL_CLIENT_ID }));

app.all('*', (req, res) =>
  res.status(404).send({ message: `Address ${req.originalUrl} Don't exists in the server!` })
);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.name && err.name === 'ValidationError' ? 400 : 500;
  res.status(status).send({ message: err.message });
});

export default app;
