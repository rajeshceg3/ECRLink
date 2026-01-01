// --- 3. Sanctuary View Logic ---
// Manages the opening and closing of the focused view for each attraction.

export function initSanctuary(horizonContainer, attractionCards, closeButton) {
  let lastFocusedElement;

  function openSanctuary(card) {
    if (horizonContainer.classList.contains('sanctuary-is-open')) return;

    lastFocusedElement = document.activeElement;

    horizonContainer.classList.add('sanctuary-is-open');
    card.classList.add('is-active-sanctuary');
    document.body.style.overflow = 'hidden';

    // Focus the close button for accessibility
    closeButton.focus();
  }

  function closeSanctuary() {
    const activeSanctuary = document.querySelector('.is-active-sanctuary');
    horizonContainer.classList.remove('sanctuary-is-open');
    if (activeSanctuary) {
      activeSanctuary.classList.remove('is-active-sanctuary');
    }
    document.body.style.overflow = '';

    // Return focus to the element that opened the sanctuary
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  attractionCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // Do not open if the click is on a button inside the sanctuary actions
      if (e.target.closest('.sanctuary-actions')) {
        return;
      }
      openSanctuary(card);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openSanctuary(card);
      }
    });
  });

  closeButton.addEventListener('click', closeSanctuary);
}
