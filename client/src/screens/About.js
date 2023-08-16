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

    return `<div>
        <div class="about-container">
        <h1>About US</h1>
                <p>
                Welcome to our fashion ecommerce website! We are a passionate team dedicated to
                bringing you the latest trends and styles in the world of fashion. Our mission is to provide
                you with a seamless shopping experience and help you express your unique sense of style.
                Get to know the faces behind the brand:
                </p>
        <h2>Our Team</h2>
        <div class="about-team-member">
            <img src="./src/assets/images/nadavchen.jpg" alt="NadavChen">
            <div>
                <h3>Nadav Chen</h3>
                <p>Co-founder & DevOps & Frontend Developer</p>
                <a href="https://www.linkedin.com/in/nadavchen97/" target="_blank">LinkedIn- Connect Link</a>
            </div>
        </div>
        <div class="about-team-member">
            <img src="./src/assets/images/avichai.jpg" alt="Avichai">
            <div>
                <h3>Avichai</h3>
                <p>Co-founder & Back-End Developer</p>
                <a href="https://www.linkedin.com/in/avichai-iluz-46ba51130/" target="_blank">LinkedIn - Connect Link</a>
            </div>
        </div>
        <div class="about-team-member">
            <img src="./src/assets/images/ariel.jpg" alt="ArielAviv">
            <div>
                <h3>Arial Aviv</h3>
                <p>Co-founder & Frontend Developer</p>
                <a href="https://www.linkedin.com/in/ariel-aviv-626713250/" target="_blank">LinkedIn- Connect Link</a>
            </div>
        </div>
    </div>
    <div class="map-container">
        <iframe
            width="600"
            height="450"
            style="border:0"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBcpns1lMrNW0KJoI-u8dB2DPJk52i8ZJY&q=Space+Needle,Seattle+WA">
        </iframe>
    </div>

        </div>`;
  },
};

export default About;
