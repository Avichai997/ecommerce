import express from 'express';
import {
  getOrderSummary,
  getAllOrders,
  getOrder,
  createOrder,
  deleteOrder,
  payOrder,
  deliverOrder,
} from '../controllers/orderController';
import { isAuth, isAdmin } from '../utils';

const orderRouter = express.Router();

orderRouter.route('/').get(getAllOrders).post(isAuth, createOrder);

// All next routes are for authenticated users only.
orderRouter.use(isAuth);

orderRouter.get('/myOrders', getAllOrders).get('/summary', isAdmin, getOrderSummary);
orderRouter.patch('/:id/pay', payOrder);
orderRouter.patch('/:id/deliver', deliverOrder);
orderRouter.route('/:id').get(getOrder).delete(isAdmin, deleteOrder);

export default orderRouter;
