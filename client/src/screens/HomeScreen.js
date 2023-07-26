import Rating from '../components/Rating';
import { getProducts } from '../api';
import { parseRequestUrl } from '../utils';
import { API } from '../config';
import { Loader } from '@googlemaps/js-api-loader';

const HomeScreen = {
  render: async () => {
    const { value } = parseRequestUrl();
    const products = await getProducts({ searchKeyword: value });
    if (products.error) {
      return `<div class="error">${products.error}</div>`;
    }

    // Add the map container div to the rendered HTML

    const mapContainerHTML = `
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBcpns1lMrNW0KJoI-u8dB2DPJk52i8ZJY&callback=initMap" async defer></script>
      <script src="map.js"></script>
      <div id="map"></div>
      
    `;

    const productsListHTML = products
      .map(
        (product) => `
          <li>
            <div class="product">
              <a href="/#/product/${product._id}">
                <img src="${API}${product.image}" alt="${product.name}" />
              </a>
              <div class="product-name">
                <a href="/#/product/${product._id}">
                  ${product.name}
                </a>
              </div>
              <div class="product-rating">
                ${Rating.render({
                  value: product.rating,
                  text: `${product.numReviews} reviews`,
                })}
              </div>
              <div class="product-brand">
                ${product.brand}
              </div>
              <div class="product-price">
                $${product.price}
              </div>
            </div>
          </li>
        `
      )
      .join('\n');

    // Combine the map container and products list in the html variable
    const html = `
      <ul class="products">
        ${productsListHTML}
      </ul>
      ${mapContainerHTML}
    `;
    return html;
  },
};

export default HomeScreen;
