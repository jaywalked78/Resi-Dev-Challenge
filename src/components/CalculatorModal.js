import { Modal } from './Modal.js';

/**
 * Calculator Modal Component
 * Handles number input and calculation display
 */
export class CalculatorModal extends Modal {
  constructor(calculateFunction) {
    super({
      closeOnBackdrop: true,
      closeOnEscape: true,
      focusTrap: true
    });
    
    this.calculateFunction = calculateFunction;
    this.mode = 'custom'; // 'custom' or 'random'
    this.numbers = [];
    this.result = null;
    
    this.render();
  }

  render() {
    const content = `
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900" id="modal-title">Average Calculator</h2>
          <button class="close-btn text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Tab Navigation -->
        <div class="flex border-b border-gray-200 mb-6">
          <button class="tab-btn px-4 py-2 font-medium text-gray-700 border-b-2 border-blue-500 focus:outline-none transition-colors" 
                  data-tab="custom" aria-selected="true">
            Custom Numbers
          </button>
          <button class="tab-btn px-4 py-2 font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition-colors" 
                  data-tab="random" aria-selected="false">
            Random Numbers
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Custom Numbers Tab -->
          <div id="custom-tab" class="tab-panel">
            <div class="mb-4">
              <p class="text-sm text-gray-600 mb-4">Enter numbers to calculate their average (2-10 numbers)</p>
              <div id="number-inputs" class="space-y-3">
                ${this.createNumberInput(0)}
                ${this.createNumberInput(1)}
              </div>
              <div class="mt-3 flex items-center gap-4">
                <button id="add-input" class="text-sm text-blue-600 hover:text-blue-700 focus:outline-none">
                  + Add another number
                </button>
                <button id="clear-inputs" class="text-sm text-red-600 hover:text-red-700 focus:outline-none">
                  Clear all
                </button>
              </div>
            </div>
          </div>

          <!-- Random Numbers Tab -->
          <div id="random-tab" class="tab-panel hidden">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  How many numbers?
                </label>
                <input type="range" id="random-count" min="2" max="10" value="5" 
                       class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>2</span>
                  <span id="count-display" class="font-medium text-gray-700">5</span>
                  <span>10</span>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Min Value
                  </label>
                  <input type="number" id="random-min" value="1" 
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Max Value
                  </label>
                  <input type="number" id="random-max" value="100" 
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <!-- Result Display -->
        <div id="result-display" class="hidden mt-6 p-6 bg-gray-50 rounded-lg">
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-2">The average is:</p>
            <div id="result-value" class="text-4xl font-bold text-blue-600 mb-4">0</div>
            <div id="number-pills" class="flex flex-wrap gap-2 justify-center mb-4"></div>
            <div class="flex gap-3 justify-center">
              <button id="calculate-again" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
                Calculate Again
              </button>
              <button id="copy-result" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                Copy Result
              </button>
            </div>
          </div>
        </div>

        <!-- Error Display -->
        <div id="error-display" class="hidden mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600"></p>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex justify-end gap-3">
          <button id="cancel-btn" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
            Cancel
          </button>
          <button id="calculate-btn" class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors">
            Calculate Average
          </button>
        </div>
      </div>
    `;

    this.setContent(content);
    this.attachEventListeners();
  }

  createNumberInput(index) {
    return `
      <div class="flex items-center gap-2 number-input-group">
        <input type="number" 
               class="number-input flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
               placeholder="Enter a number"
               aria-label="Number ${index + 1}">
        ${index > 1 ? `
          <button class="remove-input text-red-500 hover:text-red-700 focus:outline-none" aria-label="Remove number">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        ` : ''}
      </div>
    `;
  }

