/**
 * Guess Modal Component
 * Allows users to guess statistical values before calculation
 */

import { achievementSystem } from '../utils/achievements.js';

export class GuessModal {
  constructor(numbers, actualValues, onComplete) {
    this.numbers = numbers;
    this.actualValues = actualValues;
    this.onComplete = onComplete;
    this.guesses = {};
    this.results = [];

    this.statsToGuess = [
      { key: 'average', label: 'Average (Mean)', icon: '📊' },
      { key: 'median', label: 'Median', icon: '📈' },
      { key: 'variance', label: 'Variance', icon: '📉' },
      { key: 'stdDev', label: 'Standard Deviation', icon: '📐' },
      { key: 'range', label: 'Range', icon: '📏' },
    ];

    this.create();
  }

  create() {
    // Create modal structure
    this.modal = document.createElement('div');
    this.modal.className = 'guess-modal-overlay';
    this.modal.innerHTML = `
      <div class="guess-modal">
        <div class="guess-header">
          <h2 class="text-2xl font-bold mb-2"><span class="text-2xl mr-2">🎯</span><span class="heading-text">Test Your Math Skills!</span></h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Can you calculate these values in your head?</p>
          <div class="text-base text-gray-700 dark:text-gray-300">
            Numbers: <span class="number-pills inline-flex gap-2 ml-2">${this.formatNumbers()}</span>
          </div>
        </div>
        
        <div class="guess-content">
          <div class="guess-grid">
            ${this.createGuessInputs()}
          </div>
          
          <div class="guess-tips rounded-lg p-4 mb-6">
            <p class="tip-text mb-2">💡 Tip: Leave blank to skip any value</p>
            <p class="points-text text-sm">
              🏆 Points: Exact = 100pts | Within 10% = 50pts | Within 20% = 25pts | Attempt = 5pts
            </p>
          </div>
        </div>
        
        <div class="guess-footer flex justify-between gap-4">
          <button class="skip-guess-btn px-6 py-3 rounded-lg font-semibold transition-all duration-200">Skip Challenge</button>
          <button class="submit-guess-btn px-6 py-3 rounded-lg font-semibold flex-1 transition-all duration-200">Submit Guesses</button>
        </div>
      </div>
    `;

    // Add styles
    this.addStyles();

    // Add to document
    document.body.appendChild(this.modal);

    // Add event listeners
    this.attachEventListeners();

    // Focus first input
    setTimeout(() => {
      this.modal.querySelector('.guess-input')?.focus();
    }, 100);
  }

  formatNumbers() {
    return this.numbers
      .map(
        n =>
          `<span class="number-pill inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm">${n}</span>`
      )
      .join('');
  }

  createGuessInputs() {
    return this.statsToGuess
      .map(
        stat => `
      <div class="guess-item">
        <label for="guess-${stat.key}">
          <span class="stat-icon">${stat.icon}</span>
          <span class="stat-label">${stat.label}</span>
        </label>
        <input 
          type="number" 
          id="guess-${stat.key}" 
          class="guess-input" 
          data-stat="${stat.key}"
          placeholder="Your guess..."
          step="0.01"
        >
        <div class="guess-feedback" id="feedback-${stat.key}"></div>
      </div>
    `
      )
      .join('');
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* 
       * CUSTOM CSS: Modal overlay positioning and backdrop
       * WHY CSS INSTEAD OF TAILWIND: Complex modal overlay requires:
       * - Fixed viewport positioning (position: fixed with inset: 0)
       * - Custom backdrop-filter effects not available in Tailwind utilities
       * - High z-index stacking (10000) for modal layering
       * - Custom animation timing with keyframes
       */
      .guess-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
      }
      
      /* 
       * CUSTOM CSS: Modal container styling
       * WHY CSS INSTEAD OF TAILWIND: Modal container requires:
       * - Precise viewport-based sizing (80vh, 90% width)
       * - Custom animation with slideIn keyframes
       * - Overflow control for scrollable content
       * - Complex responsive behavior not efficiently achievable with Tailwind
       */
      .guess-modal {
        background: white;
        border-radius: 16px;
        padding: 32px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideIn 0.3s ease-out;
      }
      
