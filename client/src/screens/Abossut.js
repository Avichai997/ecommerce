import { showLoading, hideLoading } from '../utils';

const About = {
  after_render: () => {},
  render: async () => {
    showLoading();
    
    hideLoading();


    return `
    <div>
      <img class="canvas-image" src="./src/assets/images/cavas-image.jpg"></img>
      <video class="video-container" controls>
       <source src="./src/assets/video/movie.mp4" type="video/mp4">
      </video>
    </div>
    `;
  },
};

export default About;
