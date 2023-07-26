import $ from 'jquery';
import {
  parseRequestUrl,
  showLoading,
  hideLoading,
  showMessage,
  rerender,
  showEditReview,
  getReviewData,
} from '../utils';
import { getProduct } from '../api';
import Rating from '../components/Rating';
import Review from '../components/Review';
import { getUserInfo } from '../localStorage';
import { API } from '../config';

const ProductScreen = {
  after_render: ({ socket }) => {
    const user = getUserInfo();
    const { id: productId } = parseRequestUrl();
    $('#add-button').on('click', () => (document.location.hash = `/cart/${productId}`));
    $('.review-delete').on('click', function () {
      const reviewId = $(this).attr('review_id');
      socket.emit('delete-review', { productId, reviewId });
    });
    $('.review-edit').on('click', async function () {
      const reviewId = $(this).attr('review_id');
      const product = await getProduct(productId);
      const review = product.reviews.find((review) => review._id === reviewId);
      showEditReview(review);
    });

    socket.on('create-review-success', (product) => {
      $('html, body').animate({ scrollTop: $(document).height() }, 1000);
      rerender(ProductScreen, { socket, product });
    });
    socket.on('delete-review-success', (product) => {
      rerender(ProductScreen, { socket, product });
    });
    socket.on('create-review-fail', (error) => {
      showMessage(error.message);
    });
    socket.on('delete-review-fail', (error) => {
      showMessage(error.message);
    });

    const submitReviewForm = async (e, socketEvent) => {
      e.preventDefault();
      showLoading();

      socket.emit(socketEvent, {
        productId,
        review: getReviewData(socketEvent),
      });

      hideLoading();
    };

    $('#add-review-form').on('submit', (e) => submitReviewForm(e, 'create-review'));
    $('#edit-review-form').on('submit', (e) => submitReviewForm(e, 'edit-review'));
  },
  render: async ({ product }) => {
    const { id: productId } = parseRequestUrl();
    showLoading();
    // if(!product)
    product = product || (await getProduct(productId));
    hideLoading();

    if (product.error) return `<div>${product.error}</div>`;

    const userInfo = getUserInfo();

    return `
    <div class="content">
      <div class="back-to-home-page">
        <a href="/#/">Back to home page </a>
      </div>
      <div class="details">
        <div class="details-image">
          <img src="${API}${product.image}" alt="${product.name}" />
        </div>
        <div class ="detail-right">
        <div class="details-info">
          <ul>
            <li>
              <h1>${product.name}</h1>
            </li>
            <li>
            ${Rating.render({
              value: product.rating,
              text: `${product.numReviews} reviews`,
            })}
            </li>
            <li>
              Price: <strong>$${product.price}</strong>
            </li>
            <li>
              Description:
              <div>
                ${product.description}
              </div>
            </li>
          </ul>
        </div>
        <div class="details-action">
            <ul>
              <li>
                Price: $${product.price}
              </li>
              <li>
                Status : 
                  ${
                    product.countInStock > 0
                      ? `<span class="success">In Stock (${product.countInStock} available)</span>`
                      : `<span class="error">Unavailable</span>`
                  }
              </li>
              <li>
                <button id="add-button" class="fw primary" ${
                  product.countInStock > 0 ? '' : 'disabled'
                }>Add to Cart </div>
            </ul>
        </div>
      </div >
      </div>
      <div class="content">
      <h2>Reviews</h2>
      ${product.reviews.length === 0 ? `<div>There is no review.</div>` : ''}  
      <ul class="review">
      ${product.reviews
        .map(
          (review) =>
            `<li>
            <div><b>${review.name}</b></div>
            <div class="review-container">
            ${Rating.render({
              value: review.rating,
            })}
              <div>
              ${review.createdAt.substring(0, 10)}
              </div>
            </div>
            <div class="review">
              ${review.comment}
            </div>

            ${
              userInfo._id === review.user
                ? `<span class="review-control review-delete" review_id="${review._id}">
                  <i class='fa fa-trash'></i> delete
                </span>
                <span class="review-control review-edit" review_id="${review._id}">
                  <i class='fa fa-edit'></i> edit
                </span>`
                : ''
            }
          </li>`
        )
        .join('\n')}

        <li>
       
        ${
          userInfo.name
            ? `${Review.render({
                title: 'Create new Review:',
                formId: 'add-review-form',
              })}`
            : ` <div>
              Please <a href="/#/signin">Signin</a> to write a review.
            </div>`
        }
      </li>
    </ul> 

      </div>
    </div>`;
  },
};
export default ProductScreen;
