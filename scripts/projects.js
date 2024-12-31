document.addEventListener('DOMContentLoaded', function () {
  const personalButton = document.getElementById('btn-personal');
  const schoolButton = document.getElementById('btn-school');
  const projectsContainer = document.getElementById('projects-container');

  
    // Initialize LazyLoad
    const lazyloadInstance = new LazyLoad({
      elements_selector: ".lazyload",  // Selects elements with the 'lazyload' class
    });

// Fetch JSON and Render Projects
fetch('data/projects.json')
  .then((response) => response.json())
  .then((data) => {
    // Define personal and school projects from the fetched data
    const personalProjects = [
      ...data.portfolio.personalProjects.music,
      ...data.portfolio.personalProjects.art,
      ...data.portfolio.personalProjects.animation,
    ];
    const schoolProjects = data.portfolio.professionalProjects.professional;

      


// Function to Render Projects
function renderProjects(projects, isProfessional = false) {
  // Shuffle the projects array to randomize the order
  const shuffledProjects = [...projects].sort(() => Math.random() - 0.5);

  projectsContainer.innerHTML = ''; // Clear previous content

  shuffledProjects.forEach((project) => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';

    // Only add an icon if it's not a professional project
    let iconHtml = '';
    if (!isProfessional) {
      // Determine which icon to show based on the project type
      let iconPath = '';
      if (project.skills.includes('Music Production')) {
        iconPath = '/assets/icons/Music.svg'; // Music icon
      } else if (project.skills.includes('Digital Painting') || project.skills.includes('Character Design')) {
        iconPath = '/assets/icons/Art.svg'; // Art icon
      } else if (project.skills.includes('Animation') || project.skills.includes('Storyboarding')) {
        iconPath = '/assets/icons/Animation.svg'; // Animation icon
      }

      // Only include the icon HTML if an icon path was found
      if (iconPath) {
        iconHtml = `
          <div class="project-icon">
            <img src="${iconPath}" alt="${project.title} type icon" class="project-type-icon" />
          </div>
        `;
      }
    }

    projectCard.innerHTML = `
      ${iconHtml}
      <img src="${project.thumbnail}" alt="${project.title}" class="project-thumbnail" />
      <div class="project-info">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      </div>
    `;

    // If it's a professional project, wrap it in a link
    if (isProfessional) {
      const link = document.createElement('a');
      link.href = `project-details.html?id=${project.id}`; // Link to the project details page with the project ID
      link.className = 'project-link project-card'; // Optional class for styling the link
      projectCard.className = ''
      link.appendChild(projectCard); // Append the project card to the link
      projectsContainer.appendChild(link); // Append the link to the container
    } else {
      // If it's not a professional project, show it as usual (open in modal)
      projectCard.addEventListener('click', () => openModal(project));
      projectsContainer.appendChild(projectCard); // Append the project card directly to the container
    }
  });
}

// Function to open modal
function openModal(project) {
  const modal = document.querySelector('#project-modal');
  const modalContent = document.querySelector('#modal-content');

  // Prevent scrolling when the modal is open
  document.body.classList.add('no-scroll');
  if (window.lenis) {
    window.lenis.stop(); // Stop Lenis from handling the scroll
  }

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

  // Delay the actual image/gif loading by 50ms
  setTimeout(() => {
    if (lazyloadInstance) {
      lazyloadInstance.update(); // Trigger LazyLoad to start loading
    }
  }, 50); // Delay time in milliseconds
}



// Determine which projects to show based on URL hash
function showProjectsBasedOnHash() {
  const hash = window.location.hash; // Get the current URL hash

  if (hash === '#school') {
    // Render professional projects (pass isProfessional = true)
    renderProjects(schoolProjects, true);
    highlightButton(schoolButton);
  } else {
    // Render personal projects (pass isProfessional = false)
    renderProjects(personalProjects, false);
    highlightButton(personalButton);
  }
}

// Highlight the active button
function highlightButton(button) {
  [personalButton, schoolButton].forEach((btn) =>
    btn.classList.remove('active')
  );
  button.classList.add('active');
}

// Event Listeners for Buttons
personalButton.addEventListener('click', () => {
  window.location.hash = '#personal'; // Change the hash to #personal
  showProjectsBasedOnHash(); // Re-render based on the new hash
});

schoolButton.addEventListener('click', () => {
  window.location.hash = '#school'; // Change the hash to #school
  showProjectsBasedOnHash(); // Re-render based on the new hash
});

// Initial Render Based on Hash or Default
showProjectsBasedOnHash();
})
.catch((error) => {
console.error('Error loading JSON:', error);
});
});



  