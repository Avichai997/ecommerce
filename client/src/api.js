import $ from 'jquery';
import { API, NEWS_API_KEY } from './config';
import { getUserInfo, setUserInfo } from './localStorage';
import { showMessage } from './utils';

async function fetchData({
  url,
  method = 'GET',
  headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  useAuth = false,
  data,
}) {
  try {
    if (!url) throw 'no url provided to request!';
    if (!['PUT', 'PATCH', 'POST', 'DELETE', 'GET'].includes(method))
      throw 'Fetch method not supported!';

    const defaultApiError = 'Problem connecting to server...';
    if (useAuth) headers.Authorization = `Bearer ${getUserInfo().token}`;

    const isFormData = data instanceof FormData;

    const response = await new Promise(function (resolve, reject) {
      $.ajax({
        url,
        method,
        headers,
        processData: isFormData && false,
        contentType: isFormData && false,
        data: isFormData ? data : JSON.stringify(data),
        success: (response) => resolve(response),
        error: (xhr, status, error) => {
          console.error({ xhr, status, error: error || defaultApiError });
          reject(xhr.responseJSON?.message || defaultApiError);
        },
      });
    });

    return response;
  } catch (error) {
    // if user set his local storage as admin we prevent him from restricted routes:
    if (error === 'Token is not valid for admin user') {
      setUserInfo({ ...getUserInfo(), isAdmin: false });
      document.location.hash = '/';
      showMessage('This route is only for logged in or Admin users!');
    }

    return { error: error };
  }
}

// products
export const getProducts = async (queryString = '') => {
  const products = await fetchData({
    url: `${API}/api/products${queryString}`,
  });

  return products;
};
export const getProduct = async (id) => {
  const product = await fetchData({ url: `${API}/api/products/${id}` });

  return product;
};
export const createProduct = async (productData) => {
  const product = await fetchData({
    url: `${API}/api/products`,
    method: 'POST',
    useAuth: true,
    data: productData,
  });

  return product;
};
export const updateProduct = async (product) => {
  const updatedProduct = await fetchData({
    url: `${API}/api/products/${product._id}`,
    method: 'PATCH',
    useAuth: true,
    data: product,
  });

  return updatedProduct;
};
export const deleteProduct = async (productId) => {
  const product = await fetchData({
    url: `${API}/api/products/${productId}`,
    method: 'DELETE',
    useAuth: true,
  });

  return product;
};
export const uploadProductImage = async (formData) => {
  const updatedProduct = await fetchData({
    url: `${API}/api/uploads`,
    method: 'POST',
    useAuth: true,
    headers: {},
    data: formData,
  });

  return updatedProduct;
};

// products reviews
export const createReview = async (productId, review) => {
  const products = await fetchData({
    url: `${API}/api/products/${productId}/reviews`,
    method: 'POST',
    useAuth: true,
    data: review,
  });

  return products;
};

// users
export const signin = async ({ email, password }) => {
  const user = await fetchData({
    url: `${API}/api/users/signin`,
    method: 'POST',
    data: {
      email,
      password,
    },
  });

  return user;
};
export const register = async ({ name, email, password }) => {
  const newUser = await fetchData({
    url: `${API}/api/users/register`,
    method: 'POST',
    data: {
      name,
      email,
      password,
    },
  });

  return newUser;
};
export const updateUser = async ({ name, email, password }) => {
  const { _id } = getUserInfo();

  const updatedUser = await fetchData({
    url: `${API}/api/users/${_id}`,
    method: 'PATCH',
    useAuth: true,
    data: {
      name,
      email,
      password,
    },
  });

  return updatedUser;
};

// orders
export const createOrder = async (order) => {
  const createdOrder = await fetchData({
    url: `${API}/api/orders`,
    method: 'POST',
    useAuth: true,
    data: order,
  });

  return createdOrder;
};
export const getOrders = async () => {
  const orders = await fetchData({ url: `${API}/api/orders`, useAuth: true });

  return orders;
};
export const deleteOrder = async (orderId) => {
  const order = await fetchData({
    url: `${API}/api/orders/${orderId}`,
    method: 'DELETE',
    useAuth: true,
  });

  return order;
};
export const getOrder = async (id) => {
  const order = await fetchData({
    url: `${API}/api/orders/${id}`,
    useAuth: true,
  });

  return order;
};
export const getMyOrders = async () => {
  const { _id } = getUserInfo();
  const myOrders = await fetchData({
    url: `${API}/api/orders/myOrders?user=${_id}`,
    useAuth: true,
  });

  return myOrders;
};

// payments with Paypal
export const getPaypalClientId = async () => {
  const response = await fetchData({ url: `${API}/api/paypal/clientId` });

  return response.clientId;
};
export const payOrder = async (orderId, paymentResult) => {
  const payedOrder = await fetchData({
    url: `${API}/api/orders/${orderId}/pay`,
    method: 'PATCH',
    useAuth: true,
    data: paymentResult,
  });

  return payedOrder;
};
export const deliverOrder = async (orderId) => {
  const deliveredOrder = await fetchData({
    url: `${API}/api/orders/${orderId}/deliver`,
    method: 'PATCH',
    useAuth: true,
  });

  return deliveredOrder;
};

// dashboard's aggregated data
export const getSummary = async () => {
  const summary = await fetchData({
    url: `${API}/api/orders/summary`,
    useAuth: true,
  });

  return summary;
};

export const getFashionNews = async () => {
  const news = await fetchData({
    url: `https://newsapi.org/v2/everything?q=fashion&apiKey=${NEWS_API_KEY}`,
    headers: {},
  });

  return news;
};
