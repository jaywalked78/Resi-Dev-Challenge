import './styles.css';
import './scripts.js';
import { initializePWA, setupConnectivityHandling } from './utils/pwa.js';

// Initialize PWA functionality
document.addEventListener('DOMContentLoaded', () => {
  initializePWA();
  setupConnectivityHandling();
});

// Any additional initialization code
console.log('Webpack build initialized');