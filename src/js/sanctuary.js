// --- 3. Sanctuary View Logic ---
// Manages the opening and closing of the focused view for each attraction.

export function initSanctuary(horizonContainer, attractionCards, closeButton) {
  let lastFocusedElement;

  function setInertToSiblings(isActive) {
    const header = document.querySelector('.landing-experience');

    if (isActive) {
      if (header) header.setAttribute('inert', '');

      // Inert all other attractions
      document.querySelectorAll('.attraction').forEach((section) => {
        if (!section.querySelector('.is-active-sanctuary')) {
          section.setAttribute('inert', '');
        }
      });
    } else {
      if (header) header.removeAttribute('inert');
      document.querySelectorAll('.attraction').forEach((section) => {
        section.removeAttribute('inert');
      });
    }
  }

  function openSanctuary(card, trigger) {
    if (horizonContainer.classList.contains('sanctuary-is-open')) return;

    lastFocusedElement = document.activeElement;

    horizonContainer.classList.add('sanctuary-is-open');
    card.classList.add('is-active-sanctuary');

    if (trigger) {
        trigger.setAttribute('aria-expanded', 'true');
    }

    document.body.style.overflow = 'hidden';

    setInertToSiblings(true);

    // Focus the close button for accessibility
    closeButton.focus();
  }

  function closeSanctuary() {
    const activeSanctuary = document.querySelector('.is-active-sanctuary');
    horizonContainer.classList.remove('sanctuary-is-open');
    if (activeSanctuary) {
      activeSanctuary.classList.remove('is-active-sanctuary');
      // Find the trigger to update aria-expanded
      const trigger = activeSanctuary.querySelector('.card-content');
      if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
      }
    }
    document.body.style.overflow = '';

    setInertToSiblings(false);

    // Return focus to the element that opened the sanctuary
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  attractionCards.forEach((card) => {
    // The interactive trigger is now the .card-content
    const trigger = card.querySelector('.card-content');

    if (trigger) {
        trigger.addEventListener('click', () => {
          openSanctuary(card, trigger);
        });

        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openSanctuary(card, trigger);
          }
        });
    }
  });

  closeButton.addEventListener('click', closeSanctuary);
}