  attachEventListeners() {
    // Close button
    this.modal.querySelector('.close-btn').addEventListener('click', () => this.close());
    this.modal.querySelector('#cancel-btn').addEventListener('click', () => this.close());

    // Tab switching
    this.modal.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });

    // Custom numbers functionality
    this.modal.querySelector('#add-input').addEventListener('click', () => this.addNumberInput());
    this.modal.querySelector('#clear-inputs').addEventListener('click', () => this.clearAllInputs());
    this.modal.querySelector('#calculate-btn').addEventListener('click', () => this.calculate());
    
    // Random numbers functionality
    const randomCount = this.modal.querySelector('#random-count');
    const countDisplay = this.modal.querySelector('#count-display');
    randomCount.addEventListener('input', (e) => {
      countDisplay.textContent = e.target.value;
    });
    
    
    // Result actions
    this.modal.querySelector('#calculate-again').addEventListener('click', () => this.reset());
    this.modal.querySelector('#copy-result').addEventListener('click', () => this.copyResult());

    // Dynamic event delegation for remove buttons
    this.modal.addEventListener('click', (e) => {
      if (e.target.closest('.remove-input')) {
        this.removeNumberInput(e.target.closest('.number-input-group'));
      }
    });

    // Real-time validation
    this.modal.addEventListener('input', (e) => {
      if (e.target.classList.contains('number-input')) {
        this.validateInput(e.target);
      }
    });
  }

  switchTab(tab) {
    this.mode = tab;
    
    // Update tab buttons
    this.modal.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.dataset.tab === tab) {
        btn.classList.add('text-gray-700', 'border-b-2', 'border-blue-500');
        btn.classList.remove('text-gray-500');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('text-gray-700', 'border-b-2', 'border-blue-500');
        btn.classList.add('text-gray-500');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // Make sure tab content is visible first
    const tabContent = this.modal.querySelector('.tab-content');
    if (tabContent.classList.contains('hidden')) {
      tabContent.classList.remove('hidden');
    }

    // Update tab panels
    const customTab = this.modal.querySelector('#custom-tab');
    const randomTab = this.modal.querySelector('#random-tab');
    
    if (tab === 'custom') {
      customTab.classList.remove('hidden');
      randomTab.classList.add('hidden');
    } else {
      customTab.classList.add('hidden');
      randomTab.classList.remove('hidden');
    }

    // Update button text and visibility based on tab
    const calculateBtn = this.modal.querySelector('#calculate-btn');
    calculateBtn.classList.remove('hidden');
    
    if (tab === 'custom') {
      calculateBtn.textContent = 'Calculate Average';
    } else {
      calculateBtn.textContent = 'Generate & Calculate Average';
    }

    this.hideError();
    this.hideResult();
  }

  addNumberInput() {
    const container = this.modal.querySelector('#number-inputs');
    const inputCount = container.querySelectorAll('.number-input-group').length;
    
    if (inputCount >= 10) {
      this.showError('Maximum 10 numbers allowed');
      return;
    }

    const div = document.createElement('div');
    div.innerHTML = this.createNumberInput(inputCount);
    container.appendChild(div.firstElementChild);
    
    // Focus new input
    const newInput = container.lastElementChild.querySelector('input');
    newInput.focus();
  }

  removeNumberInput(inputGroup) {
    const container = this.modal.querySelector('#number-inputs');
    const inputCount = container.querySelectorAll('.number-input-group').length;
    
    if (inputCount <= 2) {
      this.showError('Minimum 2 numbers required');
      return;
    }

    inputGroup.remove();
  }

  clearAllInputs() {
    const inputs = this.modal.querySelectorAll('.number-input');
    inputs.forEach(input => {
      input.value = '';
      input.classList.remove('border-red-500');
    });
    this.hideError();
    
    // Reset the internal state
    this.numbers = [];
    this.result = null;
    
    // Reset to just 2 inputs
    const container = this.modal.querySelector('#number-inputs');
    const inputGroups = container.querySelectorAll('.number-input-group');
    
    // Remove all inputs beyond the first 2
    inputGroups.forEach((group, index) => {
      if (index > 1) {
        group.remove();
      }
    });
  }

  validateInput(input) {
    const value = input.value;
    if (value && isNaN(value)) {
      input.classList.add('border-red-500');
      this.showError('Please enter valid numbers only');
    } else {
      input.classList.remove('border-red-500');
      this.hideError();
    }
  }

  generateRandomNumbers() {
    const count = parseInt(this.modal.querySelector('#random-count').value);
    const min = parseInt(this.modal.querySelector('#random-min').value);
    const max = parseInt(this.modal.querySelector('#random-max').value);

    if (min >= max) {
      this.showError('Maximum value must be greater than minimum value');
      return;
    }

    this.numbers = [];
    for (let i = 0; i < count; i++) {
      this.numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    this.displayResult();
  }

  calculate() {
    if (this.mode === 'custom') {
      const inputs = this.modal.querySelectorAll('.number-input');
      this.numbers = [];
      
      inputs.forEach(input => {
        if (input.value.trim()) {
          const num = parseFloat(input.value);
          if (!isNaN(num)) {
            this.numbers.push(num);
          }
        }
      });

      if (this.numbers.length < 2) {
        this.showError('Please enter at least 2 numbers');
        return;
      }
    } else {
      // Random mode - generate numbers first, then calculate
      this.generateRandomNumbers();
      return; // generateRandomNumbers() will call displayResult()
    }

    this.displayResult();
  }

  displayResult() {
    try {
      this.result = this.calculateFunction(this.numbers);
      
      // Hide input section
      this.modal.querySelector('.tab-content').classList.add('hidden');
      this.modal.querySelector('#calculate-btn').classList.add('hidden');
      
      // Show result
      const resultDisplay = this.modal.querySelector('#result-display');
      resultDisplay.classList.remove('hidden');
      
      // Animate number
      this.animateNumber(this.result);
      
      // Show number pills
      const pillsContainer = this.modal.querySelector('#number-pills');
      pillsContainer.innerHTML = this.numbers.map(num => 
        `<span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">${num}</span>`
      ).join('');
      
    } catch (error) {
      this.showError(error.message);
    }
  }

  animateNumber(target) {
    const element = this.modal.querySelector('#result-value');
    const duration = 1000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const animate = () => {
      current += increment;
      if (current < target) {
        element.textContent = current.toFixed(2);
        requestAnimationFrame(animate);
      } else {
        element.textContent = target.toFixed(2);
      }
    };

    animate();
  }

  reset() {
    // Show input section
    this.modal.querySelector('.tab-content').classList.remove('hidden');
    this.modal.querySelector('#calculate-btn').classList.remove('hidden');
    
    // Hide result
    this.modal.querySelector('#result-display').classList.add('hidden');
    
    // Don't clear the inputs - let users keep their numbers
    // Just remove any validation errors
    if (this.mode === 'custom') {
      this.modal.querySelectorAll('.number-input').forEach(input => {
        input.classList.remove('border-red-500');
      });
    }
    
    // Don't reset numbers array or result here - keep them for reference
    this.hideError();
  }

  copyResult() {
    if (this.result !== null) {
      navigator.clipboard.writeText(this.result.toFixed(2)).then(() => {
        const btn = this.modal.querySelector('#copy-result');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('bg-green-600', 'hover:bg-green-700');
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('bg-green-600', 'hover:bg-green-700');
        }, 2000);
      });
    }
  }

  showError(message) {
    const errorDisplay = this.modal.querySelector('#error-display');
    errorDisplay.querySelector('p').textContent = message;
    errorDisplay.classList.remove('hidden');
  }

  hideError() {
    this.modal.querySelector('#error-display').classList.add('hidden');
  }

  hideResult() {
    this.modal.querySelector('#result-display').classList.add('hidden');
  }
}