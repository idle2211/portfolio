document.addEventListener('DOMContentLoaded', function () {


  const isPhone = window.innerWidth <= 768; // Adjust the breakpoint as needed


if (!isPhone) {
  // Initialize Lenis for smooth scrolling
  window.lenis = new Lenis({
    smooth: true,
    smoothTouch: true,
    duration: 1.2,
  });
  

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        lenis.scrollTo(targetElement, {
          offset: 0, 
          duration: 1.2
        });
      }
    });
  });
}

const dotsElement = document.getElementById("dots");
const loadingScreen = document.getElementById("loading-screen");
const dots = "...";
const duration = 500; 
const interval = duration / dots.length; 

const typeDots = () => {
    dotsElement.textContent = " "; // Start with an empty element
    let currentDot = 0;

    const addDot = () => {
        // Stop the loop if the loading screen is not displayed
        if (loadingScreen.style.display === "none") {
            return;
        }

        if (currentDot < dots.length) {
            dotsElement.textContent += dots[currentDot];
            currentDot++;
            setTimeout(addDot, interval);
        } else {
            // Clear the dots and restart the animation after a short pause
            setTimeout(() => {
                typeDots(); // Loop the animation
            }, interval);
        }
    };

    // Start adding dots after a brief delay to ensure it starts empty
    setTimeout(addDot, interval);
};

window.addEventListener('load', () => {
    if (loadingScreen) {
        loadingScreen.classList.add('hidden'); // Hide when page has fully loaded
        document.querySelector("body").style.overflow = "visible";
        
        // Stop the dots animation when the page is fully loaded and loading screen is hidden
        setTimeout(() => {
            loadingScreen.style.display = "none"; 
        }, 2000); 
    }
});

typeDots(); // Start the typing dots animation

});

const navbarIcon = document.querySelector('.navbar-icon');
const heartDefault = document.querySelector('.heart.default');
const heartAnimation = document.querySelector('.heart.animation');
const heartGlowing = document.querySelector('.heart.glowing');
const animationDuration = 280; 

// Function to handle hover
navbarIcon.addEventListener('mouseenter', () => {
  // Reset the animation by changing the src to force it to reload
  heartAnimation.src = "assets/icons/heart_icon_spin.webp"; // Reset the animation WebP

  // Show the animation and hide the default heart
  heartDefault.style.opacity = 0;
  heartAnimation.style.opacity = 1;
  heartGlowing.style.opacity = 0; // Ensure glowing heart is hidden initially

  // After the animation duration, switch to the glowing heart
  setTimeout(() => {
    heartAnimation.style.opacity = 0; // Hide the spinning animation
    heartGlowing.style.opacity = 1; // Show the glowing heart
  }, animationDuration); // This matches the duration of the WebP animation
});

navbarIcon.addEventListener('mouseleave', () => {
  // Hide the animation and glowing heart, and show the default heart when not hovering
  heartAnimation.style.opacity = 0;
  heartGlowing.style.transition = "opacity 1s ease;"
  heartGlowing.style.opacity = 0;
  heartDefault.style.opacity = 1;
});

