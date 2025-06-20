import { Modal } from './Modal.js';
import { calculateAllStats, formatNumber } from '../utils/statistics.js';
import {
  saveCalculation,
  getCalculationHistory,
  formatTimestamp,
} from '../utils/storage.js';
import { Chart } from './Chart.js';
import { GuessModal } from './GuessModal.js';
import { achievementSystem } from '../utils/achievements.js';
import { signatureManager } from '../utils/signature.js';

/**
 * Calculator Modal Component
 * Handles number input and calculation display
 */
export class CalculatorModal extends Modal {
  constructor(calculateFunction) {
    super({
      closeOnBackdrop: true,
      closeOnEscape: true,
      focusTrap: true,
    });

    this.calculateFunction = calculateFunction;
    this.mode = 'custom'; // 'custom' or 'random'
    this.numbers = [];
    this.result = null;
    this.chart = null;

    this.render();
  }

  render() {
    const content = `
      <div class="p-6">
        <!-- Header -->
        <header class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300" id="modal-title">Average Calculator</h2>
          <button 
            class="close-btn text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md p-1" 
            aria-label="Close calculator modal"
            type="button"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        <!-- Modal Description for Screen Readers -->
        <p id="modal-description" class="sr-only">
          Interactive calculator for computing averages. Use tab navigation to move between controls. 
          Choose between custom number input or random number generation modes.
        </p>

        <!-- Tab Navigation -->
        <div class="flex border-b border-gray-200 dark:border-gray-600 mb-6 transition-colors duration-300" role="tablist" aria-labelledby="input-mode-label">
          <h3 id="input-mode-label" class="sr-only">Input Mode Selection</h3>
          <button 
            class="tab-btn px-4 py-2 font-medium text-gray-700 dark:text-white border-b-2 border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300" 
            data-tab="custom" 
            role="tab"
            aria-selected="true"
            aria-controls="custom-tab"
            id="custom-tab-button"
            tabindex="0"
          >
            Custom Numbers
          </button>
          <button 
            class="tab-btn px-4 py-2 font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300" 
            data-tab="random" 
            role="tab"
            aria-selected="false"
            aria-controls="random-tab"
            id="random-tab-button"
            tabindex="-1"
          >
            Random Numbers
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Custom Numbers Tab -->
          <div 
            id="custom-tab" 
            class="tab-panel" 
            role="tabpanel" 
            aria-labelledby="custom-tab-button"
            aria-hidden="false"
          >
            <div class="mb-4">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">Enter numbers to calculate their average (2-10 numbers)</p>
              <div id="number-inputs" class="space-y-3" role="group" aria-label="Number input fields">
                ${this.createNumberInput(0)}
                ${this.createNumberInput(1)}
              </div>
              <div class="mt-3 flex items-center gap-4" role="group" aria-label="Input controls">
                <button 
                  id="add-input" 
                  class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded transition-colors duration-300"
                  aria-label="Add another number input field"
                  type="button"
                >
                  + Add another number
                </button>
                <button 
                  id="clear-inputs" 
                  class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded transition-colors duration-300"
                  aria-label="Clear all number inputs"
                  type="button"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>

          <!-- Random Numbers Tab -->
          <div 
            id="random-tab" 
            class="tab-panel hidden" 
            role="tabpanel" 
            aria-labelledby="random-tab-button"
            aria-hidden="true"
          >
            <div class="space-y-4">
              <div>
                <label 
                  for="random-count"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                >
                  How many numbers?
                </label>
                <input 
                  type="range" 
                  id="random-count" 
                  min="2" 
                  max="10" 
                  value="5" 
                  class="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-describedby="count-display count-range"
                >
                <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300" id="count-range">
                  <span>2</span>
                  <span id="count-display" class="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300" aria-live="polite">5</span>
                  <span>10</span>
                </div>
              </div>
              
              <fieldset class="grid grid-cols-2 gap-4">
                <legend class="sr-only">Random number generation range</legend>
                <div>
                  <label 
                    for="random-min"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                  >
                    Min Value
                  </label>
                  <input 
                    type="number" 
                    id="random-min" 
                    value="1" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                    aria-label="Minimum value for random number generation"
                    aria-describedby="random-range-help"
                  >
                </div>
                <div>
                  <label 
                    for="random-max"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                  >
                    Max Value
                  </label>
                  <input 
                    type="number" 
                    id="random-max" 
                    value="100" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                    aria-label="Maximum value for random number generation"
                    aria-describedby="random-range-help"
                  >
                </div>
                <p id="random-range-help" class="sr-only col-span-2">
                  Set the minimum and maximum values for random number generation. Generated numbers will be between these values inclusive.
                </p>
              </fieldset>
              
            </div>
          </div>
        </div>

        <!-- Result Display -->
        <section id="result-display" class="hidden mt-6" aria-labelledby="results-heading">
          <h3 id="results-heading" class="sr-only">Calculation Results</h3>
          
          <!-- Input Numbers Display -->
          <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors duration-300" role="region" aria-labelledby="input-summary">
            <p id="input-summary" class="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-300">Your numbers:</p>
            <div id="number-pills" class="flex flex-wrap gap-2" role="list" aria-label="Input numbers used in calculation"></div>
          </div>

          <!-- Results Tab Navigation -->
          <div class="flex border-b border-gray-200 dark:border-gray-600 mb-4 transition-colors duration-300" role="tablist" aria-labelledby="results-tabs-label">
            <h4 id="results-tabs-label" class="sr-only">Results Display Options</h4>
            <button 
              class="result-tab-btn px-4 py-2 font-medium text-gray-700 dark:text-white border-b-2 border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors" 
              data-result-tab="overview" 
              role="tab"
              aria-selected="true"
              aria-controls="overview-tab"
              id="overview-tab-button"
              tabindex="0"
            >
              Overview
            </button>
            <button 
              class="result-tab-btn px-4 py-2 font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors" 
              data-result-tab="statistics" 
              role="tab"
              aria-selected="false"
              aria-controls="statistics-tab"
              id="statistics-tab-button"
              tabindex="-1"
            >
              Statistics
            </button>
            <button 
              class="result-tab-btn px-4 py-2 font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors" 
              data-result-tab="history" 
              role="tab"
              aria-selected="false"
              aria-controls="history-tab"
              id="history-tab-button"
              tabindex="-1"
            >
              History
            </button>
          </div>

          <!-- Results Tab Content -->
          <div class="result-tab-content">
            <!-- Overview Tab -->
            <div 
              id="overview-tab" 
              class="result-tab-panel" 
              role="tabpanel" 
              aria-labelledby="overview-tab-button"
              aria-hidden="false"
            >
              <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg transition-colors duration-300" role="region" aria-labelledby="average-display">
                <h5 id="average-display" class="text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">Average</h5>
                <div id="result-value" class="text-5xl font-bold text-blue-600 dark:text-blue-300 mb-4 transition-colors duration-300" aria-live="polite" aria-atomic="true">0</div>
                <div class="grid grid-cols-2 gap-4 mt-6 text-sm" role="group" aria-label="Summary statistics">
                  <div class="text-center" role="group" aria-labelledby="sum-label">
                    <p id="sum-label" class="text-gray-500 dark:text-gray-300 transition-colors duration-300">Sum</p>
                    <p id="sum-value" class="font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300" aria-describedby="sum-label">0</p>
                  </div>
                  <div class="text-center" role="group" aria-labelledby="count-label">
                    <p id="count-label" class="text-gray-500 dark:text-gray-300 transition-colors duration-300">Count</p>
                    <p id="count-value" class="font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300" aria-describedby="count-label">0</p>
                  </div>
                </div>
              </div>
              
              <!-- Chart Visualization -->
              <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors duration-300" role="region" aria-labelledby="chart-heading">
                <h5 id="chart-heading" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center transition-colors duration-300">Data Visualization</h5>
                <div 
                  id="chart-container" 
                  class="flex justify-center items-center min-h-[200px] text-gray-900 dark:text-gray-100 transition-colors duration-300"
                  role="img"
                  aria-label="Bar chart showing input numbers with average line"
                  aria-describedby="chart-description"
                >
                  <!-- Chart will be rendered here -->
                </div>
                <p id="chart-description" class="sr-only">
                  Interactive bar chart displaying all input numbers as bars with a horizontal line indicating the calculated average value.
                </p>
              </div>
            </div>

            <!-- Statistics Tab -->
            <div 
              id="statistics-tab" 
              class="result-tab-panel hidden" 
              role="tabpanel" 
              aria-labelledby="statistics-tab-button"
              aria-hidden="true"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Detailed statistical measures">
                <article class="stat-card p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg transition-colors duration-300" role="listitem" aria-labelledby="median-heading">
                  <div class="flex items-center justify-between mb-2">
                    <h5 id="median-heading" class="font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300">Median</h5>
                    <button 
                      class="tooltip-trigger text-gray-400 dark:text-gray-500 cursor-help transition-colors duration-300 p-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" 
                      data-tooltip="The middle value when numbers are sorted"
                      aria-label="Information about median calculation"
                      type="button"
                    >ⓘ</button>
                  </div>
                  <p id="median-value" class="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300" aria-describedby="median-heading">0</p>
                </article>
                
                <article class="stat-card p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 rounded-lg transition-colors duration-300" role="listitem" aria-labelledby="variance-heading">
                  <div class="flex items-center justify-between mb-2">
                    <h5 id="variance-heading" class="font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300">Variance</h5>
                    <button 
                      class="tooltip-trigger text-gray-400 dark:text-gray-500 cursor-help transition-colors duration-300 p-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50" 
                      data-tooltip="Sample variance: average squared deviation from mean (s²)"
                      aria-label="Information about variance calculation"
                      type="button"
                    >ⓘ</button>
                  </div>
                  <p id="variance-value" class="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300" aria-describedby="variance-heading">0</p>
                </article>
                
                <article class="stat-card p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg transition-colors duration-300" role="listitem" aria-labelledby="range-heading">
                  <div class="flex items-center justify-between mb-2">
                    <h5 id="range-heading" class="font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300">Range</h5>
                    <button 
                      class="tooltip-trigger text-gray-400 dark:text-gray-500 cursor-help transition-colors duration-300 p-1 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50" 
                      data-tooltip="The difference between the highest and lowest values"
                      aria-label="Information about range calculation"
                      type="button"
                    >ⓘ</button>
                  </div>
                  <p id="range-value" class="text-2xl font-bold text-orange-600 dark:text-orange-400 transition-colors duration-300" aria-describedby="range-heading">0</p>
                </article>
                
                <article class="stat-card p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 rounded-lg transition-colors duration-300" role="listitem" aria-labelledby="stddev-heading">
                  <div class="flex items-center justify-between mb-2">
                    <h5 id="stddev-heading" class="font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300">Std. Deviation</h5>
                    <button 
                      class="tooltip-trigger text-gray-400 dark:text-gray-500 cursor-help transition-colors duration-300 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" 
                      data-tooltip="A measure of how spread out the numbers are"
                      aria-label="Information about standard deviation calculation"
                      type="button"
                    >ⓘ</button>
                  </div>
                  <p id="stddev-value" class="text-2xl font-bold text-red-600 dark:text-red-400 transition-colors duration-300" aria-describedby="stddev-heading">0</p>
                </article>
              </div>
            </div>

            <!-- History Tab -->
            <div 
              id="history-tab" 
              class="result-tab-panel hidden" 
              role="tabpanel" 
              aria-labelledby="history-tab-button"
              aria-hidden="true"
            >
              <div class="flex items-center justify-between mb-4">
                <h5 id="history-heading" class="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Recent Calculations</h5>
                <button 
                  id="clear-history" 
                  class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded transition-colors duration-300"
                  aria-label="Clear all calculation history"
                  type="button"
                >
                  Clear History
                </button>
              </div>
              <div 
                id="history-list" 
                class="space-y-2 max-h-60 overflow-y-auto custom-scrollbar" 
                role="list" 
                aria-labelledby="history-heading"
                aria-describedby="history-help"
              >
                <!-- History items will be populated here -->
              </div>
              <p id="history-help" class="sr-only">
                Click on any history item to reload those numbers and results. Use tab key to navigate through history items.
              </p>
            </div>
          </div>

          <!-- Result Action Buttons -->
          <div class="flex gap-3 justify-center mt-6" role="group" aria-label="Result actions">
            <button 
              id="calculate-again" 
              class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors"
              aria-label="Start a new calculation with fresh inputs"
              type="button"
            >
              Calculate Again
            </button>
            <button 
              id="copy-result" 
              class="copy-result-btn px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="Copy calculation results to clipboard"
              aria-describedby="copy-help"
              type="button"
            >
              Copy Result
            </button>
          </div>
          <p id="copy-help" class="sr-only">
            Copies the current tab's content to clipboard. Switch tabs to copy different result formats.
          </p>

          <!-- Tooltip -->
          <div 
            id="tooltip" 
            class="hidden absolute bg-gray-800 dark:bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none z-50 shadow-lg"
            role="tooltip"
            aria-hidden="true"
          ></div>
        </section>

        <!-- Error Display -->
        <div 
          id="error-display" 
          class="hidden mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md transition-colors duration-300"
          role="alert"
          aria-live="assertive"
        >
          <p class="text-sm text-red-600 dark:text-red-400 transition-colors duration-300" id="error-message"></p>
        </div>

        <!-- Footer with Challenge Toggle and Action Buttons -->
        <div class="mt-6 flex items-center justify-between">
          <!-- Challenge Mode Toggle -->
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="enable-guessing" 
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked
            >
            <label 
              for="enable-guessing" 
              class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
              title="Test your math skills by guessing statistical values before calculation"
            >
              Challenge Mode 🎯
            </label>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-3" role="group" aria-label="Calculator actions">
            <button 
              id="cancel-btn" 
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors duration-300"
              aria-label="Cancel and close calculator"
              type="button"
            >
              Cancel
            </button>
            <button 
              id="calculate-btn" 
              class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              aria-describedby="calculate-help"
              type="button"
            >
              Calculate Average
            </button>
            <p id="calculate-help" class="sr-only">
              Processes entered numbers and displays comprehensive statistical results including average, median, variance, and more.
            </p>
          </div>
        </div>
      </div>
    `;

    this.setContent(content);
    this.attachEventListeners();
  }

