// --- 4. Itinerary Logic ---
import { showToast } from './toast.js';

export function initItinerary(addToRhythmButtons) {
  let itinerary = [];
  const countDisplay = document.querySelector('.itinerary-count');

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

  // --- Initialization ---
  loadItinerary();
  updateUI();

  // --- Event Listener: Cross-Tab Synchronization ---
  // If the user updates the itinerary in another tab, this ensures the UI stays in sync.
  window.addEventListener('storage', (event) => {
    if (event.key === 'itinerary') {
      loadItinerary();
      updateUI();
    }
  });

  // --- Click Handlers ---
  addToRhythmButtons.forEach((button) => {
    // Find the parent attraction to get the ID
    const card = button.closest('.attraction-card');
    const section = card.closest('.attraction');
    const id = section.id;

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Stop the click from bubbling up to the card

      // Update Local State
      if (itinerary.includes(id)) {
        itinerary = itinerary.filter((item) => item !== id);
        showToast('Removed from Itinerary');
      } else {
        itinerary.push(id);
        showToast('Added to Itinerary');
      }

      // Persist to Storage
      try {
        localStorage.setItem('itinerary', JSON.stringify(itinerary));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to save itinerary to localStorage:', error);
        showToast('Failed to save progress');
      }

      // Update UI (Current Tab)
      updateUI();
    });
  });
}
