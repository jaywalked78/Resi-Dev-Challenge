/**
 * Base Modal Component
 * Provides backdrop, animations, and accessibility features
 *
 * @class Modal
 * @param {Object} options - Configuration options for the modal
 * @param {boolean} options.closeOnBackdrop - Whether to close on backdrop click
 * @param {boolean} options.closeOnEscape - Whether to close on escape key
 * @param {boolean} options.focusTrap - Whether to trap focus within modal
 * @param {number} options.animationDuration - Animation duration in milliseconds
 */
export class Modal {
  /**
   * Create a modal instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      closeOnBackdrop: true,
      closeOnEscape: true,
      focusTrap: true,
      animationDuration: 300,
      ...options,
    };

    this.isOpen = false;
    this.previousActiveElement = null;
    this.firstFocusableElement = null;
    this.lastFocusableElement = null;

    this.init();
  }

  /**
   * Initialize modal DOM structure and setup
   * @private
   */
  init() {
    // Create modal structure
    this.backdrop = document.createElement('div');
    this.backdrop.className =
      'modal-backdrop fixed inset-0 bg-black bg-opacity-0 hidden z-40 transition-opacity duration-300';

    this.container = document.createElement('div');
    this.container.className =
      'modal-container fixed inset-0 flex items-center justify-center p-4 z-50 hidden';

    this.modal = document.createElement('div');
    this.modal.className =
      'modal bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto transform scale-95 opacity-0 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50';
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.setAttribute('aria-labelledby', 'modal-title');
    this.modal.setAttribute('aria-describedby', 'modal-description');
    this.modal.setAttribute('tabindex', '-1');

    this.container.appendChild(this.modal);
    document.body.appendChild(this.backdrop);
    document.body.appendChild(this.container);

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Backdrop click
    if (this.options.closeOnBackdrop) {
      this.backdrop.addEventListener('click', () => this.close());
      this.container.addEventListener('click', e => {
        if (e.target === this.container) this.close();
      });
    }

    // Escape key
    if (this.options.closeOnEscape) {
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }

    // Focus trap
    if (this.options.focusTrap) {
      document.addEventListener('keydown', e => {
        if (e.key === 'Tab' && this.isOpen) {
          this.handleTabKey(e);
        }
      });
    }
  }

  handleTabKey(e) {
    const focusableElements = this.modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    this.firstFocusableElement = focusableElements[0];
    this.lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusableElement) {
        e.preventDefault();
        this.lastFocusableElement.focus();
      }
    } else {
      if (document.activeElement === this.lastFocusableElement) {
        e.preventDefault();
        this.firstFocusableElement.focus();
      }
    }
  }

  setContent(content) {
    if (typeof content === 'string') {
      this.modal.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this.modal.innerHTML = '';
      this.modal.appendChild(content);
    }
  }

  open() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.previousActiveElement = document.activeElement;

    // Show elements
    this.backdrop.classList.remove('hidden');
    this.container.classList.remove('hidden');

    // Force reflow
    this.backdrop.offsetHeight;

    // Animate in
    requestAnimationFrame(() => {
      this.backdrop.classList.add('bg-opacity-50');
      this.modal.classList.remove('scale-95', 'opacity-0');
      this.modal.classList.add('scale-100', 'opacity-100');

      // Set focus to first focusable element
      setTimeout(() => {
        const focusableElements = this.modal.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          this.modal.focus();
        }
      }, this.options.animationDuration);
    });

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;

    // Animate out
    this.backdrop.classList.remove('bg-opacity-50');
    this.modal.classList.add('scale-95', 'opacity-0');
    this.modal.classList.remove('scale-100', 'opacity-100');

    setTimeout(() => {
      this.backdrop.classList.add('hidden');
      this.container.classList.add('hidden');

      // Restore focus
      if (this.previousActiveElement) {
        this.previousActiveElement.focus();
      }

      // Restore body scroll
      document.body.style.overflow = '';
    }, this.options.animationDuration);
  }

  destroy() {
    this.backdrop.remove();
    this.container.remove();
  }
}
