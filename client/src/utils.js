import { getCartItems, getUserInfo } from './localStorage';

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

export const rerender = async (component, socket = null) => {
  document.getElementById('main-container').innerHTML = await component.render(socket);
  await component.after_render(socket);
};

export const showLoading = () => {
  document.getElementById('spinner').classList.add('active');
};

export const hideLoading = () => {
  document.getElementById('spinner').classList.remove('active');
};

export const showMessage = (message, callback) => {
  document.getElementById('message-overlay').innerHTML = `
  <div>
    <div id="message-overlay-content">${message}</div>
    <button id="message-overlay-close-button">OK</button>
  </div>
  `;
  document.getElementById('message-overlay').classList.add('active');
  document.getElementById('message-overlay-close-button').addEventListener('click', () => {
    document.getElementById('message-overlay').classList.remove('active');
    if (callback) {
      callback();
    }
  });
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
