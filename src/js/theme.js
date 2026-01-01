// --- 1. The Temporal Engine ---
// Sets the color theme based on the time of day.
export function applyTemporalTheme() {
  const hour = new Date().getHours();
  const root = document.documentElement;

  if (hour >= 5 && hour < 12) {
    // Morning (5am - 12pm)
    root.style.setProperty('--bg-gradient-start', '#e4e8f0');
    root.style.setProperty('--bg-gradient-end', '#f2f4f7');
    root.style.setProperty('--color-text', '#333');
    root.style.setProperty('--color-text-serene', '#555');
  } else if (hour >= 12 && hour < 18) {
    // Afternoon (12pm - 6pm)
    root.style.setProperty('--bg-gradient-start', '#f5f1e8');
    root.style.setProperty('--bg-gradient-end', '#fdfaf2');
    root.style.setProperty('--color-text', '#4a4032');
    root.style.setProperty('--color-text-serene', '#6e6050');
  } else {
    // Evening & Night (6pm - 5am)
    root.style.setProperty('--bg-gradient-start', '#1d2b45');
    root.style.setProperty('--bg-gradient-end', '#3a4a6e');
    root.style.setProperty('--color-text', '#e5e5e5');
    root.style.setProperty('--color-text-serene', '#b0b0b0');
    root.style.setProperty('--color-ribbon', '#98a8ce');
  }
}
