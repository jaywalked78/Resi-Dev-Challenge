/**
 * Error Boundary Implementation for JavaScript
 * Provides graceful error handling and fallback UI
 */

export class ErrorBoundary {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      fallbackUI: options.fallbackUI || this.createDefaultFallback.bind(this),
      onError: options.onError || this.defaultErrorHandler.bind(this),
      enableLogging: options.enableLogging !== false,
      ...options,
    };

    this.originalContent = element.innerHTML;
    this.hasError = false;
    this.setupErrorHandling();
  }

  /**
   * Setup global error handling
   */
  setupErrorHandling() {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      this.handleError(event.reason, 'Promise rejection');
      event.preventDefault();
    });

    // Catch JavaScript errors
    window.addEventListener('error', event => {
      this.handleError(event.error, 'JavaScript error');
    });

    // Wrap element's event handlers
    this.wrapElementMethods();
  }

  /**
   * Wrap element methods to catch errors
   */
  wrapElementMethods() {
    const originalAddEventListener = this.element.addEventListener;
    const boundary = this;

    this.element.addEventListener = function (type, listener, options) {
      const wrappedListener = function (event) {
        try {
          return listener.call(this, event);
        } catch (error) {
          boundary.handleError(error, `Event handler (${type})`);
        }
      };

      return originalAddEventListener.call(
        this,
        type,
        wrappedListener,
        options
      );
    };
  }

  /**
   * Handle errors with fallback UI
   * @param {Error} error - The error that occurred
   * @param {string} source - Source of the error
   */
  handleError(error, source = 'Unknown') {
    if (this.hasError) return; // Prevent error loops

    this.hasError = true;

    if (this.options.enableLogging) {
      console.error(`[ErrorBoundary] ${source}:`, error);
    }

    // Call custom error handler
    this.options.onError(error, source);

    // Show fallback UI
    this.showFallbackUI(error, source);
  }

  /**
   * Show fallback UI
   * @param {Error} error - The error that occurred
   * @param {string} source - Source of the error
   */
  showFallbackUI(error, source) {
    const fallbackHTML = this.options.fallbackUI(error, source);
    this.element.innerHTML = fallbackHTML;
  }

  /**
   * Create default fallback UI
   * @param {Error} error - The error that occurred
   * @param {string} source - Source of the error
   * @returns {string} HTML for fallback UI
   */
  createDefaultFallback(error) {
    return `
      <div class="error-boundary-fallback bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center transition-colors duration-300">
        <div class="mb-4">
          <svg class="w-12 h-12 text-red-500 dark:text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2 transition-colors duration-300">
          Oops! Something went wrong
        </h3>
        
        <p class="text-red-600 dark:text-red-300 mb-4 transition-colors duration-300">
          We encountered an unexpected error. Don't worry, your data is safe!
        </p>
        
        <div class="space-y-3">
          <button 
            onclick="window.errorBoundary.retry()" 
            class="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 transition-colors duration-300">
            Try Again
          </button>
          
          <button 
            onclick="window.errorBoundary.reportError()" 
            class="ml-3 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors duration-300">
            Report Issue
          </button>
        </div>
        
        ${
          this.options.enableLogging
            ? `
          <details class="mt-4 text-left">
            <summary class="cursor-pointer text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors duration-300">
              Technical Details
            </summary>
            <pre class="mt-2 text-xs bg-red-100 dark:bg-red-900/30 p-3 rounded border text-red-800 dark:text-red-200 overflow-auto transition-colors duration-300">${error.stack || error.message}</pre>
          </details>
        `
            : ''
        }
      </div>
    `;
  }

  /**
   * Default error handler
   * @param {Error} error - The error that occurred
   * @param {string} source - Source of the error
   */
  defaultErrorHandler(error, source) {
    // Send error to analytics service (implement as needed)
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: `${source}: ${error.message}`,
        fatal: false,
      });
    }

    // Log to external service (implement as needed)
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        tags: {
          source: source,
          component: 'ErrorBoundary',
        },
      });
    }
  }

  /**
   * Retry the failed operation
   */
  retry() {
    this.hasError = false;
    this.element.innerHTML = this.originalContent;

    // Trigger a re-initialization event
    this.element.dispatchEvent(
      new CustomEvent('errorBoundaryRetry', {
        detail: { boundary: this },
      })
    );
  }

  /**
   * Report error to developer
   */
  reportError() {
    const mailtoLink = `mailto:support@example.com?subject=Error Report&body=An error occurred in the MeanMachine application. Please include any steps that led to this error.`;
    window.open(mailtoLink);
  }

  /**
   * Wrap a function with error boundary
   * @param {Function} fn - Function to wrap
   * @returns {Function} Wrapped function
   */
  wrapFunction(fn) {
    const boundary = this;
    return function (...args) {
      try {
        return fn.apply(this, args);
      } catch (error) {
        boundary.handleError(error, 'Wrapped function');
        return null;
      }
    };
  }

  /**
   * Wrap an async function with error boundary
   * @param {Function} fn - Async function to wrap
   * @returns {Function} Wrapped async function
   */
  wrapAsyncFunction(fn) {
    const boundary = this;
    return async function (...args) {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        boundary.handleError(error, 'Wrapped async function');
        return null;
      }
    };
  }

  /**
   * Reset error boundary state
   */
  reset() {
    this.hasError = false;
    this.element.innerHTML = this.originalContent;
  }

  /**
   * Destroy error boundary
   */
  destroy() {
    this.reset();
    // Remove global event listeners if needed
  }
}

/**
 * Create and initialize error boundary for an element
 * @param {HTMLElement} element - Element to wrap with error boundary
 * @param {Object} options - Configuration options
 * @returns {ErrorBoundary} Error boundary instance
 */
export function createErrorBoundary(element, options = {}) {
  const boundary = new ErrorBoundary(element, options);

  // Make it globally accessible for fallback UI buttons
  if (!window.errorBoundary) {
    window.errorBoundary = boundary;
  }

  return boundary;
}

/**
 * Wrap calculator modal with error boundary
 * @param {Function} modalFactory - Function that creates the modal
 * @returns {Function} Wrapped modal factory
 */
export function withErrorBoundary(modalFactory) {
  return function (...args) {
    try {
      const modal = modalFactory.apply(this, args);

      // Wrap modal methods
      if (modal && typeof modal === 'object') {
        const boundary = createErrorBoundary(document.body, {
          fallbackUI: () => `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md mx-4">
                <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Calculator Error</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">The calculator encountered an error. Please try refreshing the page.</p>
                <button onclick="window.location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Refresh Page
                </button>
              </div>
            </div>
          `,
        });

        Object.keys(modal).forEach(key => {
          if (typeof modal[key] === 'function') {
            modal[key] = boundary.wrapFunction(modal[key]);
          }
        });
      }

      return modal;
    } catch (error) {
      console.error('[ErrorBoundary] Modal creation failed:', error);
      return null;
    }
  };
}
