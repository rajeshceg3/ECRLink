import { showToast } from './toast.js';

export function initPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          // Check for updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content is available; please refresh.
                  showToast('New version available. Refresh to update.');
                } else {
                  // Content is cached for offline use.
                  showToast('Ready for offline use.');
                }
              }
            };
          };
        })
        .catch((error) => {
            // Fail silently or log to analytic service
            // eslint-disable-next-line no-console
            console.warn('Service Worker registration failed: ', error);
        });
    });
  }
}