      [data-theme="dark"] .guess-modal {
        background: rgb(31 41 55);
      }

      /* 
       * ENTERPRISE CSS: Diamond tier glassmorphism modal styling
       * WHY CSS INSTEAD OF TAILWIND: Complex glassmorphism effects require:
       * - Multi-layered backgrounds with radial gradients and overlay systems
       * - Advanced backdrop-filter effects (blur, saturate) for premium glass appearance
       * - Complex box-shadow combinations for depth and inset lighting effects
       * - Background-attachment: fixed for scroll-independent gradient positioning
       * - Precise opacity layering for light/dark mode overlay treatments
       */
      .tier-diamond .guess-modal {
        position: relative;
        background: 
          linear-gradient(rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.35)),
          radial-gradient(circle at center, #ff0080, #00ffff, #ffff00, #ff0080) !important;
        background-size: 200% 200% !important;
        background-attachment: fixed !important;
        backdrop-filter: blur(20px) saturate(1.2) !important;
        border: 1px solid rgba(255, 255, 255, 0.18) !important;
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
      }

      [data-theme="dark"] .tier-diamond .guess-modal {
        background: 
          linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),
          radial-gradient(circle at center, #ff0080, #00ffff, #ffff00, #ff0080) !important;
        background-size: 200% 200% !important;
        background-attachment: fixed !important;
        backdrop-filter: blur(20px) saturate(1.2) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
      }
      
      .guess-header {
        text-align: center;
        margin-bottom: 24px;
      }
      
      /* 
       * CUSTOM CSS: Heading text color styling
       * Why CSS over Tailwind: Dynamic theming to match label colors for consistency
       * requires CSS for proper cascade management
       */
      .heading-text {
        color: rgb(55 65 81); /* gray-700 for light mode - same as labels */
      }
      
      [data-theme="dark"] .heading-text {
        color: rgb(209 213 219); /* gray-300 for dark mode - same as labels */
      }
      
      /* 
       * CUSTOM CSS: Number pill tier-based backgrounds
       * Why CSS over Tailwind: Complex tier-based theming system with dynamic gradients
       * and consistent color treatment across light/dark modes
       */
      .number-pill {
        background: rgb(31 41 55); /* gray-800 */
        color: white;
      }
      
      [data-theme="dark"] .number-pill {
        background: rgb(31 41 55); /* gray-800 */
        color: white;
      }
      
      /* 
       * ENTERPRISE CSS: Tier-based number pill styling system
       * WHY CSS INSTEAD OF TAILWIND: Complex tier-based theming requires:
       * - Dynamic gradient backgrounds with specific opacity values per tier
       * - nth-child selectors for Diamond tier color cycling
       * - Coordinated color schemes matching input field treatments
       * - Light/dark mode variations with different opacity levels
       * - !important declarations to override base component styles
       */
      .tier-bronze .number-pill {
        background: linear-gradient(135deg, rgba(205, 127, 50, 0.3), rgba(184, 134, 11, 0.4)) !important;
        color: rgb(31 41 55) !important;
      }

      .tier-silver .number-pill {
        background: linear-gradient(135deg, rgba(192, 192, 192, 0.3), rgba(229, 231, 235, 0.4)) !important;
        color: rgb(31 41 55) !important;
      }

      .tier-gold .number-pill {
        background: linear-gradient(135deg, rgba(218, 165, 32, 0.3), rgba(255, 179, 71, 0.4)) !important;
        color: rgb(31 41 55) !important;
      }

      .tier-platinum .number-pill {
        background: linear-gradient(135deg, rgba(229, 231, 235, 0.3), rgba(255, 255, 255, 0.4)) !important;
        color: rgb(31 41 55) !important;
      }

      .tier-diamond .number-pill {
        color: rgb(31 41 55) !important;
      }

