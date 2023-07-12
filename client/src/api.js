import axios from 'axios';
import { apiUrl } from './config';
import { getUserInfo } from './localStorage';
import $ from 'jquery';

async function fetchData({
  url,
  method = 'GET',
  headers = {
    'Content-Type': 'application/json',
  },
  useAuth = false,
  data,
}) {
  try {
    if (!url) throw 'no url provided to request!';
    if (!['PUT', 'PATCH', 'POST', 'DELETE', 'GET'].includes(method))
      throw 'Fetch method not supported!';
    if (!data && ['PUT', 'PATCH', 'POST'].includes(method)) throw 'no data provided to request!';

    if (useAuth) headers.Authorization = `Bearer ${getUserInfo().token}`;

    const response = await new Promise(function (resolve, reject) {
      $.ajax({
        url,
        method,
        headers,
        data: JSON.stringify(data),
        success: (response) => resolve(response),
        error: (xhr, status, error) => reject(xhr.responseJSON.message),
      });
    });

    return response;
  } catch (error) {
    console.log(error);
    return { error: error || error?.message };
  }
}

export const getProducts = async ({ searchKeyword = '' }) => {
  let queryString = '?';
  if (searchKeyword) queryString += `searchKeyword=${searchKeyword}&`;

  const products = await fetchData({ url: `${apiUrl}/api/products${queryString}` });
  return products;
};

export const getProduct = async (id) => {
  const product = await fetchData({ url: `${apiUrl}/api/products/${id}` });
  return product;
};

export const createProduct = async () => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/products`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    // if (response.statusText !== "Created") {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    return { error: err.response.data.message || err.message };
  }
};

export const createReview = async (productId, review) => {
  const products = await fetchData({
    url: `${apiUrl}/api/products/${productId}/reviews`,
    method: 'POST',
    useAuth: true,
    data: review,
  });
  return products;
};

export const deleteProduct = async (productId) => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/products/${productId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    return { error: err.response.data.message || err.message };
  }
};

export const updateProduct = async (product) => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/products/${product._id}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: product,
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    return { error: err.response.data.message || err.message };
  }
};

export const uploadProductImage = async (formData) => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/uploads`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });
    // if (response.statusText !== "Created") {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    return { error: err.response.data.message || err.message };
  }
};

export const signin = async ({ email, password }) => {
  try {
    const response = await axios({
      url: `${apiUrl}/api/users/signin`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        email,
        password,
      },
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
};
export const register = async ({ name, email, password }) => {
  try {
    const response = await axios({
      url: `${apiUrl}/api/users/register`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        name,
        email,
        password,
      },
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
};
export const update = async ({ name, email, password }) => {
  try {
    const { _id, token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/users/${_id}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: {
        name,
        email,
        password,
      },
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
};

export const createOrder = async (order) => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: order,
    });
    // if (response.statusText !== "Created") {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    return { error: err.response ? err.response.data.message : err.message };
  }
};
export const getOrders = async () => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
};
export const deleteOrder = async (orderId) => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders/${orderId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    return { error: err.response.data.message || err.message };
  }
};
export const getOrder = async (id) => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    return { error: err.message };
  }
};
export const getMyOrders = async () => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders/mine`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    return { error: err.response ? err.response.data.message : err.message };
  }
};
export const getPaypalClientId = async () => {
  const response = await axios({
    url: `${apiUrl}/api/paypal/clientId`,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // if (response.statusText !== 'OK') {
  //   throw new Error(response.data.message);
  // }
  return response.data.clientId;
};

export const payOrder = async (orderId, paymentResult) => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders/${orderId}/pay`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: paymentResult,
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    return { error: err.response ? err.response.data.message : err.message };
  }
};
export const deliverOrder = async (orderId) => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders/${orderId}/deliver`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (err) {
    return { error: err.response ? err.response.data.message : err.message };
  }
};
export const getSummary = async () => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders/summary`,
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    });
    // if (response.statusText !== 'OK') {
    //   throw new Error(response.data.message);
    // }

    return response.data;
  } catch (err) {
    return { error: err.response ? err.response.data.message : err.message };
  }
};
