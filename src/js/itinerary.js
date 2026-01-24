// --- 4. Itinerary Logic ---
import { showToast } from './toast.js';
import { attractions } from './data.js';

/**
 * Initializes the Itinerary management system.
 * Handles adding/removing items, persistence to localStorage, and the Itinerary Modal UI.
 *
 * @param {NodeListOf<Element>} addToRhythmButtons - The buttons used to toggle items in the itinerary.
 */
export function initItinerary(addToRhythmButtons) {
  let itinerary = [];
  const countDisplay = document.querySelector('.itinerary-count');
  const statusContainer = document.querySelector('.itinerary-status');

  // Helper: Create Element
  function createElement(tag, className = '', attributes = {}, textContent = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    if (textContent) element.textContent = textContent;
    return element;
  }

  // Helper: Load data from storage
  function loadItinerary() {
    try {
      itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to load itinerary from localStorage:', error);
      itinerary = [];
    }
  }

  // Helper: Save data to storage
  function saveItinerary() {
    try {
      localStorage.setItem('itinerary', JSON.stringify(itinerary));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save itinerary to localStorage:', error);
      showToast('Failed to save progress');
    }
  }

  // Helper: Update a single button's state
  function updateButtonState(button, id) {
    if (itinerary.includes(id)) {
      button.classList.add('added');
      button.setAttribute('aria-label', 'Remove from Itinerary');
    } else {
      button.classList.remove('added');
      button.setAttribute('aria-label', 'Add to Itinerary');
    }
  }

  // Helper: Update the entire UI (Counter + All Buttons)
  function updateUI() {
    // Update Counter
    if (countDisplay) {
      countDisplay.textContent = itinerary.length;

      // Trigger Pulse Animation
      if (statusContainer) {
          statusContainer.classList.remove('pulse');
          // Force reflow
          void statusContainer.offsetWidth;
          statusContainer.classList.add('pulse');

          // Remove class after animation
          setTimeout(() => {
              statusContainer.classList.remove('pulse');
          }, 300);
      }
    }

    // Update All Buttons
    addToRhythmButtons.forEach((button) => {
      const card = button.closest('.attraction-card');
      if (card) {
        const section = card.closest('.attraction');
        if (section && section.id) {
            updateButtonState(button, section.id);
        }
      }
    });
  }

  // --- Modal Logic ---
  let modalOverlay = null;
  let lastFocusedElement = null;

  function renderItineraryModal() {
    // If modal doesn't exist, create it
    if (!modalOverlay) {
      modalOverlay = createElement('div', 'itinerary-modal-overlay');

      const modal = createElement('div', 'itinerary-modal');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'itinerary-title');

      const header = createElement('div', 'itinerary-header');
      header.appendChild(createElement('h2', '', { id: 'itinerary-title' }, 'Your Journey'));

      const closeBtn = createElement('button', 'itinerary-close-btn', { 'aria-label': 'Close Itinerary' });
      closeBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      closeBtn.addEventListener('click', toggleItinerary);
      header.appendChild(closeBtn);

      const list = createElement('div', 'itinerary-list');

      modal.appendChild(header);
      modal.appendChild(list);
      modalOverlay.appendChild(modal);

      document.body.appendChild(modalOverlay);

      // Close on outside click
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) toggleItinerary();
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
          toggleItinerary();
        }
      });
    }

    // Populate List
    const listContainer = modalOverlay.querySelector('.itinerary-list');
    listContainer.innerHTML = ''; // Clear current list

    if (itinerary.length === 0) {
      const emptyState = createElement('div', 'itinerary-empty-state', {}, 'Your path is yet to be chosen.');
      listContainer.appendChild(emptyState);
    } else {
      itinerary.forEach(id => {
        const itemData = attractions.find(a => a.id === id);
        if (!itemData) return;

        const itemEl = createElement('div', 'itinerary-item');

        const thumb = createElement('img', 'itinerary-item-thumb', { src: itemData.image, alt: itemData.title });

        const info = createElement('div', 'itinerary-item-info');
        const title = createElement('div', 'itinerary-item-title', {}, itemData.title);
        const subtitle = createElement('div', 'itinerary-item-subtitle', {}, itemData.subtitle);
        info.appendChild(title);
        info.appendChild(subtitle);

        const removeBtn = createElement('button', 'itinerary-remove-btn', { 'aria-label': `Remove ${itemData.title}` });
        removeBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

        removeBtn.addEventListener('click', () => {
          removeFromItinerary(id);
        });

        itemEl.appendChild(thumb);
        itemEl.appendChild(info);
        itemEl.appendChild(removeBtn);
        listContainer.appendChild(itemEl);
      });
    }
  }

  function setInert(state) {
    const horizonContainer = document.querySelector('.horizon-container');
    if (horizonContainer) {
      if (state) {
        horizonContainer.setAttribute('inert', '');
      } else {
        horizonContainer.removeAttribute('inert');
      }
    }
  }

  function toggleItinerary() {
    if (!modalOverlay) renderItineraryModal(); // Ensure it exists

    // Toggle Logic
    const isOpen = modalOverlay.classList.contains('open');
    if (isOpen) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = ''; // Restore scroll
      setInert(false);
      // Restore focus
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    } else {
      lastFocusedElement = document.activeElement;
      renderItineraryModal(); // Re-render content to ensure freshness
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock scroll
      setInert(true);
      // Move focus to close button for immediate accessibility
      const closeBtn = modalOverlay.querySelector('.itinerary-close-btn');
      if (closeBtn) closeBtn.focus();
    }
  }

  function removeFromItinerary(id) {
    itinerary = itinerary.filter(item => item !== id);
    saveItinerary();
    updateUI();
    renderItineraryModal(); // Re-render the list immediately
    showToast('Removed from Itinerary');
  }

  // --- Initialization ---
  loadItinerary();
  updateUI();

  // --- Event Listener: Itinerary Status Click ---
  if (statusContainer) {
    statusContainer.addEventListener('click', (e) => {
      e.preventDefault();
      toggleItinerary();
    });
  }

  // --- Event Listener: Cross-Tab Synchronization ---
  // If the user updates the itinerary in another tab, this ensures the UI stays in sync.
  window.addEventListener('storage', (event) => {
    if (event.key === 'itinerary') {
      loadItinerary();
      updateUI();
      if (modalOverlay && modalOverlay.classList.contains('open')) {
          renderItineraryModal();
      }
    }
  });

  // --- Click Handlers (Add/Remove Buttons) ---
  addToRhythmButtons.forEach((button) => {
    // Find the parent attraction to get the ID
    const card = button.closest('.attraction-card');
    const section = card.closest('.attraction');
    const id = section.id;

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Stop the click from bubbling up to the card

      // Ripple Effect
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600); // Clean up after animation

      // Update Local State
      if (itinerary.includes(id)) {
        removeFromItinerary(id);
      } else {
        itinerary.push(id);
        showToast('Added to Itinerary');
        saveItinerary();
        updateUI();
      }
    });
  });
}
