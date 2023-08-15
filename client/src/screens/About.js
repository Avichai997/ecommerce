import { showLoading, hideLoading } from '../utils';

const About = {
  after_render: () => {
    function onLinkedInLoad() {
      console.log('LinkedIn badge script has loaded!');
      // Perform any actions or initialization here
    }
    var linkedinScript = document.createElement('script');
    linkedinScript.src = 'https://platform.linkedin.com/badges/js/profile.js';
    linkedinScript.async = true;
    linkedinScript.defer = true;
    linkedinScript.type = 'text/javascript';
    linkedinScript.onload = onLinkedInLoad;

    document.head.appendChild(linkedinScript);
  },
  render: async () => {
    showLoading();

    hideLoading();

    return `<div ></div>`
  },
};

export default About;

