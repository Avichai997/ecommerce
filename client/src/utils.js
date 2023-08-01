import { getCartItems, getUserInfo } from './localStorage';
import Review from './components/Review';
import $ from 'jquery';

export const parseRequestUrl = () => {
  const address = document.location.hash.slice(1).split('?')[0];
  const queryString =
    document.location.hash.slice(1).split('?').length === 2
      ? document.location.hash.slice(1).split('?')[1]
      : '';

  const url = address.toLowerCase() || '/';
  const r = url.split('/');
  const q = queryString.split('=');

  return {
    resource: r[1],
    id: r[2],
    verb: r[3],
    name: q[0],
    value: q[1],
  };
};

export const rerender = async (component, props) => {
  document.getElementById('main-container').innerHTML = await component.render(
    props,
  );
  await component.after_render(props);
};

export const showLoading = () => {
  document.getElementById('spinner').classList.add('active');
};

export const hideLoading = () => {
  document.getElementById('spinner').classList.remove('active');
};

export const showMessage = (message, callback) => {
  $('#message-overlay').html(`
  <div>
    <div id="message-overlay-content">${message}</div>
    <button id="message-overlay-close-button">OK</button>
  </div>
  `);
  $('#message-overlay').addClass('active');

  $('#message-overlay-close-button').on('click', () => {
    $('#message-overlay').removeClass('active');
    if (callback) callback();
  });
};

export const showEditReview = (review) => {
  const formId = 'edit-review-form';
  $('#message-overlay').html(
    Review.render({
      title: 'Edit Your review:',
      showCancelBtn: true,
      formId,
      reviewId: review._id,
    }),
  );

  $('#message-overlay').addClass('active');
  $('#cancel').on('click', () => hideEditReview());
  $(`#${formId} #comment`).val(review.comment);
  $(`#${formId} #rating`).val(review.rating);
};
export const hideEditReview = () => {
  $('#message-overlay').removeClass('active');
};

export const redirectUser = () => {
  console.log(getCartItems().length);
  if (getCartItems().length !== 0) {
    document.location.hash = '/shipping';
  } else {
    document.location.hash = '/';
  }
};

export const debounce = (func, delay) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export const protectRoute = (response = null) => {
  if (!getUserInfo().isAdmin) {
    document.location.hash = '/';
    showMessage('This route is only for Admin users!');

    return false;
  } else return true;
};

export function getReviewData(socketEvent, id = false) {
  const user = getUserInfo();
  const formId = socketEvent.startsWith('create')
    ? 'add-review-form'
    : 'edit-review-form';

  return {
    _id: $('#edit-review-form').attr('review-id') || undefined,
    user: user._id,
    name: user.name,
    comment: $(`#${formId} #comment`).val(),
    rating: $(`#${formId} #rating`).val(),
  };
}