  createNumberInput(index) {
    return `
      <div class="flex items-center gap-2 number-input-group" role="group" aria-label="Number input ${index + 1}">
        <label for="number-input-${index}" class="sr-only">Number ${index + 1}</label>
        <input 
          type="number" 
          id="number-input-${index}"
          class="number-input flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300" 
          placeholder="Enter a number"
          aria-label="Number ${index + 1} input field"
          aria-describedby="number-help-${index}"
          step="any"
        >
        <span id="number-help-${index}" class="sr-only">Enter any numeric value for calculation</span>
        ${
          index > 1
            ? `
          <button 
            class="remove-input text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded transition-colors duration-300 p-1" 
            aria-label="Remove number ${index + 1} input field"
            type="button"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        `
            : ''
        }
      </div>
    `;
  }

  attachEventListeners() {
    // Close button
    this.modal
      .querySelector('.close-btn')
      .addEventListener('click', () => this.close());
    this.modal
      .querySelector('#cancel-btn')
      .addEventListener('click', () => this.close());

    // Tab switching with keyboard navigation
    this.modal.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', e => this.switchTab(e.target.dataset.tab));
      btn.addEventListener('keydown', e =>
        this.handleTabKeyNavigation(e, 'tab-btn')
      );
    });

    // Custom numbers functionality
    this.modal
      .querySelector('#add-input')
      .addEventListener('click', () => this.addNumberInput());
    this.modal
      .querySelector('#clear-inputs')
      .addEventListener('click', () => this.clearAllInputs());
    this.modal
      .querySelector('#calculate-btn')
      .addEventListener('click', () => this.calculate());

    // Random numbers functionality
    const randomCount = this.modal.querySelector('#random-count');
    const countDisplay = this.modal.querySelector('#count-display');
    randomCount.addEventListener('input', e => {
      countDisplay.textContent = e.target.value;
    });

    // Result tabs with keyboard navigation
    this.modal.querySelectorAll('.result-tab-btn').forEach(btn => {
      btn.addEventListener('click', e =>
        this.switchResultTab(e.target.dataset.resultTab)
      );
      btn.addEventListener('keydown', e =>
        this.handleTabKeyNavigation(e, 'result-tab-btn')
      );
    });

    // Result actions
    this.modal
      .querySelector('#calculate-again')
      .addEventListener('click', () => this.reset());
    this.modal
      .querySelector('#copy-result')
      .addEventListener('click', () => this.copyResult());
    this.modal
      .querySelector('#clear-history')
      .addEventListener('click', () => this.clearHistory());

    // Tooltip functionality
    this.modal.addEventListener(
      'mouseenter',
      e => {
        if (e.target.classList.contains('tooltip-trigger')) {
          this.showTooltip(e.target, e.target.dataset.tooltip);
        }
      },
      true
    );

    this.modal.addEventListener(
      'mouseleave',
      e => {
        if (e.target.classList.contains('tooltip-trigger')) {
          this.hideTooltip();
        }
      },
      true
    );

    // Dynamic event delegation for remove buttons
    this.modal.addEventListener('click', e => {
      if (e.target.closest('.remove-input')) {
        this.removeNumberInput(e.target.closest('.number-input-group'));
      }
    });

    // Real-time validation
    this.modal.addEventListener('input', e => {
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
        btn.classList.add(
          'text-gray-700',
          'dark:text-white',
          'border-b-2',
          'border-blue-500',
          'dark:border-blue-400'
        );
        btn.classList.remove('text-gray-500', 'dark:text-gray-400');
        btn.setAttribute('aria-selected', 'true');
        btn.setAttribute('tabindex', '0');
      } else {
        btn.classList.remove(
          'text-gray-700',
          'dark:text-gray-200',
          'border-b-2',
          'border-blue-500',
          'dark:border-blue-400'
        );
        btn.classList.add('text-gray-500', 'dark:text-gray-400');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
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
      customTab.setAttribute('aria-hidden', 'false');
      randomTab.classList.add('hidden');
      randomTab.setAttribute('aria-hidden', 'true');
    } else {
      customTab.classList.add('hidden');
      customTab.setAttribute('aria-hidden', 'true');
      randomTab.classList.remove('hidden');
      randomTab.setAttribute('aria-hidden', 'false');
    }

    // Announce tab change for screen readers
    this.announceToScreenReader(
      `Switched to ${tab === 'custom' ? 'custom' : 'random'} numbers input mode`
    );

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

    // Don't call displayResult here anymore, let calculate() handle it
  }

  calculate() {
    // Track calculation start time for speed achievement
    this.calculationStartTime = window.performance.now();

    const calculateBtn = this.modal.querySelector('#calculate-btn');

    // Add button press animation
    calculateBtn.classList.add('animate-button-press');
    setTimeout(
      () => calculateBtn.classList.remove('animate-button-press'),
      150
    );

    // Show loading state
    const originalText = calculateBtn.textContent;
    calculateBtn.disabled = true;
    calculateBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Calculating...
    `;

    // Simulate brief calculation delay for better UX
    setTimeout(() => {
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
          calculateBtn.disabled = false;
          calculateBtn.textContent = originalText;
          this.showError('Please enter at least 2 numbers');
          return;
        }
      } else {
        // Random mode - generate numbers first
        this.generateRandomNumbers();
        // Don't return here, continue to guess check
      }

      // Check if user wants to guess (only for valid calculations)
      if (this.numbers.length >= 2) {
        this.checkForGuess();
      }
    }, 500); // Brief delay for loading effect
  }

  checkForGuess() {
    // Calculate stats first (for the guess modal)
    const stats = calculateAllStats(this.numbers);

    // Check if challenge mode is enabled
    const challengeEnabled =
      this.modal.querySelector('#enable-guessing').checked;

    if (challengeEnabled) {
      // Show guess modal
      new GuessModal(
        this.numbers,
        {
          average: stats.average,
          median: stats.median,
          variance: stats.variance,
          stdDev: stats.standardDeviation,
          range: stats.range,
        },
        guessResults => {
          // Process results and continue with display
          this.processGuessResults(guessResults, stats);
        }
      );
    } else {
      // No guess, proceed normally
      this.processGuessResults(null, stats);
    }
  }

  processGuessResults(guessResults, stats) {
    // Record calculation with achievement system
    const numberCount = this.numbers.length;
    achievementSystem.recordCalculation(this.mode, numberCount, guessResults);

    // Check for speed demon achievement (if calculation took < 2 seconds)
    const calculationTime =
      window.performance.now() - (this.calculationStartTime || 0);
    if (calculationTime < 2000) {
      achievementSystem.unlockMilestone('speed_demon');
    }

    // Store results and display
    this.result = stats.average;
    this.allStats = stats;
    this.displayResult();
  }

  displayResult() {
    try {
      // Stats already calculated in processGuessResults
      const stats = this.allStats;

      // Save to history
      saveCalculation({
        numbers: this.numbers,
        results: stats,
        inputType: this.mode,
      });

      // Hide input section
      this.modal.querySelector('.tab-content').classList.add('hidden');
      this.modal.querySelector('#calculate-btn').classList.add('hidden');

      // Show result
      const resultDisplay = this.modal.querySelector('#result-display');
      resultDisplay.classList.remove('hidden');

      // Always switch to Overview tab when showing new results
      this.switchResultTab('overview');

      // Show number pills
      const pillsContainer = this.modal.querySelector('#number-pills');
      pillsContainer.innerHTML = this.numbers
        .map(
          (num, index) =>
            `<span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm transition-colors duration-300" role="listitem" aria-label="Input number ${index + 1}: ${formatNumber(num)}">${formatNumber(num)}</span>`
        )
        .join('');

      // Populate all result values
      this.populateResults(stats);

      // Animate the main average number
      this.animateNumber(stats.average);

      // Create chart visualization (delay to ensure tab is switched)
      setTimeout(() => {
        this.renderChart(this.numbers, stats.average);
      }, 100);

      // Load history for history tab
      this.loadHistory();

      // Announce successful calculation to screen readers
      this.announceToScreenReader(
        `Calculation completed. Average is ${formatNumber(stats.average)}. Results displayed with ${this.numbers.length} numbers processed.`
      );
    } catch (error) {
      this.showError(error.message);
    }
  }

  animateNumber(target) {
    const element = this.modal.querySelector('#result-value');
    const duration = 1500;
    const start = 0;
    let startTime = null;

    // Add morphing animation class
    element.classList.add('animate-numberMorph');

    const animate = timestamp => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easing function for smoother animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (target - start) * easeOutQuart;

      element.textContent = current.toFixed(2);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target.toFixed(2);
        element.classList.remove('animate-numberMorph');

        // Add celebration animation
        element.classList.add('animate-celebrate');
        setTimeout(() => {
          element.classList.remove('animate-celebrate');
          this.triggerConfetti();
        }, 600);
      }
    };

    requestAnimationFrame(animate);
  }

  triggerConfetti() {
    // Create confetti particles
    const confettiCount = 50;
    const colors = ['#059669', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.animationDuration = Math.random() * 2 + 2 + 's';

      document.body.appendChild(confetti);

      // Remove confetti after animation
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 4000);
    }

    // Show signature occasionally
    signatureManager.showSignature();

    // Animate favicon during celebration
    signatureManager.animateFavicon();

    // Update achievement progress
    const nextBadge = achievementSystem.getNextBadge();
    if (nextBadge) {
      signatureManager.updateAchievementProgress(nextBadge.progress);
    }
  }

  reset() {
    // Show input section
    this.modal.querySelector('.tab-content').classList.remove('hidden');
    const calculateBtn = this.modal.querySelector('#calculate-btn');
    calculateBtn.classList.remove('hidden');

    // Reset calculate button state
    calculateBtn.disabled = false;
    calculateBtn.textContent =
      this.mode === 'custom'
        ? 'Calculate Average'
        : 'Generate & Calculate Average';

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
    if (this.result !== null && this.allStats) {
      let textToCopy = '';

      // Get the current active result tab
      const activeTab = this.modal.querySelector(
        '.result-tab-btn[aria-selected="true"]'
      );
      const currentTab = activeTab ? activeTab.dataset.resultTab : 'overview';

      switch (currentTab) {
        case 'overview':
          textToCopy = `Average: ${formatNumber(this.result)}`;
          break;

        case 'statistics':
          textToCopy = `Statistics for [${this.numbers.map(n => formatNumber(n)).join(', ')}]:
Average: ${formatNumber(this.allStats.average)}
Median: ${formatNumber(this.allStats.median)}
Variance: ${formatNumber(this.allStats.variance)}
Range: ${formatNumber(this.allStats.range)}
Standard Deviation: ${formatNumber(this.allStats.standardDeviation)}
Sum: ${formatNumber(this.allStats.sum)}
Count: ${this.allStats.count}`;
          break;

        case 'history': {
          const history = getCalculationHistory();
          if (history.length > 0) {
            textToCopy = `Calculation History:\n${history
              .map(
                calc =>
                  `Numbers: [${calc.numbers.map(n => formatNumber(n)).join(', ')}] → Average: ${formatNumber(calc.results.average)} (${formatTimestamp(calc.timestamp)})`
              )
              .join('\n')}`;
          } else {
            textToCopy = 'No calculation history available';
          }
          break;
        }

        default:
          textToCopy = `Average: ${formatNumber(this.result)}`;
      }

      navigator.clipboard.writeText(textToCopy).then(() => {
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
    const errorMessage = this.modal.querySelector('#error-message');
    errorMessage.textContent = message;
    errorDisplay.classList.remove('hidden');

    // Announce error to screen readers
    this.announceToScreenReader(`Error: ${message}`);
  }

  hideError() {
    this.modal.querySelector('#error-display').classList.add('hidden');
  }

  hideResult() {
    this.modal.querySelector('#result-display').classList.add('hidden');
  }

  switchResultTab(tab) {
    // Update tab buttons
    this.modal.querySelectorAll('.result-tab-btn').forEach(btn => {
      if (btn.dataset.resultTab === tab) {
        btn.classList.add(
          'text-gray-700',
          'dark:text-white',
          'border-b-2',
          'border-blue-500',
          'dark:border-blue-400'
        );
        btn.classList.remove('text-gray-500', 'dark:text-gray-400');
        btn.setAttribute('aria-selected', 'true');
        btn.setAttribute('tabindex', '0');
      } else {
        btn.classList.remove(
          'text-gray-700',
          'dark:text-gray-200',
          'border-b-2',
          'border-blue-500',
          'dark:border-blue-400'
        );
        btn.classList.add('text-gray-500', 'dark:text-gray-400');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
      }
    });

    // Update tab panels
    this.modal.querySelectorAll('.result-tab-panel').forEach(panel => {
      if (panel.id === `${tab}-tab`) {
        panel.classList.remove('hidden');
        panel.setAttribute('aria-hidden', 'false');
      } else {
        panel.classList.add('hidden');
        panel.setAttribute('aria-hidden', 'true');
      }
    });

    // Announce tab change for screen readers
    this.announceToScreenReader(`Switched to ${tab} results view`);
  }

  populateResults(stats) {
    // Overview tab
    this.modal.querySelector('#sum-value').textContent = formatNumber(
      stats.sum
    );
    this.modal.querySelector('#count-value').textContent = stats.count;

    // Force update overview text colors for dark mode with a small delay
    setTimeout(() => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        // More specific selectors for overview tab elements
        const overviewTab = this.modal.querySelector('#overview-tab');
        if (overviewTab) {
          // Average label
          const avgLabel = overviewTab.querySelector('p.text-sm');
          if (avgLabel) {
            avgLabel.classList.remove('text-gray-600', 'dark:text-gray-400');
            avgLabel.classList.add('text-gray-300');
          }

          // Main average value
          const avgValue = this.modal.querySelector('#result-value');
          if (avgValue) {
            avgValue.classList.remove('text-blue-600', 'dark:text-blue-400');
            avgValue.classList.add('text-blue-300');
          }

          // Sum and Count labels and values
          const summaryGrid = overviewTab.querySelector('.grid');
          if (summaryGrid) {
            const labels = summaryGrid.querySelectorAll('p.text-gray-500');
            const values = summaryGrid.querySelectorAll('p.font-semibold');

            labels.forEach(label => {
              label.classList.remove('text-gray-500', 'dark:text-gray-400');
              label.classList.add('text-gray-300');
            });

            values.forEach(value => {
              value.classList.remove('text-gray-700', 'dark:text-gray-300');
              value.classList.add('text-gray-200');
            });
          }
        }
      }
    }, 50);

    // Statistics tab - with staggered animations
    const statElements = [
      {
        element: this.modal.querySelector('#median-value'),
        value: formatNumber(stats.median),
      },
      {
        element: this.modal.querySelector('#variance-value'),
        value: formatNumber(stats.variance),
      },
      {
        element: this.modal.querySelector('#range-value'),
        value: formatNumber(stats.range),
      },
      {
        element: this.modal.querySelector('#stddev-value'),
        value: formatNumber(stats.standardDeviation),
      },
    ];

    statElements.forEach((stat, index) => {
      setTimeout(() => {
        stat.element.textContent = stat.value;

        // Add pulse glow effect
        const card = stat.element.closest('.stat-card');
        card.classList.add('animate-pulse-glow');

        setTimeout(() => {
          card.classList.remove('animate-pulse-glow');
        }, 2000);
      }, index * 200); // Stagger by 200ms
    });
  }

  loadHistory() {
    const history = getCalculationHistory();
    const historyList = this.modal.querySelector('#history-list');

    if (history.length === 0) {
      historyList.innerHTML =
        '<p class="text-gray-500 text-center py-4">No calculations yet</p>';
      return;
    }

    historyList.innerHTML = history
      .map(
        calc => `
      <div class="history-item p-3 bg-gray-50 dark:bg-gray-700/70 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/80 transition-colors duration-300" 
           data-calculation-id="${calc.id}">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex flex-wrap gap-1 mb-1">
              ${calc.numbers
                .slice(0, 5)
                .map(
                  num =>
                    `<span class="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/70 text-blue-600 dark:text-blue-200 rounded transition-colors duration-300">${formatNumber(num)}</span>`
                )
                .join('')}
              ${calc.numbers.length > 5 ? `<span class="text-xs text-gray-500 dark:text-gray-300 transition-colors duration-300">+${calc.numbers.length - 5} more</span>` : ''}
            </div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-100 transition-colors duration-300">Avg: ${formatNumber(calc.results.average)}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500 dark:text-gray-300 transition-colors duration-300">${formatTimestamp(calc.timestamp)}</p>
            <p class="text-xs text-gray-400 dark:text-gray-400 capitalize transition-colors duration-300">${calc.inputType}</p>
          </div>
        </div>
      </div>
    `
      )
      .join('');

    // Add click handlers for history items
    historyList.addEventListener('click', e => {
      const historyItem = e.target.closest('.history-item');
      if (historyItem) {
        const calcId = parseInt(historyItem.dataset.calculationId);
        this.loadFromHistory(calcId);
      }
    });
  }

  loadFromHistory(calcId) {
    const history = getCalculationHistory();
    const calculation = history.find(calc => calc.id === calcId);

    if (!calculation) return;

    // Set the numbers and mode
    this.numbers = [...calculation.numbers];
    this.mode = calculation.inputType;
    this.allStats = calculation.results;
    this.result = calculation.results.average;

    // Update the display
    this.populateResults(calculation.results);

    // Update number pills
    const pillsContainer = this.modal.querySelector('#number-pills');
    pillsContainer.innerHTML = this.numbers
      .map(
        num =>
          `<span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">${formatNumber(num)}</span>`
      )
      .join('');

    // Update main average display
    this.modal.querySelector('#result-value').textContent = formatNumber(
      calculation.results.average
    );

    // Re-render chart
    this.renderChart(this.numbers, calculation.results.average);

    // Switch to overview tab
    this.switchResultTab('overview');
  }

  clearHistory() {
    if (confirm('Are you sure you want to clear all calculation history?')) {
      const success = getCalculationHistory().length > 0;
      if (success) {
        localStorage.removeItem('meanmachine_calculations');
        this.loadHistory();
      }
    }
  }

  showTooltip(trigger, text) {
    const tooltip = this.modal.querySelector('#tooltip');
    tooltip.textContent = text;
    tooltip.classList.remove('hidden');
    tooltip.classList.add('animate-tooltip-appear');

    const rect = trigger.getBoundingClientRect();
    const modalRect = this.modal.getBoundingClientRect();

    tooltip.style.left = `${rect.left - modalRect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - modalRect.top - tooltip.offsetHeight - 5}px`;
    tooltip.style.transform = 'translateX(-50%)';
  }

  hideTooltip() {
    const tooltip = this.modal.querySelector('#tooltip');
    tooltip.classList.remove('animate-tooltip-appear');
    tooltip.classList.add('hidden');
  }

  renderChart(numbers, average) {
    const chartContainer = this.modal.querySelector('#chart-container');

    if (!chartContainer) {
      console.warn('Chart container not found');
      return;
    }

    // Clear previous chart
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    // Ensure we're on the overview tab or wait for it
    const overviewTab = this.modal.querySelector('#overview-tab');
    if (!overviewTab || overviewTab.classList.contains('hidden')) {
      // Wait a bit longer if not on overview tab
      setTimeout(() => this.renderChart(numbers, average), 200);
      return;
    }

    // Create new chart with responsive sizing
    const containerRect = chartContainer.getBoundingClientRect();
    const containerWidth = Math.min(
      400,
      Math.max(300, containerRect.width - 20)
    );
    const isDark = document.documentElement.classList.contains('dark');

    this.chart = new Chart(chartContainer, {
      width: containerWidth,
      height: 200,
      barColor: isDark ? '#60a5fa' : '#3b82f6', // Blue for bars
      averageLineColor: isDark ? '#f87171' : '#ef4444', // Red for average line
      animationDuration: 1000,
    });

    // Render the chart
    try {
      this.chart.render(numbers, average);
    } catch (error) {
      console.error('Chart rendering error:', error);
    }
  }

  /**
   * Handle keyboard navigation for tab interfaces
   * @param {KeyboardEvent} e - Keyboard event
   * @param {string} tabType - Type of tab navigation ('tab-btn' or 'result-tab-btn')
   */
  handleTabKeyNavigation(e, tabType) {
    const tabs = Array.from(this.modal.querySelectorAll(`.${tabType}`));
    const currentIndex = tabs.findIndex(tab => tab === e.target);

    let nextIndex;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
        break;

      case 'Home':
        e.preventDefault();
        tabs[0].focus();
        tabs[0].click();
        break;

      case 'End':
        e.preventDefault();
        tabs[tabs.length - 1].focus();
        tabs[tabs.length - 1].click();
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        e.target.click();
        break;
    }
  }

  /**
   * Announce message to screen readers using aria-live region
   * @param {string} message - Message to announce
   */
  announceToScreenReader(message) {
    let announcer = document.getElementById('screen-reader-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'screen-reader-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }

    // Clear and set new message
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  }
}
