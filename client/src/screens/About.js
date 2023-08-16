import { CLIENT_URL } from '../config';
import { showLoading, hideLoading } from '../utils';

const About = {
  after_render: () => {
    function initMap() {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 31.9314, lng: 34.8015 }, // Center the map on Israel
        zoom: 8, // Zoom level
      });

      // Add markers with labels
      const marker1 = new google.maps.Marker({
        position: { lat: 31.9314, lng: 34.8015 }, // המכללה למנהל ראשון לציון ישראל
        map: map,
        label: {
          text: 'Opening Hours: 9 AM - 6 PM',
          color: 'black',
          fontWeight: 'bold',
        },
      });

      const marker2 = new google.maps.Marker({
        position: { lat: 31.7683, lng: 35.2137 }, // ירושלים ממילא
        map: map,
        label: {
          text: 'Opening Hours: 10 AM - 7 PM',
          color: 'black',
          fontWeight: 'bold',
        },
      });
    }
    var googleMapsScript = document.createElement('script');
    googleMapsScript.src =
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyBcpns1lMrNW0KJoI-u8dB2DPJk52i8ZJY';
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    googleMapsScript.type = 'text/javascript';
    googleMapsScript.onload = initMap;

    document.head.appendChild(googleMapsScript);
  },
  render: async () => {
    showLoading();

    hideLoading();

    return `<div>
        <div class="about-container">

        <div class="about-sub-container">
        <h1>About US</h1>
                <p>
                Welcome to our fashion ecommerce website! We are a passionate team dedicated to
                bringing you the latest trends and styles in the world of fashion. Our mission is to provide
                you with a seamless shopping experience and help you express your unique sense of style.
                Get to know the faces behind the brand
                </p>
        </div>
        <div class="facebook-badge-container">
        <div class="facebook-badge-header">
            <div class="facebook-badge-icon"></div>
            <div class="facebook-badge-title">Follow Us on Facebook</div>
        </div>
        <div class="facebook-badge-body">
            <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100095308253237&tabs&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=511370415862232" width="340" height="130" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
        </div>
        </div>
        <h2>Our Team</h2>
        <div class="about-team-member">
            <img src="${CLIENT_URL}/nadavchen.jpg" alt="NadavChen">
            <div>
                <h3>Nadav Chen</h3>
                <p>Co-founder & DevOps & Frontend Developer</p>
                <a href="https://www.linkedin.com/in/nadavchen97/" target="_blank">LinkedIn- Connect Link</a>
            </div>
        </div>
        <div class="about-team-member">
            <img src="${CLIENT_URL}/avichai.jpg" alt="Avichai">
            <div>
                <h3>Avichai</h3>
                <p>Co-founder & Back-End Developer</p>
                <a href="https://www.linkedin.com/in/avichai-iluz-46ba51130/" target="_blank">LinkedIn - Connect Link</a>
            </div>
        </div>
        <div class="about-team-member">
            <img src="${CLIENT_URL}/ariel.jpg" alt="ArielAviv">
            <div>
                <h3>Arial Aviv</h3>
                <p>Co-founder & Frontend Developer</p>
                <a href="https://www.linkedin.com/in/ariel-aviv-626713250/" target="_blank">LinkedIn- Connect Link</a>
            </div>
        </div>
    </div>
    
    <h1 style="font-weight:bold; display:flex; justify-content: center;">Our branches</h1>
    <div id="map" style="width: 100%; height: 400px;"></div>
    
    </div>`;
  },
};

export default About;
