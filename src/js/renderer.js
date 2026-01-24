// --- 1.1 Content Renderer ---
import { attractions } from './data.js';

function createElement(tag, className = '', attributes = {}, textContent = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'style' && value && typeof value === 'object') {
      Object.entries(value).forEach(([styleKey, styleValue]) => {
        element.style.setProperty(styleKey, styleValue);
      });
    } else {
      element.setAttribute(key, value);
    }
  });
  if (textContent) element.textContent = textContent;
  return element;
}

function createSVG(className, elements) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  if (className) svg.setAttribute('class', className);
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');

  elements.forEach(({ tag, attrs }) => {
    const child = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([key, value]) => child.setAttribute(key, value));
    svg.appendChild(child);
  });

  return svg;
}

function generateSrcSet(url) {
  try {
    const urlObj = new URL(url);
    // Ensure we are working with Unsplash to avoid breaking other potential image sources
    if (!urlObj.hostname.includes('unsplash.com')) return null;

    urlObj.searchParams.set('w', '400');
    const w400 = urlObj.toString();

    urlObj.searchParams.set('w', '800');
    const w800 = urlObj.toString();

    urlObj.searchParams.set('w', '1200');
    const w1200 = urlObj.toString();

    return `${w400} 400w, ${w800} 800w, ${w1200} 1200w`;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to generate srcset:', e);
    return null;
  }
}

/**
 * Renders the attraction cards into the provided container element.
 * Handles dynamic image loading, responsive srcset generation, and interaction bindings.
 *
 * @param {HTMLElement} containerElement - The DOM element where attractions will be rendered.
 */
export function renderAttractions(containerElement) {
  // Clear existing attractions - safer than innerHTML as we are modifying the DOM tree directly
  while (containerElement.firstChild) {
    containerElement.removeChild(containerElement.firstChild);
  }

  if (!attractions || attractions.length === 0) {
    const errorContainer = createElement('div', 'error-container');
    const errorIcon = createSVG('error-icon', [
       { tag: 'circle', attrs: { cx: '12', cy: '12', r: '10' } },
       { tag: 'line', attrs: { x1: '12', y1: '8', x2: '12', y2: '12' } },
       { tag: 'line', attrs: { x1: '12', y1: '16', x2: '12', y2: '16' } }
    ]);
    const errorMsg = createElement('p', 'error-message', {}, 'No destinations found. The path is unclear.');

    errorContainer.appendChild(errorIcon);
    errorContainer.appendChild(errorMsg);
    containerElement.appendChild(errorContainer);
    return;
  }

  attractions.forEach((attraction, index) => {
    const section = createElement('section', 'attraction', { id: attraction.id });

    const article = createElement('article', 'attraction-card', {
      style: { 'transition-delay': `${index * 100}ms` }
    });

    // --- Card Content (Interactive Trigger) ---
    const cardContent = createElement('div', 'card-content', {
      tabindex: '0',
      role: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': 'false',
      'aria-label': `Open sanctuary for ${attraction.title}`
    });

    const figure = createElement('figure', 'card-image');

    // Skeleton Loader
    const skeleton = createElement('div', 'image-skeleton');
    figure.appendChild(skeleton);

    const imgAttrs = {
      src: attraction.image,
      alt: attraction.alt,
      loading: 'lazy'
    };

    const srcSet = generateSrcSet(attraction.image);
    if (srcSet) {
      imgAttrs.srcset = srcSet;
      // Responsive sizes:
      // Mobile: 100vw (minus padding)
      // Tablet/Desktop: ~40vw (card width)
      imgAttrs.sizes = '(max-width: 768px) 90vw, 40vw';
    }

    const img = createElement('img', '', imgAttrs);

    // Image Load Handler
    img.onload = () => {
      figure.classList.add('img-loaded');
      // Remove skeleton from DOM after transition to clean up
      setTimeout(() => {
        if (skeleton.parentNode) {
          skeleton.parentNode.removeChild(skeleton);
        }
      }, 500);
    };

    // Error Handler
    img.onerror = () => {
      // Keep skeleton or show error state
      // For now, we leave the dark background
      figure.classList.add('img-loaded'); // Reveal the broken image icon or alt text space
    };

    figure.appendChild(img);

    const cardTitleDiv = createElement('div', 'card-title');
    const h2 = createElement('h2', '', {}, attraction.title);
    const pSubtitle = createElement('p', '', {}, attraction.subtitle);
    cardTitleDiv.appendChild(h2);
    cardTitleDiv.appendChild(pSubtitle);

    cardContent.appendChild(figure);
    cardContent.appendChild(cardTitleDiv);

    // --- Sanctuary Content ---
    const sanctuaryContent = createElement('div', 'sanctuary-content');
    const pDesc = createElement('p', '', {}, attraction.description);

    const sanctuaryActions = createElement('div', 'sanctuary-actions');

    // Location Link
    const locationLink = createElement('a', 'icon-button', {
      href: attraction.mapLink,
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': 'Location'
    });
    locationLink.appendChild(createSVG('', [
      { tag: 'path', attrs: { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' } },
      { tag: 'circle', attrs: { cx: '12', cy: '10', r: '3' } }
    ]));

    // Add/Remove Button
    const addBtn = createElement('button', 'icon-button add-to-rhythm', {
      type: 'button',
      'aria-label': 'Add to Itinerary'
    });

    // Icon Add
    addBtn.appendChild(createSVG('icon-add', [
      { tag: 'line', attrs: { x1: '12', y1: '5', x2: '12', y2: '19' } },
      { tag: 'line', attrs: { x1: '5', y1: '12', x2: '19', y2: '12' } }
    ]));
    // Icon Remove
    addBtn.appendChild(createSVG('icon-remove', [
      { tag: 'polyline', attrs: { points: '20 6 9 17 4 12' } }
    ]));

    sanctuaryActions.appendChild(locationLink);
    sanctuaryActions.appendChild(addBtn);

    sanctuaryContent.appendChild(pDesc);
    sanctuaryContent.appendChild(sanctuaryActions);

    article.appendChild(cardContent);
    article.appendChild(sanctuaryContent);
    section.appendChild(article);

    containerElement.appendChild(section);
  });
}
