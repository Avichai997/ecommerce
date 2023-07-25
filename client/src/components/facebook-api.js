// JavaScript code to initialize the Facebook SDK
window.fbAsyncInit = function () {
  FB.init({
    appId: 'YOUR_APP_ID', // Replace 'YOUR_APP_ID' with your actual App ID
    cookie: true,
    xfbml: true,
    version: 'v13.0', // Use the desired version of the Facebook Graph API
  });
};

// Load the Facebook SDK asynchronously
(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

