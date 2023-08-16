import { showLoading, hideLoading } from '../utils';
import { getFashionNews } from '../api';
import { CLIENT_URL } from '../config';

const FashionNewsScreen = {
  after_render: () => {},
  render: async () => {
    showLoading();
    const allNews = await getFashionNews();
    hideLoading();

    if (allNews.error) return `<div class="errorMsg">${allNews.error}</div>`;

    return `
    <div>
      <img class="canvas-image" src="${CLIENT_URL}/cavas-image.jpg"></img>
      <video class="video-container" controls>
       <source src="${CLIENT_URL}/movie.mp4" type="video/mp4">
      </video>
    </div>

    <div>
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
      </ul>
    </div>`;
  },
};

export default FashionNewsScreen;
