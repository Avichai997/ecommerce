import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import config from './config';
import userRouter from './routers/userRouter';
import orderRouter from './routers/orderRouter';
import productRouter from './routers/productRouter';
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

app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.get('/api/paypal/clientId', (req, res) => {
  res.send({ clientId: config.PAYPAL_CLIENT_ID });
});
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
app.use(express.static(path.join(__dirname, '/../client')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/index.html'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.name && err.name === 'ValidationError' ? 400 : 500;
  res.status(status).send({ message: err.message });
});
app.listen(config.PORT, () => {
  console.log(`serve at http://localhost:${config.PORT || 5000}`);
});
