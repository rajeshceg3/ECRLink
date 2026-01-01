import { applyTemporalTheme } from './theme.js';
import { initScrollAnimations } from './scroll.js';
import { initSanctuary } from './sanctuary.js';
import { initItinerary } from './itinerary.js';

document.addEventListener('DOMContentLoaded', () => {
  const horizonContainer = document.querySelector('.horizon-container');
  const attractionCards = document.querySelectorAll('.attraction-card');
  const closeButton = document.querySelector('.sanctuary-close-button');
  const addToRhythmButtons = document.querySelectorAll('.add-to-rhythm');

  applyTemporalTheme();
  initScrollAnimations(attractionCards);
  initSanctuary(horizonContainer, attractionCards, closeButton);
  initItinerary(addToRhythmButtons);
});
