document.addEventListener('DOMContentLoaded', function () {
  // Initialize LazyLoad
  const lazyloadInstance = new LazyLoad({
    elements_selector: ".lazyload",  // Selects elements with the 'lazyload' class
  });

  // Function to render projects
  function renderProjects(projects, containerId, maxProjects, randomize = false) {
    const container = document.querySelector(`#${containerId} .projects-row`);
  
    // Check if the container exists
    if (!container) {
      console.error(`Container with ID "${containerId}" not found.`);
      return;
    }
  
    let displayedProjects;
  
    if (randomize) {
      // Randomly shuffle the projects and select the first `maxProjects`
      displayedProjects = [...projects]
        .sort(() => Math.random() - 0.5) // Shuffle the array
        .slice(0, maxProjects);         // Take the first `maxProjects` items
    } else {
      // Take the first `maxProjects` projects
      displayedProjects = projects.slice(0, maxProjects);
    }
  
    displayedProjects.forEach((project, index) => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card';
  
      const isProfessional = containerId === 'school-projects'; // Adjusted check
  
      // Determine if an icon is needed for personal projects
      let iconHtml = '';
      if (!isProfessional) {
        let iconPath = '';
        if (project.skills.includes('Music Production')) {
          iconPath = '/portfolio/assets/icons/Music.svg'; // Music icon
        } else if (project.skills.includes('Digital Painting') || project.skills.includes('Character Design')) {
          iconPath = '/portfolio/assets/icons/Art.svg'; // Art icon
        } else if (project.skills.includes('Animation') || project.skills.includes('Storyboarding')) {
          iconPath = '/portfolio/assets/icons/Animation.svg'; // Animation icon
        }
  
        // Include the icon only if a valid path was determined
        if (iconPath) {
          iconHtml = `
            <div class="project-icon">
              <img src="${iconPath}" alt="${project.title} type icon" class="project-type-icon" />
            </div>
          `;
        }
      }
  
      // Render the project card as a link for professional projects
      if (isProfessional) {
        const projectLink = document.createElement('a');
        projectLink.href = `project-details.html?id=${project.id}`; // Link to project details page
        projectLink.className = 'project-link';
  
        projectLink.innerHTML = `
          ${iconHtml}
          <img src="${project.thumbnail}" alt="${project.title}" class="project-thumbnail" />
          <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
          </div>
        `;
  
        projectCard.appendChild(projectLink); // Append the link to the card
      } else {
        // For non-professional projects, we keep the modal opening functionality
        projectCard.innerHTML = `
          ${iconHtml}
          <img src="${project.thumbnail}" alt="${project.title}" class="project-thumbnail" />
          <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
          </div>
        `;
        projectCard.addEventListener('click', () => openModal(project)); // Open modal for non-professional projects
      }
  
      container.appendChild(projectCard);
    });
  }

  // Function to open modal
  function openModal(project) {
    const modal = document.querySelector('#project-modal');
    const modalContent = document.querySelector('#modal-content');

    // Prevent scrolling when the modal is open
    document.body.classList.add('no-scroll');
    window.lenis.stop(); // Stop Lenis from handling the scroll 

  
    // Start by displaying the placeholder
  let mediaElement = '';
  if (project.video) {
    // Render video without autoplay and add a play button
    mediaElement = `
      <div class="modal-video-container">
        <video src="${project.video}" controls preload="metadata" class="modal-video"></video>
        <div class="video-overlay">
          <span class="play-button"></span>
        </div>
      </div>
    `;
  } else if (project.gif) {
    mediaElement = `
      <img src="${project.placeholder}" data-src="${project.gif}" class="lazyload" alt="${project.title} Animation" />
    `;
  } else if (project.image) {
    mediaElement = `
      <img src="${project.placeholder}" data-src="${project.image}" class="lazyload" alt="${project.title} Image" />
    `;
  }


    modalContent.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="modal-media">${mediaElement}</div>
    `;

    modal.style.display = 'block';

    // Add click-to-play functionality for video
  if (project.video) {
    const video = modalContent.querySelector('.modal-video');
    const overlay = modalContent.querySelector('.video-overlay');
    overlay.addEventListener('click', () => {
      video.play();
      overlay.style.display = 'none'; // Hide the overlay and play button
    });
  }
  
    setTimeout(() => {
      // Trigger LazyLoad to start loading the image after the delay
      lazyloadInstance.update();
    }, 50); // Delay time in milliseconds
  }

    // Function to close modal
function closeModal() {
  const modal = document.querySelector('#project-modal');
  const video = modal.querySelector('.modal-video'); // Find the video element

  // Pause the video if it is playing
  if (video) {
    video.pause();
    video.currentTime = 0; // Reset video to the beginning
  }

  modal.style.display = 'none';

  // Restore scrolling when the modal is closed
  document.body.classList.remove('no-scroll');
  window.lenis.start(); // Start Lenis scroll behavior again
}

// Make closeModal globally accessible
window.closeModal = closeModal;

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
  const modal = document.querySelector('#project-modal');
  if (event.target === modal) {
    closeModal();
  }
});




  // Preload Images
  let imageCache = {}; // Object to hold the preloaded images

  function preloadImage(src) {
    return new Promise((resolve, reject) => {
      if (!src) {
        reject(new Error('No source provided'));
        return;
      }

      // Check if the image is already in cache
      if (imageCache[src]) {
        resolve(imageCache[src]);
        return;
      }

      const img = new Image();
      img.src = src;

      img.onload = () => {
        // Cache the loaded image for future use
        imageCache[src] = img;
        resolve(img);
      };

      img.onerror = () => reject(new Error(`Failed to load image at ${src}`));
    });
  }

  function preloadImages(projects) {
    const imagePromises = [];
  
    projects.forEach(project => {
      // Only preload the thumbnail if it exists and isn't already cached
      if (project.thumbnail && !imageCache[project.thumbnail]) {
        imagePromises.push(preloadImage(project.thumbnail));
      }
    });
  
    return Promise.all(imagePromises)
      .then(() => {
        console.log('Thumbnails preloaded and cached successfully');
      })
      .catch((error) => {
        console.error('Error preloading thumbnails:', error.message);
      });
  }
  
  // Fetch and process JSON data
  fetch('data/projects.json')
    .then(response => response.json())
    .then(data => {
      const personalProjects = [
        ...data.portfolio.personalProjects.music,
        ...data.portfolio.personalProjects.art,
        ...data.portfolio.personalProjects.animation,
      ];
  
      // Preload thumbnails and render projects after preloading is done
      preloadImages(personalProjects).then(() => {
        renderProjects(personalProjects, 'personal-projects', 3, true);
        renderProjects(data.portfolio.professionalProjects.professional, 'school-projects', 3);
        console.log('Thumbnails preloaded and projects rendered!');
      }).catch(error => console.error('Thumbnail preloading failed', error));
    })
    .catch(error => {
      console.error('Error loading JSON:', error);
    });
  
});
