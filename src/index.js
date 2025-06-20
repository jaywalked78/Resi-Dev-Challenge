import './styles.css';
import './scripts.js';

// Initialize functionality
document.addEventListener('DOMContentLoaded', async () => {
  // Completely disable PWA and clear any existing service workers
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
        console.log('Service worker removed');
      }
    } catch (error) {
      console.error('Failed to unregister service worker:', error);
    }
  }
  
  console.log('App initialized - PWA disabled for demo stability');
});

// Any additional initialization code
console.log('Webpack build initialized');