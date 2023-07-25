// Function to create the YouTube video player
function onYouTubeIframeAPIReady() {
  // https://www.youtube.com/watch?v=Zzs6kLlkAUQ
  const videoId = 'Zzs6kLlkAUQ';

  // Create the YouTube video player
  new YT.Player('player', {
    height: '360', // Set the height of the player
    width: '640', // Set the width of the player
    videoId: videoId,
    events: {
      // You can add event handlers here if needed
    },
  });
}

    // <div id="player"></div>
    // <script src="https://www.youtube.com/iframe_api"></script>
    // <script src="script.js"></script>

