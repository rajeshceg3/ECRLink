// --- 2. Scroll-based Animations ---
// Reveals attraction cards as they enter the viewport.

function debounce(func, wait = 20) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export function initScrollAnimations(attractionCards) {
  function handleScroll() {
    const triggerBottom = (window.innerHeight / 5) * 4;

    attractionCards.forEach((card) => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < triggerBottom) {
        card.classList.add('is-in-view');
      }
    });
  }

  handleScroll(); // Run once on load to check initial view
  window.addEventListener('scroll', debounce(handleScroll, 20));
}
