import axios from 'axios';
import { API, newsApiKey } from './config';
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
          console.error({ xhr, status, error });
          reject(xhr.responseJSON.message);
        },
      });
    });

    return response;
  } catch (error) {
    console.log(error);
    return { error: error || error?.message };
  }
}

// Products Routes
export const getProducts = async ({ searchKeyword = '' }) => {
  let queryString = '?';
  if (searchKeyword) queryString += `searchKeyword=${searchKeyword}&`;

  const products = await fetchData({ url: `${API}/api/products${queryString}` });
  return products;
};

export const getProduct = async (id) => {
  const product = await fetchData({ url: `${API}/api/products/${id}` });
  return product;
};

export const createProduct = async () => {
  const product = await fetchData({
    url: `${API}/api/products`,
    method: 'POST',
    useAuth: true,
  });

  return product;
};

export const createReview = async (productId, review) => {
  const products = await fetchData({
    url: `${API}/api/products/${productId}/reviews`,
    method: 'POST',
    useAuth: true,
    data: review,
  });

  return products;
};

export const deleteProduct = async (productId) => {
  const product = await fetchData({
    url: `${API}/api/products/${productId}`,
    method: 'DELETE',
    useAuth: true,
  });

  return product;
};

export const updateProduct = async (product) => {
  const updatedProduct = await fetchData({
    url: `${API}/api/products/${product._id}`,
    method: 'PUT',
    useAuth: true,
    data: product,
  });

  return updatedProduct;
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

export const signin = async ({ email, password }) => {
  try {
    const response = await axios({
      url: `${API}/api/users/signin`,
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
      url: `${API}/api/users/register`,
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
      url: `${API}/api/users/${_id}`,
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
      url: `${API}/api/orders`,
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
      url: `${API}/api/orders`,
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
      url: `${API}/api/orders/${orderId}`,
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
      url: `${API}/api/orders/${id}`,
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
      url: `${API}/api/orders/mine`,
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
    url: `${API}/api/paypal/clientId`,
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
      url: `${API}/api/orders/${orderId}/pay`,
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
      url: `${API}/api/orders/${orderId}/deliver`,
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
      url: `${API}/api/orders/summary`,
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

export const getFashionNews = async () => {
  const news = await fetchData({
    url: `https://newsapi.org/v2/everything?q=fashion&apiKey=${newsApiKey}`,
    headers: {},
  });
  return news;
};
