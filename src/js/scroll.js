// --- 2. Scroll-based Animations ---
// Reveals attraction cards as they enter the viewport.
// OPTIMIZATION: Uses IntersectionObserver to avoid main-thread layout thrashing.

export function initScrollAnimations(attractionCards) {
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px 0px -15% 0px', // Trigger when element is 15% from bottom
    threshold: 0.1 // Trigger when 10% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-view');
        // Once revealed, we don't need to observe it anymore
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  attractionCards.forEach((card) => {
    observer.observe(card);
  });
}
