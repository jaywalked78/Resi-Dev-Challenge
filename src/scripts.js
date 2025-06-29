// Import theme manager and error boundary
import { ThemeManager } from './utils/theme.js';
import {
  createErrorBoundary,
  withErrorBoundary,
} from './utils/errorBoundary.js';

// Import Phase 7 features
import { konamiDetector } from './utils/konami.js';
import { achievementSystem } from './utils/achievements.js';
import './utils/console-art.js'; // Auto-initializes

/**
 * Calculates the average of an array of numbers, logs it, and returns the result.
 * @param {number[]} nums - Array of numbers to calculate average for
 * @returns {number} The calculated average
 * @throws {Error} if nums is empty or not an array
 */
function calculateAverage(nums) {
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new Error('You must provide a non-empty array of numbers.');
  }

  const total = nums.reduce((sum, n) => sum + n, 0);
  const avg = total / nums.length;

  // Fixed typo: console.log instead of console.lgo
  console.log(`Average is: ${avg}`);

  return avg;
}

// Test the function with an array of numbers
try {
  const testNumbers = [10, 20, 30, 40, 50];
  const result = calculateAverage(testNumbers);
  console.log('Test passed! Result:', result);
} catch (error) {
  console.error('Test failed:', error.message);
}

// Expose achievementSystem globally for testing/debugging
window.achievementSystem = achievementSystem;

// Initialize calculator modal when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Create error boundary for the main app
  const appContainer = document.querySelector('main') || document.body;
  createErrorBoundary(appContainer, {
    onError: (error, source) => {
      console.error(`[App Error] ${source}:`, error);
      // Send to analytics if available
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: error.message,
          fatal: false,
        });
      }
    },
  });

  // Initialize theme manager
  const themeManager = new ThemeManager();

  // Check for sunshine seeker achievement (light mode)
  if (themeManager.getTheme() === 'light') {
    achievementSystem.unlockMilestone('sunshine_seeker');
  }

  // Listen for theme changes to award sunshine seeker achievement
  themeManager.onThemeChange(theme => {
    if (theme === 'light') {
      achievementSystem.unlockMilestone('sunshine_seeker');
    }
  });

  // Initialize Konami code listener
  konamiDetector.onActivate(() => {
    // Award Konami achievement
    achievementSystem.unlockMilestone('konami_master');
  });

  // Check for special features unlock
  if (localStorage.getItem('meanMachineSpecialFeatures') === 'true') {
    document.body.classList.add('rainbow-theme');
  }

  // Lazy load calculator modal with error boundary
  let calculatorModal = null;
  const loadCalculatorModal = async () => {
    if (!calculatorModal) {
      const { CalculatorModal } = await import(
        './components/CalculatorModal.js'
      );
      const ModalWithErrorBoundary = withErrorBoundary(
        () => new CalculatorModal(calculateAverage)
      );
      calculatorModal = ModalWithErrorBoundary();
    }
    return calculatorModal;
  };

  // Add event listener for the button
  const button = document.getElementById('calculator-button');
  console.log('Button found:', button);
  if (button) {
    button.addEventListener('click', async () => {
      console.log('Button clicked - loading modal...');

      // Check if this is the first time launching
      const hasLaunchedBefore = localStorage.getItem('meanMachineFirstLaunch');
      if (!hasLaunchedBefore) {
        // Award 100 points for first launch
        achievementSystem.awardPoints(100, 'First time launching MeanMachine!');
        localStorage.setItem('meanMachineFirstLaunch', 'true');
      }

      try {
        const modal = await loadCalculatorModal();
        console.log('Modal loaded:', modal);
        if (modal && modal.open) {
          modal.open();
        } else {
          console.error('Modal is null or missing open method');
        }
      } catch (error) {
        console.error('Error loading modal:', error);
      }
    });
  } else {
    console.error('Calculate button not found!');
  }

  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  const lightIcon = document.querySelector('.theme-icon-light');
  const darkIcon = document.querySelector('.theme-icon-dark');

  if (themeToggle) {
    // Update icons based on current theme
    const updateIcons = theme => {
      if (theme === 'dark') {
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
      } else {
        lightIcon.classList.remove('hidden');
        darkIcon.classList.add('hidden');
      }
    };

    // Set initial icon state
    updateIcons(themeManager.getTheme());

    // Listen for theme changes
    themeManager.onThemeChange(updateIcons);

    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
      themeManager.toggleTheme();
    });
  }

  // Add keyboard shortcut (Ctrl/Cmd + K)
  document.addEventListener('keydown', async e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const modal = await loadCalculatorModal();
      modal.open();
    }
  });
});
