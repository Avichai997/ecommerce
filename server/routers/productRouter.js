import express from 'express';
import { isAuth, isAdmin } from '../utils';
import {
  createProduct,
  createProductReview,
  deleteProduct,
  deleteProductReview,
  editProductReview,
  getAllProducts,
  getProduct,
  updateProduct,
} from '../controllers/productController';

const productRouter = express.Router();

productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProduct);
productRouter.post('/', isAuth, isAdmin, createProduct);
productRouter.patch('/:id', isAuth, isAdmin, updateProduct);
productRouter.delete('/:id', isAuth, isAdmin, deleteProduct);

export const initSocketProductEvents = (ioConn, socket) => {
  socket.on('create-review', (params) => createProductReview({ io: ioConn, ...params }));
  socket.on('edit-review', (params) => editProductReview({ io: ioConn, ...params }));
  socket.on('delete-review', (params) => deleteProductReview({ io: ioConn, ...params }));
};

export default productRouter;
