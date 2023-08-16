import $ from 'jquery';
import io from 'socket.io-client';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { parseRequestUrl, showLoading, hideLoading } from './utils';
import Error404Screen from './screens/Error404Screen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import Header from './components/Header';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import Aside from './components/Aside';
import FashionNewsScreen from './screens/FashionNewsScreen';
import About from './screens/about';
import { API } from './config';
import { getUserInfo } from './localStorage';

const routes = {
  '/': HomeScreen,
  '/product/:id': ProductScreen,
  '/product/:id/edit': ProductEditScreen,
  '/order/:id': OrderScreen,
  '/cart/:id': CartScreen,
  '/cart': CartScreen,
  '/signin': SigninScreen,
  '/register': RegisterScreen,
  '/profile': ProfileScreen,
  '/shipping': ShippingScreen,
  '/payment': PaymentScreen,
  '/placeorder': PlaceOrderScreen,
  '/dashboard': DashboardScreen,
  '/productlist': ProductListScreen,
  '/orderlist': OrderListScreen,
  '/fashion-news': FashionNewsScreen,
  '/about': About,
};

const router = async (socket) => {
  showLoading();
  const { token } = getUserInfo();
  socket.auth = { token };

  const request = parseRequestUrl();
  const parseUrl =
    (request.resource ? `/${request.resource}` : '/') +
    (request.id ? '/:id' : '') +
    (request.verb ? `/${request.verb}` : '');

  const screen = routes[parseUrl] ? routes[parseUrl] : Error404Screen;
  const header = document.getElementById('header-container');
  header.innerHTML = await Header.render();
  await Header.after_render();

  const aside = document.getElementById('aside-container');
  aside.innerHTML = await Aside.render();
  await Aside.after_render();

  const main = document.getElementById('main-container');
  let isRouteProtected = true;
  if (screen.protect) isRouteProtected = await screen.protect();
  if (isRouteProtected) {
    main.innerHTML = await screen.render({ socket });
    if (screen.after_render) await screen.after_render({ socket });
  }
  hideLoading();
};

$(function () {
  const socket = io(API);

  socket.on('connect', () => console.log(`Connected as: ${socket.id}`));
  socket.on('disconnect', () => console.log('Connection Failed'));
  socket.on('connect_failed', () => console.log('Disconnected'));

  router(socket);

  window.addEventListener('hashchange', () => router(socket));
});
