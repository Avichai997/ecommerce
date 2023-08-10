import Product from '../models/productModel';
import { getOne, updateOne, deleteOne, createOne, getAll } from './handlerFactory';

// export const getAllProducts = expressAsyncHandler(async (req, res) => {
//   const searchKeyword = req.query.searchKeyword
//     ? {
//         name: {
//           $regex: req.query.searchKeyword,
//           $options: 'i',
//         },
//       }
//     : {};
//   const products = await Product.find({ ...searchKeyword });

//   res.status(201).json(products);
// });

export const getAllProducts = getAll(Product);
export const getProduct = getOne(Product);
export const createProduct = createOne(Product);
export const updateProduct = updateOne(Product);
export const deleteProduct = deleteOne(Product);

// Socket.io products controllers:
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
