document.addEventListener('DOMContentLoaded', () => {

    const horizonContainer = document.querySelector('.horizon-container');
    const attractionCards = document.querySelectorAll('.attraction-card');
    const closeButton = document.querySelector('.sanctuary-close-button');

    // --- 1. The Temporal Engine ---
    // Sets the color theme based on the time of day.
    function applyTemporalTheme() {
        const hour = new Date().getHours();
        const root = document.documentElement;

        if (hour >= 5 && hour < 12) { // Morning (5am - 12pm)
            root.style.setProperty('--bg-gradient-start', '#e4e8f0');
            root.style.setProperty('--bg-gradient-end', '#f2f4f7');
            root.style.setProperty('--color-text', '#333');
            root.style.setProperty('--color-text-serene', '#555');
        } else if (hour >= 12 && hour < 18) { // Afternoon (12pm - 6pm)
            root.style.setProperty('--bg-gradient-start', '#f5f1e8');
            root.style.setProperty('--bg-gradient-end', '#fdfaf2');
            root.style.setProperty('--color-text', '#4a4032');
            root.style.setProperty('--color-text-serene', '#6e6050');
        } else { // Evening & Night (6pm - 5am)
            root.style.setProperty('--bg-gradient-start', '#1d2b45');
            root.style.setProperty('--bg-gradient-end', '#3a4a6e');
            root.style.setProperty('--color-text', '#e5e5e5');
            root.style.setProperty('--color-text-serene', '#b0b0b0');
            root.style.setProperty('--color-ribbon', '#98a8ce');
        }
    }

    // --- 2. Scroll-based Animations ---
    // Reveals attraction cards as they enter the viewport.
    function debounce(func, wait = 15, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function handleScroll() {
        const triggerBottom = window.innerHeight / 5 * 4;

        attractionCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            if (cardTop < triggerBottom) {
                card.classList.add('is-in-view');
            }
        });
    }

    // --- 3. Sanctuary View Logic ---
    // Manages the opening and closing of the focused view for each attraction.
    attractionCards.forEach(card => {
        card.addEventListener('click', () => {
            // Do not open if already in sanctuary mode
            if (horizonContainer.classList.contains('sanctuary-is-open')) return;

            horizonContainer.classList.add('sanctuary-is-open');
            card.classList.add('is-active-sanctuary');
            document.body.style.overflow = 'hidden';
        });
    });

    closeButton.addEventListener('click', () => {
        const activeSanctuary = document.querySelector('.is-active-sanctuary');
        horizonContainer.classList.remove('sanctuary-is-open');
        if (activeSanctuary) {
            activeSanctuary.classList.remove('is-active-sanctuary');
        }
        document.body.style.overflow = '';
    });

    // --- Initializations ---
    applyTemporalTheme();
    setTimeout(() => {
        handleScroll(); // Run once on load to check initial view
    }, 100);
    window.addEventListener('scroll', debounce(handleScroll));

});
