import Rating from '../components/Rating';
import { getProducts } from '../api';
import { parseRequestUrl } from '../utils';
import { API } from '../config';

const HomeScreen = {
  render: async () => {
    const { value } = parseRequestUrl();
    const products = await getProducts({ searchKeyword: value });
    if (products.error) {
      return `<div class="error">${products.error}</div>`;
    }

    return `
    <div>
      <img class="welcome-image" src="./src/assets/images/front-image.jpg"></img>
    </div>
    <div class="view-multi-column">
      <p>Welcome to our trendy and fashion-forward e-commerce store, your ultimate destination for all things stylish and apparel-related! Step into a world of exquisite fashion</p>
      <p>Our e-commerce platform is dedicated to fulfilling your fashion desires and helping you express your unique style effortlessly. Whether you're a fashion enthusiast looking to stay ahead of the latest trends or someone seeking timeless classics, we've got you covered with a diverse collection that caters to every taste and occasion.</p>
      <p>At our clothing store, we believe that fashion is more than just clothes; it's a reflection of your personality and a way to make a statement. With our carefully curated selection of apparel, you can create chic ensembles that exude confidence and leave a lasting impression.</p>
    </div>
    <ul class="products">
      ${products
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
        .join('\n')}
    `;
  },
};
export default HomeScreen;
