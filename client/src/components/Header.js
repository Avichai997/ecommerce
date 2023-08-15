import $ from 'jquery';
import { getUserInfo } from '../localStorage';
import { debounce, parseRequestUrl } from '../utils';
import Aside from './Aside';

const Header = {
  render: () => {
    const { name, isAdmin } = getUserInfo();
    const match = /searchKeyword=([^&]+)/.exec(document.location.hash);
    const searchKeywordValue = match ? match[1] : '';

    return ` 
      <div class="brand">
        <button id="aside-open-button">
          &#9776;
        </button>
        <a href="/#/">E-commerce</a>
      </div>
      <div class="search">
      <form class="search-form"  id="search-form">
        <input type="text" name="searchKeyword" id="searchKeyword" value="${searchKeywordValue}" placeholder="search our store..."/> 
        <button type="submit"><i class="fa fa-search"></i></button>
      </form>        
      </div>
      <div class="links">
      ${name ? `<a href="/#/profile">${name}</a>` : '<a href="/#/signin">Sign-In</a>'}    
        <a href="/#/fashion-news">Fashion-news</a>
        <a href="/#/about">About</a>
        <a href="/#/cart">Cart</a>
        ${isAdmin ? '<a href="/#/dashboard">Dashboard</a>' : ''}
      </div>
    `;
  },
  after_render: () => {
    function setSearchUrl() {
      const match = /searchKeyword=([^&]+)/.exec(document.location.hash);
      const oldSearchKeyword = match ? match[1] : '';
      const newSearchKeyword = document.getElementById('searchKeyword').value;
      if (oldSearchKeyword)
        document.location.hash = document.location.hash.replace(
          `searchKeyword=${oldSearchKeyword}`,
          `searchKeyword=${newSearchKeyword}`
        );
      else {
        if (document.location.hash === '' || document.location.hash === '#/')
          document.location.hash = `#/?searchKeyword=${newSearchKeyword}`;
        else
          document.location.hash = `${document.location.hash
            .replace(`searchKeyword=`, '')
            .replace(`&searchKeyword=`, '')}&searchKeyword=${newSearchKeyword}`
            .replace('#/?&', '#/?')
            .replace('&&', '&');
      }
    }
    document.getElementById('search-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      setSearchUrl();
    });

    document.getElementById('searchKeyword').addEventListener(
      'input',
      debounce(async (e) => {
        e.preventDefault();
        setSearchUrl();
      }, 500)
    );

    document.getElementById('aside-open-button').addEventListener('click', async () => {
      document.getElementById('aside-container').classList.add('open');
    });

    // focus the end of input of the inputElement
    if (document.location.hash.includes('searchKeyword=')) {
      const inputElement = document.getElementById('searchKeyword');
      inputElement.focus();
      const length = inputElement.value.length;
      inputElement.setSelectionRange(length, length);
    }
  },
};
export default Header;
