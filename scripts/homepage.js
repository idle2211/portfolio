document.addEventListener('DOMContentLoaded', async () => {
    const videoElement = document.getElementById('header-video');
    const videosFolder = './assets/videos/';
    
    // List of videos (add your filenames here)
    const videoFiles = [
        'header-video1.mp4',
        'electro_house.mp4',
        'header-video3.mp4',
        'header-video4.mp4',
        'header-video5.mp4',
        'coloring.mp4'
    ];

    // Shuffle videos for random order
    const shuffledVideos = videoFiles.sort(() => Math.random() - 0.5);

    let currentVideoIndex = 0;

    // Function to play a video with fade-in and fade-out
    function playVideo() {
        videoElement.style.opacity = 0; // Fade out

        setTimeout(() => {
            // Set the next video source
            videoElement.src = videosFolder + shuffledVideos[currentVideoIndex];
            videoElement.load(); // Reload the video source
            currentVideoIndex = (currentVideoIndex + 1) % shuffledVideos.length; // Move to next video
            videoElement.play();

            setTimeout(() => {
                videoElement.style.opacity = 1; // Fade in
            }, 500); // Wait for fade-out to complete
        }, 1000); // Duration of fade-out
    }

    // Loop videos every 10 seconds with fade-in/out effect
    function startSlideshow() {
        playVideo(); // Play the first video

        // Schedule the next video to play every 10 seconds
        setInterval(() => {
            playVideo();
        }, 10000); // 10 seconds per video
    }

    // Start the slideshow
    startSlideshow();

    const descriptions = document.querySelectorAll('.description');
    let currentIndex = 0;
    
    const button = document.getElementById('speedUp'); 
    
    // Initialize by showing the first description
    gsap.set(descriptions[currentIndex], {
      opacity: 1,
      xPercent: -50,
      yPercent: -55,
      left: "50%",
      top: "50%",
      minWidth: "550px"
    });
    
    button.addEventListener('click', () => {
      // Disable the button to prevent multiple rapid clicks
      button.disabled = true;
    
      const currentDescription = descriptions[currentIndex];
      const nextIndex = (currentIndex + 1) % descriptions.length;
      const nextDescription = descriptions[nextIndex];
    
      currentDescription.style.minWidth = "769px";
    
      // Animate the current description out (center to bottom-right)
      gsap.to(currentDescription, {
        opacity: 0,
        xPercent: -100,
        yPercent: -200,
        left: "100%",
        top: "200%",
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          currentDescription.classList.remove('active');
          currentDescription.style.minWidth = "550px"; // Reset to the responsive value
        }
      });
    
      // Animate the next description in (top-left to center)
      gsap.fromTo(
        nextDescription,
        {
          opacity: 0,
          xPercent: -100,
          yPercent: -200,
          left: "30%",
          top: "0%"
        },
        {
          opacity: 1,
          xPercent: -50,
          yPercent: -55,
          left: "50%",
          top: "50%",
          duration: 2,
          ease: "power2.inOut"
        }
      );
    
      // Update index and active class
      nextDescription.classList.add('active');
      currentIndex = nextIndex;
    
      // Re-enable the button after the animation duration
      setTimeout(() => {
        button.disabled = false;
      }, 1500); // Disable button for the duration of the animation (2 seconds in this case)
    }); 
  });

document.addEventListener("mousemove", (event) => {
    const header = document.getElementById("main-header");
    const video = document.getElementById("header-video");
    const headerOverlay = document.getElementById("header-overlay");
    const headerTitle = headerOverlay.querySelector("h1");
  
    const { width, height, left, top } = header.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
  
    const offsetX = (event.clientX - centerX) / width; 
    const offsetY = (event.clientY - centerY) / height; 
  
    const videoMovement = -20; 
    const textMovement = 15; 
  
    const distanceFromCenter = Math.sqrt(offsetX ** 2 + offsetY ** 2);
  
    // Scale adjustment
    const scaleFactor = 1 - Math.min(distanceFromCenter, 0.5) * 0.03; // Scale decreases up to 20% max
  
    // Move the video slightly opposite to cursor and adjust scale
    video.style.transform = `translate(${offsetX * videoMovement}px, ${offsetY * videoMovement}px) scale(${scaleFactor})`;
  
    // Move the title slightly with the cursor
    headerTitle.style.transform = `translate(${offsetX * textMovement}px, ${offsetY * textMovement}px)`;
});




  

