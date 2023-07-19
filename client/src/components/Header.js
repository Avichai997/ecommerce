import { getUserInfo } from '../localStorage';
import { debounce, parseRequestUrl } from '../utils';

const Header = {
  render: () => {
    const { name, isAdmin } = getUserInfo();
    const { value } = parseRequestUrl();
    
    return ` 
      <div class="brand">
        <button id="aside-open-button">
          &#9776;
        </button>
        <a href="/#/">E-commerce</a>
      </div>
      <div class="search">
      <form class="search-form"  id="search-form">
        <input type="text" name="q" id="q" value="${value || ''}"/> 
        <button type="submit"><i class="fa fa-search"></i></button>
      </form>        
      </div>
      <div class="links">
      ${name ? `<a href="/#/profile">${name}</a>` : `<a href="/#/signin">Sign-In</a>`}    
        <a href="/#/fashion-news">Fashion-news</a>
        <a href="/#/cart">Cart</a>
        ${isAdmin ? `<a href="/#/dashboard">Dashboard</a>` : ''}
      </div>
    `;
  },
  after_render: () => {
    document.getElementById('search-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const searchKeyword = document.getElementById('q').value;
      document.location.hash = `/?q=${searchKeyword}`;
    });

    document.getElementById('q').addEventListener(
      'input',
      debounce(async (e) => {
        e.preventDefault();
        document.location.hash = `/?q=${e.target.value}`;
      }, 500)
    );

    document.getElementById('aside-open-button').addEventListener('click', async () => {
      document.getElementById('aside-container').classList.add('open');
    });

    // focus the end of input of the inputElement
    if (document.location.hash.startsWith('#/?q=')) {
      const inputElement = document.getElementById('q');
      inputElement.focus();
      const length = inputElement.value.length;
      inputElement.setSelectionRange(length, length);
    }
  },
};
export default Header;
