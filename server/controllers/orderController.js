import Order from '../models/orderModel';
import Product from '../models/productModel';
import User from '../models/userModel';
import { expressAsyncHandler } from '../utils';
import { getAll, getOne, deleteOne } from './handlerFactory';

export const getAllOrders = getAll(Order, 'user');
export const getOrder = getOne(Order);
export const deleteOrder = deleteOne(Order);

export const createOrder = expressAsyncHandler(async (req, res) => {
  const createdOrder = await Order.create({
    orderItems: req.body.orderItems,
    user: req.user._id,
    shipping: req.body.shipping,
    payment: req.body.payment,
    itemsPrice: req.body.itemsPrice,
    taxPrice: req.body.taxPrice,
    shippingPrice: req.body.shippingPrice,
    totalPrice: req.body.totalPrice,
  });

  res.status(201).json({ message: 'New Order Created', order: createdOrder });
});

export const payOrder = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) res.status(404).send({ message: 'Order Not Found.' });

  if (order.isPaid) res.status(404).send({ message: 'Order already paid' });

  // update order data
  order.isPaid = true;
  order.paidAt = Date.now();
  order.payment.paymentResult = {
    payerID: req.body.payerID,
    paymentID: req.body.paymentID,
    orderID: req.body.orderID,
  };

  const updatedOrder = await order.save();
  if (!updatedOrder)
    res.status(500).send({
      message: 'error paying order',
    });

  // update all orderItems products quantity
  const updateOrderItemsProductsQty = Promise.all(
    order.orderItems.map(async (orderItem) => {
      // 1) find the product
      const product = await Product.findById(orderItem.product);
      if (!product) res.status(404).send({ message: `Product ${orderItem.product} Not Found.` });

      if (product.countInStock - orderItem.qty < 0)
        res.status(500).send({
          message: `The product: "${product.name}" is out of stock, we are very sorry...`,
        });
      else {
        // 2) update the product's countInStock
        await Product.findByIdAndUpdate(product._id, {
          countInStock: product.countInStock - orderItem.qty,
        });
      }
    })
  );

  await updateOrderItemsProductsQty;

  res.status(200).send({ message: 'Order Paid', order });
});

export const deliverOrder = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).send({ message: 'Order Delivered', order: updatedOrder });
  } else {
    res.status(404).send({ message: 'Order Not Found.' });
  }
});

export const getOrderSummary = expressAsyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const users = await User.aggregate([
    {
      $group: {
        _id: null,
        numUsers: { $sum: 1 },
      },
    },
  ]);
  const dailyOrders = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const productCategories = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);
  res.send({
    users,
    orders: orders.length === 0 ? [{ numOrders: 0, totalSales: 0 }] : orders,
    dailyOrders,
    productCategories,
  });
});