      .tier-diamond .number-pill:nth-child(1) {
        background: rgba(255, 0, 128, 0.7) !important; /* Pink */
      }

      .tier-diamond .number-pill:nth-child(2) {
        background: rgba(0, 255, 255, 0.7) !important; /* Cyan */
      }

      .tier-diamond .number-pill:nth-child(3) {
        background: rgba(255, 255, 0, 0.7) !important; /* Yellow */
      }

      .tier-diamond .number-pill:nth-child(4) {
        background: rgba(128, 0, 255, 0.7) !important; /* Purple */
      }

      .tier-diamond .number-pill:nth-child(5) {
        background: rgba(255, 128, 0, 0.7) !important; /* Orange */
      }

      .tier-diamond .number-pill:nth-child(n+6) {
        background: rgba(0, 255, 128, 0.7) !important; /* Green */
      }

      /* Dark mode tier-specific pill backgrounds - higher opacity */
      [data-theme="dark"] .tier-bronze .number-pill {
        background: linear-gradient(135deg, rgba(205, 127, 50, 0.85), rgba(184, 134, 11, 0.85)) !important;
      }

      [data-theme="dark"] .tier-silver .number-pill {
        background: linear-gradient(135deg, rgba(192, 192, 192, 0.85), rgba(229, 231, 235, 0.85)) !important;
      }

      [data-theme="dark"] .tier-gold .number-pill {
        background: linear-gradient(135deg, rgba(218, 165, 32, 0.85), rgba(255, 179, 71, 0.85)) !important;
      }

      [data-theme="dark"] .tier-platinum .number-pill {
        background: linear-gradient(135deg, rgba(229, 231, 235, 0.85), rgba(255, 255, 255, 0.85)) !important;
      }

      [data-theme="dark"] .tier-diamond .number-pill {
        color: rgb(255, 255, 255) !important;
      }

      [data-theme="dark"] .tier-diamond .number-pill:nth-child(1) {
        background: rgba(255, 0, 128, 0.9) !important; /* Pink */
      }

      [data-theme="dark"] .tier-diamond .number-pill:nth-child(2) {
        background: rgba(0, 255, 255, 0.9) !important; /* Cyan */
      }

      [data-theme="dark"] .tier-diamond .number-pill:nth-child(3) {
        background: rgba(255, 255, 0, 0.9) !important; /* Yellow */
        color: rgb(31 41 55) !important;
      }

      [data-theme="dark"] .tier-diamond .number-pill:nth-child(4) {
        background: rgba(128, 0, 255, 0.9) !important; /* Purple */
      }

      [data-theme="dark"] .tier-diamond .number-pill:nth-child(5) {
        background: rgba(255, 128, 0, 0.9) !important; /* Orange */
      }

      [data-theme="dark"] .tier-diamond .number-pill:nth-child(n+6) {
        background: rgba(0, 255, 128, 0.9) !important; /* Green */
      }
      
      /* 
       * CUSTOM CSS: Component layout and responsive design
       * Why CSS over Tailwind: Dynamic component structure requires CSS for:
       * - Grid layouts with specific column sizing (200px 1fr) for responsive label/input pairs
       * - Component-level styling that needs to work with dynamically generated content
       * - Consistent spacing and alignment across programmatically created elements
       * - Better maintainability for complex grid layouts in JavaScript-generated content
       */
      .guess-grid {
        display: grid;
        gap: 20px;
        margin-bottom: 24px;
      }
      
      .guess-item {
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: 12px;
        align-items: center;
      }
      
