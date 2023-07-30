import $ from 'jquery';
import { showLoading, hideLoading } from '../utils';
import { getFashionNews } from '../api';

const FashionNewsScreen = {
  after_render: () => {},
  render: async () => {
    showLoading();
    const allNews = await getFashionNews();
    hideLoading();

    if (allNews.error) return `<div class="errorMsg">${allNews.error}</div>`;

    return `
    <ul class="news">
      ${allNews.articles
        .filter((news) => news.urlToImage)
        .map(
          (news) => `
        <li>
          <div class="new">
            <a href="${news.urlToImage}" target="_blank">
              <img src="${news.urlToImage}" alt="${news.title}" />
            </a>
          <div class="new-name">
            <a href="${news.url}" target="_blank">
              ${news.title}
            </a>
          </div>
          
          <div class="new-brand">
            News source: ${news.source.name}
          </div>
          <div class="new-brand">
            Published at: ${news.publishedAt}
          </div>
          <div class="new-brand">
            author: ${news.author}
          </div>
          </div>
        </li>`
        )
        .join('\n')}
    `;
  },
};

export default FashionNewsScreen;
