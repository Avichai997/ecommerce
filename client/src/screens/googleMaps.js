import { Loader } from '@googlemaps/js-api-loader';

function initMap() {
  // Replace the coordinates with the latitude and longitude of your store
  var myLatLng = { lat: 31.969574, lng: 34.771725 };

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 15, // You can adjust the zoom level to fit your needs
  });

  // Add a marker to the map at the specified location.
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'My Store Location', // Tooltip text for the marker
  });
}
