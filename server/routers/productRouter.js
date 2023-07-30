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

function updateProductReviewStats(product) {
  if (!product)
    throw Error('oldProduct not passed as argument to the function: "updateProductReviewStats"');

  /* eslint-disable no-param-reassign */
  product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;
  product.numReviews = product.reviews.length;
  /* eslint-enable no-param-reassign */
}

export const createProductReview = async ({ io, productId, review }) => {
  try {
    // 1) Find Product.
    const product = await Product.findById(productId);
    if (!product) throw Error('Product does not exist.');

    // 2) Update & save Product.
    // eslint-disable-next-line no-param-reassign
    delete review._id;
    product.reviews.push(review);
    updateProductReviewStats(product);
    const updatedProduct = await product.save();

    console.log(`review: ${review._id} created`);
    io.emit('create-review-success', updatedProduct);
  } catch (error) {
    io.emit('create-review-fail', { message: error });
  }
};

export const editProductReview = async ({ io, productId, review }) => {
  try {
    console.log('edit start!');
    // 1) Find Product.
    const product = await Product.findById(productId);
    if (!product) throw Error('Product does not exist.');

    // 2) Find Review in the reviews array.
    const oldReviewIndex = product.reviews.findIndex((r) => r.id === review._id);
    if (oldReviewIndex === -1) throw Error('Review does not exist. try again');

    // 3) Update & save Product.
    product.reviews[oldReviewIndex] = review;
    updateProductReviewStats(product);
    const updatedProduct = await product.save();

    console.log(`review: ${review._id} edited`);
    io.emit('edit-review-success', updatedProduct);
  } catch (error) {
    io.emit('edit-review-fail', { message: error });
  }
};

export const deleteProductReview = async ({ io, productId, reviewId }) => {
  try {
    // 1) Find Product.
    const product = await Product.findById(productId);
    if (!product) throw Error('Product does not exist.');

    // 2) Update & save Product.
    product.reviews = product.reviews.filter((review) => review.id !== reviewId);
    updateProductReviewStats(product);
    const updatedProduct = await product.save();

    io.emit('delete-review-success', updatedProduct);
  } catch (error) {
    io.emit('delete-review-fail', { message: error });
  }
};

export default productRouter;
