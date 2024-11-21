document.addEventListener('DOMContentLoaded', function () {
    // Register the A-Frame component inside DOMContentLoaded
    AFRAME.registerComponent("ar-controller", {
        init: function () {
            // Function to hide text and background
            function hideTextAndBackground() {
                startText.style.display = "none";
                backgroundImage.style.display = "none";
            }
            
            // Get references to the necessary DOM elements
            const target = document.getElementById("target");
            const secondTarget = document.getElementById("secondTarget");
            const video = document.getElementById("video");
            const audioButton = document.getElementById("audioButton");
            const audioPromptIcon = document.getElementById("audioPromptIcon")
            const plane = document.getElementById("videooverlay");
            const startText = document.getElementById("startText");
            const backgroundImage = document.getElementById("background");
            const backButton = document.getElementById("backButton");
            const modelObject = document.getElementById("modelObject");
            
            // Initialize variables
            var played = false;
            
            // Event listener for first target found
            target.addEventListener("targetFound", () => {
                console.log("Video target found");
                this.found = true;
                hideTextAndBackground();
                document.getElementById("audioPrompt").style.display = "flex"; 
                if (!played) {
                    plane.emit("fadein");
                    video.play();
                    video.addEventListener("ended", function videoend(e) {
                        played = true;
                    }, false);
                }
            });
            
            // Event listener for first target lost
            target.addEventListener("targetLost", () => {
                console.log("Video target lost");
                this.found = false;
                hideTextAndBackground();
                document.getElementById("audioPrompt").style.display = "none";
                if (!played) {
                    video.pause();
                    startText.style.display = "block";
                    backgroundImage.style.display = "block";
                }
            });
            
            // Event listener for second target found
            secondTarget.addEventListener("targetFound", () => {
                console.log("3D Model target found");
                modelObject.setAttribute('visible', true);
                hideTextAndBackground();
            });

            // Event listener for second target lost
            secondTarget.addEventListener("targetLost", () => {
                console.log("3D Model target lost");
                modelObject.setAttribute('visible', false);
                startText.style.display = "block";
                backgroundImage.style.display = "block";
            });

            // Event listener for back button click
            backButton.addEventListener('click', () => {
                window.location.href = 'index.html';
            });

            // Delay the display of start text and background image
            setTimeout(function() {
                startText.style.display = "block";
                backgroundImage.style.display = "block";
            }, 3000);
        }
    });
        function toggleAudio() {
          const video = document.getElementById("video");  // Get a reference to the video element
          video.muted = !video.muted;

          const audioPromptIcon = document.getElementById("audioPromptIcon");  // Icon update
          if (video.muted) {
              audioPromptIcon.src = '.\\Assets\\mute-icon.svg';
          } else {
              audioPromptIcon.src = '.\\Assets\\unmute-icon.svg';  // Replace with your unmute icon path
          }
      }

    // Attach the toggle function to button click
    const audioButton = document.getElementById("audioButton");  // Get a reference to the audio button
    audioButton.addEventListener('click', toggleAudio);

    // Wait for the A-Frame scene to be fully loaded
    document.querySelector('a-scene').addEventListener('loaded', function () {
        // Code for touch controls
        let modelContainer = document.getElementById("secondTarget");  // assuming the model is within this entity
        modelContainer.addEventListener("touchmove", function(event) {
            if (event.touches.length === 1) {
                let rotation = modelContainer.getAttribute("rotation");
                let movementX = event.touches[0].clientX - event.touches[0].radiusX;
                let movementY = event.touches[0].clientY - event.touches[0].radiusY;

                rotation.x += movementY * 0.1;
                rotation.y += movementX * 0.1;

                modelContainer.setAttribute("rotation", rotation);
            }
            if (event.touches.length === 2) {
                let scale = modelContainer.getAttribute("scale");
                let dx = event.touches[0].clientX - event.touches[1].clientX;
                let dy = event.touches[0].clientY - event.touches[1].clientY;
                let distance = Math.sqrt(dx * dx + dy * dy);

                scale.x = distance * 0.0001;
                scale.y = distance * 0.0001;
                scale.z = distance * 0.0001;

                modelContainer.setAttribute("scale", scale);
            }
        });
    });
});
