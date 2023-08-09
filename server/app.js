import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import { PAYPAL_CLIENT_ID } from './config';
import userRouter from './routers/userRouter';
import orderRouter from './routers/orderRouter';
import productRouter from './routers/productRouter';
import uploadRouter from './routers/uploadRouter';
import AppError from './utils/AppError';

const app = express();

// Middleware
app.use(morgan('dev'));

// Implement CORS
const whitelist = ['http://localhost:3000', 'https://ecommerce-be-p5y2.onrender.com/'];
const corsOptions = {
  credentials: true, // allow cookies
  origin: (origin, callback) => {
    // (!origin) to allow Postman requests that comes with header: origin === undefined
    const allowPostman = !origin && process.env.NODE_ENV === 'development';

    return allowPostman || (origin && whitelist.indexOf(origin) !== -1)
      ? callback(null, true) // allow request
      : callback(new AppError(`Origin: ${origin} Not allowed by CORS`, 403)); // deny request
  },
};

app.use(cors(corsOptions));

app.use(cors());
app.use(bodyParser.json());

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
