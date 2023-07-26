import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils';
import Product from '../models/productModel';

const productRouter = express.Router();

productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const searchKeyword = req.query.searchKeyword
      ? {
          name: {
            $regex: req.query.searchKeyword,
            $options: 'i',
          },
        }
      : {};
    const products = await Product.find({ ...searchKeyword });
    res.send(products);
  })
);

productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.send(product || {});
  })
);

productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: 'sample product',
      description: 'sample desc',
      category: 'sample category',
      brand: 'sample brand',
      image: '/images/product-1.jpg',
    });
    const createdProduct = await product.save();
    if (createdProduct) {
      res.status(201).send({ message: 'Product Created', product: createdProduct });
    } else {
      res.status(500).send({ message: 'Error in creating product' });
    }
  })
);
productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(productId, req.body);
    if (!product) res.status(404).send({ message: 'Product Not Found' });

    res.send({ message: 'Product Updated', product });
  })
);
productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    console.log(deletedProduct);
    if (deletedProduct) {
      res.send({ message: 'Product Deleted', product: deletedProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

export const createProductReview = async ({ io, productId, review }) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw Error('Product does not exist.');
    // eslint-disable-next-line no-param-reassign
    delete review._id;
    product.reviews.push(review);
    product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;
    product.numReviews = product.reviews.length;
    const updatedProduct = await product.save();

    console.log(`review: ${review._id} created`);
    io.emit('create-review-success', updatedProduct);
  } catch (error) {
    io.emit('create-review-fail', { message: error });
  }
};

export const editProductReview = async ({ io, productId, review }) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw Error('Product does not exist.');
    const reviewToUpdate = product.reviews.find((review) => review._id === reviewId);

    product.reviews = product.reviews.filter((review) => review._id !== reviewId);
    product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;
    product.numReviews = product.reviews.length;
    const updatedProduct = await product.save();

    console.log(`review: ${reviewId} deleted`);
    io.emit('delete-review-success', updatedProduct);
  } catch (error) {
    io.emit('create-review-fail', { message: error });
  }
};

export const deleteProductReview = async ({ io, productId, reviewId }) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw Error('Product does not exist.');

    product.reviews = product.reviews.filter((review) => review._id !== reviewId);
    product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;
    product.numReviews = product.reviews.length;
    const updatedProduct = await product.save();

    console.log(`review: ${reviewId} deleted`);
    io.emit('delete-review-success', updatedProduct);
  } catch (error) {
    io.emit('create-review-fail', { message: error });
  }
};

export default productRouter;
