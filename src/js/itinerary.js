// --- 4. Itinerary Logic ---
import { showToast } from './toast.js';

export function initItinerary(addToRhythmButtons) {
  let itinerary = [];
  const countDisplay = document.querySelector('.itinerary-count');

  try {
    itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
  } catch (error) {
    console.warn('Failed to load itinerary from localStorage:', error);
    itinerary = [];
  }

  function updateDisplay() {
    if (countDisplay) {
      countDisplay.textContent = itinerary.length;
    }
  }

  // Initialize display
  updateDisplay();

  function updateButtonState(button, id) {
    if (itinerary.includes(id)) {
      button.classList.add('added');
      button.setAttribute('aria-label', 'Remove from Itinerary');
    } else {
      button.classList.remove('added');
      button.setAttribute('aria-label', 'Add to Itinerary');
    }
  }

  addToRhythmButtons.forEach((button) => {
    // Find the parent attraction to get the ID
    const card = button.closest('.attraction-card');
    const section = card.closest('.attraction');
    const id = section.id;

    // Set initial state
    updateButtonState(button, id);

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Stop the click from bubbling up to the card

      if (itinerary.includes(id)) {
        itinerary = itinerary.filter((item) => item !== id);
        showToast('Removed from Itinerary');
      } else {
        itinerary.push(id);
        showToast('Added to Itinerary');
      }

      try {
        localStorage.setItem('itinerary', JSON.stringify(itinerary));
      } catch (error) {
        console.error('Failed to save itinerary to localStorage:', error);
        showToast('Failed to save progress');
      }
      updateButtonState(button, id);
      updateDisplay();
    });
  });
}
