import Order from '../models/orderModel';
import { getAll, getOne, updateOne, deleteOne, createOne } from './handlerFactory';

// export const getOrderSummary = (req, _res, next) => {
//   req.params.id = req.user._id;
//   next();
// };

export const getAllOrders = getAll(Order, 'user');
export const getOrder = getOne(Order);
export const createOrder = createOne(Order);
export const updateOrder = updateOne(Order);
export const deleteOrder = deleteOne(Order);
