import { applyTemporalTheme } from './theme.js';
import { initScrollAnimations } from './scroll.js';
import { initSanctuary } from './sanctuary.js';
import { initItinerary } from './itinerary.js';
import { renderAttractions } from './renderer.js';

document.addEventListener('DOMContentLoaded', () => {
  const horizonContainer = document.querySelector('.horizon-container');
  const attractionsList = document.querySelector('.attractions-list');

  // 1. Render content dynamically
  renderAttractions(attractionsList);

  // 2. Select elements *after* rendering
  const attractionCards = document.querySelectorAll('.attraction-card');
  const closeButton = document.querySelector('.sanctuary-close-button');
  const addToRhythmButtons = document.querySelectorAll('.add-to-rhythm');

  // 3. Initialize logic
  applyTemporalTheme();
  initScrollAnimations(attractionCards);
  initSanctuary(horizonContainer, attractionCards, closeButton);
  initItinerary(addToRhythmButtons);

  // Respect reduced motion preferences for the video
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const video = document.querySelector('.landing-video');
  if (mediaQuery.matches && video) {
    video.pause();
    video.removeAttribute('autoplay');
  }
});
