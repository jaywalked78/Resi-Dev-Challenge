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
          <h2>🎯 Test Your Math Skills!</h2>
          <p>Can you calculate these values in your head?</p>
          <div class="numbers-display">
            Numbers: <span class="number-pills">${this.formatNumbers()}</span>
          </div>
        </div>
        
        <div class="guess-content">
          <div class="guess-grid">
            ${this.createGuessInputs()}
          </div>
          
          <div class="guess-tips">
            <p class="tip">💡 Tip: Leave blank to skip any value</p>
            <p class="points-info">
              🏆 Points: Exact = 100pts | Within 10% = 50pts | Within 20% = 25pts | Attempt = 5pts
            </p>
          </div>
        </div>
        
        <div class="guess-footer">
          <button class="skip-guess-btn">Skip Challenge</button>
          <button class="submit-guess-btn primary-button">Submit Guesses</button>
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
      .map(n => `<span class="number-pill">${n}</span>`)
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
      
      .guess-modal {
        border-radius: 16px;
        padding: 32px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideIn 0.3s ease-out;
      }
      
      .guess-header {
        text-align: center;
        margin-bottom: 24px;
      }
      
      .guess-header h2 {
        color: #3b82f6;
        margin-bottom: 8px;
        font-size: 28px;
      }
      
      .guess-header p {
        color: #6b7280;
        margin-bottom: 16px;
      }
      
      [data-theme="dark"] .guess-header p {
        color: #9ca3af;
      }
      
      .numbers-display {
        font-size: 16px;
        color: #374151;
      }
      
      [data-theme="dark"] .numbers-display {
        color: #d1d5db;
      }
      
      .number-pills {
        display: inline-flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-left: 8px;
      }
      
      .number-pill {
        background: #e5e7eb;
        padding: 4px 12px;
        border-radius: 20px;
        font-weight: 600;
        color: #374151;
      }
      
      [data-theme="dark"] .number-pill {
        background: #374151;
        color: #e5e7eb;
      }
      
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
      }
      
      [data-theme="dark"] .guess-input {
        background: #374151;
        border-color: #4b5563;
        color: #e5e7eb;
      }
      
      .guess-input:focus {
        outline: none;
        border-color: #3b82f6;
      }
      
      .guess-feedback {
        grid-column: 2;
        font-size: 14px;
        margin-top: 4px;
        height: 20px;
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
        background: #f3f4f6;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
      }
      
      [data-theme="dark"] .guess-tips {
        background: #374151;
      }
      
      .tip {
        margin: 0 0 8px 0;
        color: #6b7280;
      }
      
      .points-info {
        margin: 0;
        color: #374151;
        font-size: 14px;
      }
      
      [data-theme="dark"] .points-info {
        color: #d1d5db;
      }
      
      .guess-footer {
        display: flex;
        justify-content: space-between;
        gap: 16px;
      }
      
      .skip-guess-btn, .submit-guess-btn {
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
      }
      
      .skip-guess-btn {
        background: #e5e7eb;
        color: #374151;
      }
      
      .skip-guess-btn:hover {
        background: #d1d5db;
      }
      
      [data-theme="dark"] .skip-guess-btn {
        background: #4b5563;
        color: #e5e7eb;
      }
      
      [data-theme="dark"] .skip-guess-btn:hover {
        background: #6b7280;
      }
      
      .submit-guess-btn {
        background: #3b82f6;
        color: white;
        flex: 1;
      }
      
      .submit-guess-btn:hover {
        background: #2563eb;
        transform: translateY(-1px);
      }
      
      .submit-guess-btn:active {
        transform: translateY(0);
      }
      
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
