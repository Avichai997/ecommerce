import $ from 'jquery';
import Rating from '../components/Rating';
import { getProducts } from '../api';
import { API } from '../config';

const HomeScreen = {
  after_render: async () => {
    const SortPriceRegexp = /sort=([^&]+)/;
    const RatingRegexp = /rating=([^&]+)/;

    $('.filter-select')
      .find('select:first')
      .on('change', function () {
        const SortPriceVal = SortPriceRegexp.exec(document.location.hash)?.[1] || '';
        const RatingVal = RatingRegexp.exec(document.location.hash)?.[1] || '';

        const val = $(this).val();
        const hash = document.location.hash;
        let newHash = hash;
        if (hash === '' || hash === '#/') newHash = '#/?';

        if (newHash === '#/?') {
          newHash += val;
        } else {
          if (val.startsWith('sort')) {
            if (!newHash.includes('sort=')) newHash += '&sort=';
            newHash = newHash.replace(`sort=${SortPriceVal}`, val);
          } else if (val.startsWith('rating')) {
            if (!newHash.includes('rating=')) newHash += '&rating=';

            newHash =
              val === 'rating=All'
                ? newHash.replace(`rating=${RatingVal}`, '')
                : newHash.replace(`rating=${RatingVal}`, val);
          }
        }

        $('#price-filter').val('sort=' + SortPriceVal);
        RatingVal && $('#rating-filter').val('rating=' + RatingVal);
        document.location.hash = newHash;
      });

    const SortPriceVal = SortPriceRegexp.exec(document.location.hash)?.[1] || '';
    const RatingVal = RatingRegexp.exec(document.location.hash)?.[1] || '';
    $('#price-filter').val('sort=' + SortPriceVal);
    RatingVal && $('#rating-filter').val('rating=' + RatingVal);
  },
  render: async () => {
    const queryString = document.location.hash.replace('#/', '');
    const products = await getProducts(queryString);
    if (products.error) return `<div class="errorMsg">${products.error}</div>`;

    return `

    <div>
      <img class="welcome-image" src="public/front-image.jpg"></img>
    </div>
    <div class="products-filters">
      <div class="filter-select">
        <label for="price-filter">Sort by price:</label>
        <select name="price-filter" id="price-filter">
          <option value="sort=">-</option>
          <option value="sort=price">low to high</option>
          <option value="sort=-price">high to low</option>
        </select>
      </div>
      <div class="filter-select">
        <label for="rating-filter">Rating:</label>
        <select name="rating-filter" id="rating-filter">
          <option value="rating=All">All</option>
          <option value="rating=1">1</option>
          <option value="rating=1.5">1.5</option>
          <option value="rating=2">2</option>
          <option value="rating=2.5">2.5</option>
          <option value="rating=3">3</option>
          <option value="rating=3.5">3.5</option>
          <option value="rating=4">4</option>
          <option value="rating=4.5">4.5</option>
          <option value="rating=5">5</option>
        </select>
      </div>
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
    </ul>

    <div class="view-multi-column">
      <p>Welcome to our trendy and fashion-forward e-commerce store, your ultimate destination for all things stylish and apparel-related! Step into a world of exquisite fashion</p>
      <p>Our e-commerce platform is dedicated to fulfilling your fashion desires and helping you express your unique style effortlessly. Whether you're a fashion enthusiast looking to stay ahead of the latest trends or someone seeking timeless classics, we've got you covered with a diverse collection that caters to every taste and occasion.</p>
      <p>At our clothing store, we believe that fashion is more than just clothes; it's a reflection of your personality and a way to make a statement. With our carefully curated selection of apparel, you can create chic ensembles that exude confidence and leave a lasting impression.</p>
    </div>
    `;
  },
};
export default HomeScreen;
