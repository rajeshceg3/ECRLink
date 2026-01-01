// --- 4. Itinerary Logic ---

export function initItinerary(addToRhythmButtons) {
    // Load itinerary from local storage
    let itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];

    function updateButtonState(button, id) {
        if (itinerary.includes(id)) {
            button.classList.add('added');
            button.setAttribute('aria-label', 'Remove from Itinerary');
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else {
            button.classList.remove('added');
            button.setAttribute('aria-label', 'Add to Itinerary');
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
        }
    }

    addToRhythmButtons.forEach(button => {
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
                itinerary = itinerary.filter(item => item !== id);
                alert('Removed from Itinerary');
            } else {
                itinerary.push(id);
                alert('Added to Itinerary');
            }

            localStorage.setItem('itinerary', JSON.stringify(itinerary));
            updateButtonState(button, id);
        });
    });
}
