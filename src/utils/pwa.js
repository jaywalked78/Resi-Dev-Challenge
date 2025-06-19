/**
 * PWA Installation and Service Worker Registration
 * Handles Progressive Web App functionality
 */

let deferredPrompt;
let isServiceWorkerSupported = false;
let isInstallPromptAvailable = false;

/**
 * Initialize PWA functionality
 */
export function initializePWA() {
  registerServiceWorker();
  setupInstallPrompt();
  setupUpdateNotification();
  
  console.log('🚀 PWA initialized');
}

/**
 * Register service worker for offline functionality
 */
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      isServiceWorkerSupported = true;
      
      console.log('✅ Service Worker registered successfully:', registration.scope);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateNotification();
          }
        });
      });
      
      // Check for updates
      if (registration.waiting) {
        showUpdateNotification();
      }
      
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  } else {
    console.warn('⚠️ Service Workers not supported');
  }
}

/**
 * Setup install prompt handling
 */
function setupInstallPrompt() {
  // Listen for the install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📱 Install prompt available');
    e.preventDefault();
    deferredPrompt = e;
    isInstallPromptAvailable = true;
    showInstallBanner();
  });
  
  // Handle app installation
  window.addEventListener('appinstalled', (e) => {
    console.log('🎉 App installed successfully');
    hideInstallBanner();
    deferredPrompt = null;
    isInstallPromptAvailable = false;
  });
}

/**
 * Show install banner/button
 */
function showInstallBanner() {
  // Check if banner already exists
  if (document.querySelector('#pwa-install-banner')) {
    return;
  }
  
  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.className = 'fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between animate-slideUp';
  banner.innerHTML = `
    <div class="flex-1">
      <h3 class="font-semibold text-sm">Install MeanMachine</h3>
      <p class="text-xs opacity-90">Get quick access and work offline!</p>
    </div>
    <div class="flex gap-2 ml-4">
      <button id="pwa-install-btn" class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
        Install
      </button>
      <button id="pwa-dismiss-btn" class="text-white/80 hover:text-white transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Add event listeners
  banner.querySelector('#pwa-install-btn').addEventListener('click', installApp);
  banner.querySelector('#pwa-dismiss-btn').addEventListener('click', hideInstallBanner);
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (document.querySelector('#pwa-install-banner')) {
      hideInstallBanner();
    }
  }, 10000);
}

/**
 * Hide install banner
 */
function hideInstallBanner() {
  const banner = document.querySelector('#pwa-install-banner');
  if (banner) {
    banner.classList.add('animate-slideDown');
    setTimeout(() => banner.remove(), 300);
  }
}

/**
 * Install the PWA
 */
async function installApp() {
  if (!deferredPrompt) {
    console.warn('⚠️ Install prompt not available');
    return;
  }
  
  hideInstallBanner();
  
  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('🎉 User accepted the install prompt');
    } else {
      console.log('😔 User dismissed the install prompt');
    }
  } catch (error) {
    console.error('❌ Install prompt failed:', error);
  }
  
  deferredPrompt = null;
  isInstallPromptAvailable = false;
}

/**
 * Show update notification
 */
function showUpdateNotification() {
  // Check if notification already exists
  if (document.querySelector('#pwa-update-notification')) {
    return;
  }
  
  const notification = document.createElement('div');
  notification.id = 'pwa-update-notification';
  notification.className = 'fixed top-4 left-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between animate-slideDown';
  notification.innerHTML = `
    <div class="flex-1">
      <h3 class="font-semibold text-sm">Update Available!</h3>
      <p class="text-xs opacity-90">New features and improvements are ready.</p>
    </div>
    <div class="flex gap-2 ml-4">
      <button id="pwa-update-btn" class="bg-white text-green-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
        Update
      </button>
      <button id="pwa-update-dismiss-btn" class="text-white/80 hover:text-white transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Add event listeners
  notification.querySelector('#pwa-update-btn').addEventListener('click', applyUpdate);
  notification.querySelector('#pwa-update-dismiss-btn').addEventListener('click', hideUpdateNotification);
}

/**
 * Hide update notification
 */
function hideUpdateNotification() {
  const notification = document.querySelector('#pwa-update-notification');
  if (notification) {
    notification.classList.add('animate-slideUp');
    setTimeout(() => notification.remove(), 300);
  }
}

/**
 * Apply service worker update
 */
async function applyUpdate() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    } catch (error) {
      console.error('❌ Update failed:', error);
    }
  }
  
  hideUpdateNotification();
}

/**
 * Setup update notification handling
 */
function setupUpdateNotification() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker updated');
      // Optionally reload the page or notify user
    });
  }
}

/**
 * Check if app is installed
 */
export function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

/**
 * Check if PWA features are supported
 */
export function isPWASupported() {
  return isServiceWorkerSupported && 'manifestJSON' in window;
}

/**
 * Get PWA status
 */
export function getPWAStatus() {
  return {
    isInstalled: isAppInstalled(),
    isSupported: isPWASupported(),
    canInstall: isInstallPromptAvailable,
    isOffline: !navigator.onLine
  };
}

/**
 * Handle online/offline status
 */
export function setupConnectivityHandling() {
  const showConnectivityStatus = (online) => {
    const existing = document.querySelector('#connectivity-status');
    if (existing) existing.remove();
    
    if (!online) {
      const status = document.createElement('div');
      status.id = 'connectivity-status';
      status.className = 'fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 text-sm z-50';
      status.textContent = '📡 You\'re offline - App functionality may be limited';
      document.body.appendChild(status);
    }
  };
  
  window.addEventListener('online', () => {
    console.log('🌐 Back online');
    showConnectivityStatus(true);
  });
  
  window.addEventListener('offline', () => {
    console.log('📡 Gone offline');
    showConnectivityStatus(false);
  });
  
  // Initial check
  if (!navigator.onLine) {
    showConnectivityStatus(false);
  }
}