      .guess-item label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        color: rgb(55 65 81); /* gray-700 */
      }
      
      [data-theme="dark"] .guess-item label {
        color: rgb(209 213 219); /* gray-300 */
      }
      
      .stat-icon {
        font-size: 20px;
      }
      
      .guess-input {
        padding: 8px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 16px;
        transition: border-color 0.2s;
        background: white;
        color: rgb(31 41 55);
      }
      
      [data-theme="dark"] .guess-input {
        background: #374151;
        border-color: #4b5563;
        color: white !important;
      }
      
      .guess-input:focus {
        outline: none;
        border-color: #3b82f6;
      }
      
      /* 
       * ENTERPRISE CSS: Tier-based input field styling
       * Why CSS over Tailwind: Complex tier-based theming system with dynamic gradients
       * matching calculator modal treatment. Requires:
       * - Multi-tier cascade inheritance (.tier-bronze, .tier-silver, etc.)
       * - Complex gradient backgrounds with specific rgba opacity values
       * - Synchronized border colors with gradient backgrounds
       * - Light/dark mode variations with different opacity treatments
       * - !important needed to override base input styles from component
       */
      .tier-bronze .guess-input {
        background: linear-gradient(135deg, rgba(205, 127, 50, 0.3), rgba(184, 134, 11, 0.4)) !important;
        border-color: rgba(205, 127, 50, 0.6) !important;
      }

      .tier-silver .guess-input {
        background: linear-gradient(135deg, rgba(192, 192, 192, 0.3), rgba(229, 231, 235, 0.4)) !important;
        border-color: rgba(192, 192, 192, 0.6) !important;
      }

      .tier-gold .guess-input {
        background: linear-gradient(135deg, rgba(218, 165, 32, 0.3), rgba(255, 179, 71, 0.4)) !important;
        border-color: rgba(218, 165, 32, 0.6) !important;
      }

      .tier-platinum .guess-input {
        background: linear-gradient(135deg, rgba(229, 231, 235, 0.3), rgba(255, 255, 255, 0.4)) !important;
        border-color: rgba(229, 231, 235, 0.6) !important;
      }

      .tier-diamond .guess-input {
        background: linear-gradient(135deg, rgba(255, 0, 128, 0.3), rgba(0, 255, 255, 0.3), rgba(255, 255, 0, 0.4)) !important;
        border-color: rgba(255, 0, 128, 0.6) !important;
        color: rgb(31 41 55) !important;
      }

      .tier-diamond .guess-input:nth-of-type(1) {
        animation: diamondPulse 2s ease-in-out infinite !important;
        animation-delay: 0s !important;
      }

      .tier-diamond .guess-input:nth-of-type(2) {
        animation: diamondPulse 2s ease-in-out infinite !important;
        animation-delay: 0.3s !important;
      }

      .tier-diamond .guess-input:nth-of-type(3) {
        animation: diamondPulse 2s ease-in-out infinite !important;
        animation-delay: 0.6s !important;
      }

      .tier-diamond .guess-input:nth-of-type(4) {
        animation: diamondPulse 2s ease-in-out infinite !important;
        animation-delay: 0.9s !important;
      }

      .tier-diamond .guess-input:nth-of-type(5) {
        animation: diamondPulse 2s ease-in-out infinite !important;
        animation-delay: 1.2s !important;
      }

      /* Dark mode tier-specific input backgrounds - higher opacity */
      [data-theme="dark"] .tier-bronze .guess-input {
        background: linear-gradient(135deg, rgba(205, 127, 50, 0.85), rgba(184, 134, 11, 0.85)) !important;
        border-color: rgba(205, 127, 50, 0.4) !important;
        color: rgb(31 41 55) !important;
      }

      [data-theme="dark"] .tier-silver .guess-input {
        background: linear-gradient(135deg, rgba(192, 192, 192, 0.85), rgba(229, 231, 235, 0.85)) !important;
        border-color: rgba(192, 192, 192, 0.4) !important;
        color: rgb(31 41 55) !important;
      }

      [data-theme="dark"] .tier-gold .guess-input {
        background: linear-gradient(135deg, rgba(218, 165, 32, 0.85), rgba(255, 179, 71, 0.85)) !important;
        border-color: rgba(218, 165, 32, 0.4) !important;
        color: rgb(31 41 55) !important;
      }

      [data-theme="dark"] .tier-platinum .guess-input {
        background: linear-gradient(135deg, rgba(229, 231, 235, 0.85), rgba(255, 255, 255, 0.85)) !important;
        border-color: rgba(229, 231, 235, 0.4) !important;
        color: rgb(31 41 55) !important;
      }

      [data-theme="dark"] .tier-diamond .guess-input {
        background: linear-gradient(135deg, rgba(255, 0, 128, 0.85), rgba(0, 255, 255, 0.85), rgba(255, 255, 0, 0.85)) !important;
        border-color: rgba(255, 0, 128, 0.4) !important;
        color: rgb(31 41 55) !important;
      }
      
      /* 
       * CUSTOM CSS: Placeholder styling for tier-based inputs
       * Why CSS over Tailwind: Complex pseudo-element styling (::placeholder) with
       * theme-aware color coordination and opacity precision not efficiently
       * handled by Tailwind utilities
       */
      .guess-input::placeholder {
        color: rgb(31 41 55);
        opacity: 0.7;
      }
      
      [data-theme="dark"] .guess-input::placeholder {
        color: white;
        opacity: 0.7;
      }
      
      /* Tier-based placeholder styling in dark mode */
      [data-theme="dark"] .tier-bronze .guess-input::placeholder,
      [data-theme="dark"] .tier-silver .guess-input::placeholder,
      [data-theme="dark"] .tier-gold .guess-input::placeholder,
      [data-theme="dark"] .tier-platinum .guess-input::placeholder,
      [data-theme="dark"] .tier-diamond .guess-input::placeholder {
        color: rgb(31 41 55) !important;
        opacity: 0.7;
      }

      .tier-diamond .guess-input::placeholder {
        color: rgb(31 41 55) !important;
        opacity: 0.7;
      }
      
      /* 
       * CUSTOM CSS: Feedback and tips styling
       * Why CSS over Tailwind: Complex state-dependent styling with:
       * - Grid positioning (grid-column: 2) for layout within dynamic grid system
       * - State-based color classes (.correct, .close, .far) for dynamic feedback
       * - Theme-aware background coordination for consistent visual hierarchy
       * - Component-specific height and spacing for proper feedback alignment
       */
      .guess-feedback {
        grid-column: 2;
        font-size: 14px;
        margin-top: 4px;
        height: 20px;
        color: rgb(55 65 81); /* gray-700 - consistent with label colors */
      }
      
      [data-theme="dark"] .guess-feedback {
        color: rgb(209 213 219); /* gray-300 - consistent with label colors */
      }
      
      .guess-feedback.correct {
        color: #10b981;
        font-weight: 600;
      }
      
      .guess-feedback.close {
        color: #f59e0b;
      }
      
      .guess-feedback.far {
        color: #ef4444;
      }
      
      .guess-tips {
        background: rgb(243 244 246); /* gray-100 */
      }
      
      [data-theme="dark"] .guess-tips {
        background: rgb(55 65 81); /* gray-700 */
      }
      
      .tip-text, .points-text {
        margin: 0;
        color: rgb(55 65 81); /* gray-700 */
      }
      
      [data-theme="dark"] .tip-text,
      [data-theme="dark"] .points-text {
        color: rgb(209 213 219); /* gray-300 */
      }
      
      /* 
       * CUSTOM CSS: Button styling with tier-based backgrounds
       * Why CSS over Tailwind: Complex hover states with transforms and tier-specific
       * gradient backgrounds that match the Launch MeanMachine button
       */
      .skip-guess-btn {
        background: rgb(229 231 235); /* gray-200 */
        color: rgb(55 65 81); /* gray-700 */
        border: none;
      }
      
      .skip-guess-btn:hover {
        background: rgb(209 213 219); /* gray-300 */
      }
      
      [data-theme="dark"] .skip-guess-btn {
        background: rgb(75 85 99); /* gray-600 */
        color: rgb(229 231 235); /* gray-200 */
      }
      
      [data-theme="dark"] .skip-guess-btn:hover {
        background: rgb(107 114 128); /* gray-500 */
      }
      
      /* Default submit button styling */
      .submit-guess-btn {
        background: rgb(59 130 246); /* blue-500 */
        color: white;
        border: none;
      }
      
      .submit-guess-btn:hover {
        background: rgb(37 99 235); /* blue-600 */
        transform: translateY(-1px);
      }
      
      .submit-guess-btn:active {
        transform: translateY(0);
      }
      
      /* Tier-based submit button backgrounds matching Launch MeanMachine */
      .tier-bronze .submit-guess-btn {
        background: linear-gradient(135deg, #CD7F32, #B8860B) !important;
      }
      
      .tier-silver .submit-guess-btn {
        background: linear-gradient(135deg, #C0C0C0, #E5E7EB) !important;
        color: rgb(31 41 55) !important;
      }
      
      .tier-gold .submit-guess-btn {
        background: linear-gradient(135deg, #DAA520, #FFB347) !important;
        color: rgb(31 41 55) !important;
      }
      
      .tier-platinum .submit-guess-btn {
        background: linear-gradient(135deg, #E5E7EB, #FFFFFF) !important;
        color: rgb(31 41 55) !important;
      }
      
      .tier-diamond .submit-guess-btn {
        background: rgba(255, 255, 255, 0.85) !important;
        color: rgb(31, 41, 55) !important;
        animation: diamondPulse 2s ease-in-out infinite !important;
        animation-delay: 0.5s !important;
        border: 2px solid rgba(255, 255, 255, 0.18) !important;
        backdrop-filter: blur(20px) saturate(1.2) !important;
        box-shadow: 
          0 4px 16px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
      }

      .tier-diamond .submit-guess-btn:hover {
        background: 
          linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
          linear-gradient(135deg, #ff0080, #00ffff, #ffff00) !important;
        color: white !important;
        backdrop-filter: blur(25px) saturate(1.4) !important;
        border: 2px solid rgba(0, 0, 0, 0.4) !important;
        box-shadow: 
          0 6px 20px rgba(255, 0, 128, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
      }

      [data-theme="dark"] .tier-diamond .submit-guess-btn {
        background: rgba(0, 0, 0, 0.85) !important;
        color: rgb(255, 255, 255) !important;
        border: 2px solid rgba(255, 255, 255, 0.12) !important;
        backdrop-filter: blur(20px) saturate(1.2) !important;
        box-shadow: 
          0 4px 16px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
      }

      [data-theme="dark"] .tier-diamond .submit-guess-btn:hover {
        background: 
          linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)),
          linear-gradient(135deg, #ff0080, #00ffff, #ffff00) !important;
        color: rgb(31, 41, 55) !important;
        backdrop-filter: blur(25px) saturate(1.4) !important;
        border: 2px solid rgba(255, 255, 255, 0.6) !important;
        box-shadow: 
          0 6px 20px rgba(255, 0, 128, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
      }
      
      /* Dark mode tier button styling */
      [data-theme="dark"] .tier-bronze .submit-guess-btn:hover,
      [data-theme="dark"] .tier-silver .submit-guess-btn:hover,
      [data-theme="dark"] .tier-gold .submit-guess-btn:hover,
      [data-theme="dark"] .tier-platinum .submit-guess-btn:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      
      /* 
       * CUSTOM CSS: Animation keyframes and responsive design
       * Why CSS over Tailwind: 
       * - @keyframes animations not supported in Tailwind utilities
       * - Complex transform and opacity combinations for smooth modal entrance
       * - Media queries for responsive layout changes (grid-template-columns)
       * - Component-specific breakpoint behavior for mobile optimization
       */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from {
          transform: translateY(-20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes diamondPulse {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(255, 0, 128, 0.4);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 0 0 10px rgba(255, 0, 128, 0);
          transform: scale(1.02);
        }
      }
      
      @media (max-width: 640px) {
        .guess-item {
          grid-template-columns: 1fr;
        }
        
        .guess-feedback {
          grid-column: 1;
        }
      }
    `;
    document.head.appendChild(style);
    this.styleElement = style;
  }

  // Dark mode now handled automatically via CSS variables

  attachEventListeners() {
    // Skip button
    this.modal
      .querySelector('.skip-guess-btn')
      .addEventListener('click', () => {
        this.close(false);
      });

    // Submit button
    this.modal
      .querySelector('.submit-guess-btn')
      .addEventListener('click', () => {
        this.submitGuesses();
      });

    // Enter key submits
    this.modal.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.submitGuesses();
      }
      if (e.key === 'Escape') {
        this.close(false);
      }
    });

    // Real-time validation feedback
    this.modal.querySelectorAll('.guess-input').forEach(input => {
      input.addEventListener('input', () => {
        this.validateInput(input);
      });
    });
  }

  validateInput(input) {
    const value = parseFloat(input.value);
    const stat = input.dataset.stat;
    const feedback = this.modal.querySelector(`#feedback-${stat}`);

    if (input.value === '') {
      feedback.textContent = '';
      feedback.className = 'guess-feedback';
      return;
    }

    if (isNaN(value)) {
      feedback.textContent = 'Please enter a valid number';
      feedback.className = 'guess-feedback far';
    } else {
      feedback.textContent = '✓ Valid guess';
      feedback.className = 'guess-feedback';
    }
  }

  submitGuesses() {
    const inputs = this.modal.querySelectorAll('.guess-input');
    let hasGuesses = false;

    inputs.forEach(input => {
      const stat = input.dataset.stat;
      const value = parseFloat(input.value);

      if (!isNaN(value) && input.value !== '') {
        hasGuesses = true;
        const actual = this.actualValues[stat];
        const accuracy =
          actual === 0
            ? value === 0
              ? 0
              : 1
            : Math.abs(value - actual) / Math.abs(actual);

        this.guesses[stat] = value;
        this.results.push({
          stat,
          guess: value,
          actual,
          accuracy,
          points: achievementSystem.calculatePoints('guess', { accuracy }),
        });

        // Show feedback
        this.showFeedback(stat, value, actual, accuracy);
      }
    });

    if (hasGuesses) {
      // Delay close to show feedback
      setTimeout(() => {
        this.close(true);
      }, 5000);
    } else {
      this.close(false);
    }
  }

  showFeedback(stat, guess, actual, accuracy) {
    const feedback = this.modal.querySelector(`#feedback-${stat}`);
    const input = this.modal.querySelector(`#guess-${stat}`);

    if (accuracy === 0) {
      feedback.textContent = '🎯 PERFECT! +100 points';
      feedback.className = 'guess-feedback correct';
      input.style.borderColor = '#10b981';
    } else if (accuracy <= 0.1) {
      feedback.textContent = `✨ Very close! Within ${(accuracy * 100).toFixed(1)}% (+50 points)`;
      feedback.className = 'guess-feedback close';
      input.style.borderColor = '#f59e0b';
    } else if (accuracy <= 0.2) {
      feedback.textContent = `👍 Good try! Within ${(accuracy * 100).toFixed(1)}% (+25 points)`;
      feedback.className = 'guess-feedback close';
      input.style.borderColor = '#f59e0b';
    } else {
      feedback.textContent = `Actual: ${actual.toFixed(2)} (+5 points for trying)`;
      feedback.className = 'guess-feedback far';
      input.style.borderColor = '#ef4444';
    }
  }

  close(submitted) {
    this.modal.classList.add('closing');

    setTimeout(() => {
      this.modal.remove();
      this.styleElement.remove();

      if (this.onComplete) {
        this.onComplete(submitted ? this.results : null);
      }
    }, 300);
  }
}

// Add closing animation
const closingStyle = document.createElement('style');
closingStyle.textContent = `
  .guess-modal-overlay.closing {
    animation: fadeOut 0.3s ease-out;
  }
  
  .guess-modal-overlay.closing .guess-modal {
    animation: slideOut 0.3s ease-out;
  }
  
  @keyframes fadeOut {
    to { opacity: 0; }
  }
  
  @keyframes slideOut {
    to {
      transform: translateY(-20px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(closingStyle);
