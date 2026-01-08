// --- 1.1 Content Renderer ---
import { attractions } from './data.js';

export function renderAttractions(containerElement) {
  // Clear existing attractions
  containerElement.innerHTML = '';

  if (!attractions || attractions.length === 0) {
    containerElement.innerHTML = '<p class="error-message">No destinations found.</p>';
    return;
  }

  attractions.forEach((attraction) => {
    const section = document.createElement('section');
    section.className = 'attraction';
    section.id = attraction.id;

    section.innerHTML = `
      <article class="attraction-card" tabindex="0">
        <div class="card-content">
          <figure class="card-image">
            <img
              src="${attraction.image}"
              alt="${attraction.alt}"
              loading="lazy"
            />
          </figure>
          <div class="card-title">
            <h2>${attraction.title}</h2>
            <p>${attraction.subtitle}</p>
          </div>
        </div>
        <div class="sanctuary-content">
          <p>${attraction.description}</p>
          <div class="sanctuary-actions">
            <a
              href="${attraction.mapLink}"
              target="_blank"
              rel="noopener noreferrer"
              class="icon-button"
              aria-label="Location"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </a>
            <button
              type="button"
              class="icon-button add-to-rhythm"
              aria-label="Add to Itinerary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </article>
    `;

    containerElement.appendChild(section);
  });
}
