/**
 * Konami Code Detection Module
 * Listens for the classic Konami code sequence and triggers developer mode
 * Sequence: ↑ ↑ ↓ ↓ ← → ← → B A
 */

export class KonamiCodeDetector {
  constructor() {
    this.sequence = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];
    this.currentIndex = 0;
    this.isActive = false;
    this.callbacks = [];
    this.timeout = null;

    this.init();
  }

  init() {
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
  }

  handleKeyPress(event) {
    // Clear timeout on each keypress
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // Set timeout to reset sequence after 2 seconds of inactivity
    this.timeout = setTimeout(() => {
      this.currentIndex = 0;
    }, 2000);

    const key = event.key.toLowerCase();
    const expectedKey = this.sequence[this.currentIndex].toLowerCase();

    if (key === expectedKey) {
      this.currentIndex++;

      // Show progress in console (subtle hint)
      if (this.currentIndex === 2) {
        console.log('%c🎮 Keep going...', 'color: #3b82f6; font-weight: bold;');
      } else if (this.currentIndex === 6) {
        console.log(
          '%c🎮 Almost there...',
          'color: #10b981; font-weight: bold;'
        );
      }

      if (this.currentIndex === this.sequence.length) {
        this.activate();
        this.currentIndex = 0;
      }
    } else {
      // Reset if wrong key pressed
      this.currentIndex = 0;
    }
  }

  activate() {
    if (this.isActive) return;

    this.isActive = true;
    console.log(
      '%c🎉 KONAMI CODE ACTIVATED!',
      'color: #f59e0b; font-size: 20px; font-weight: bold;'
    );

    // Trigger all registered callbacks
    this.callbacks.forEach(callback => callback());

    // Add matrix rain effect
    this.triggerMatrixRain();

    // Show developer mode notification
    this.showDeveloperMode();
  }

  onActivate(callback) {
    this.callbacks.push(callback);
  }

  triggerMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-rain';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9998;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.5s ease-in;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix rain animation
    const columns = Math.floor(canvas.width / 20);
    const drops = new Array(columns).fill(1);
    const chars = '0123456789+-×÷=<>[]{}()AVG∑σ²√';

    // Fade in
    setTimeout(() => {
      canvas.style.opacity = '0.3';
    }, 10);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#10b981';
      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    // Remove after 5 seconds
    setTimeout(() => {
      canvas.style.opacity = '0';
      setTimeout(() => {
        clearInterval(interval);
        canvas.remove();
      }, 500);
    }, 5000);
  }

  showDeveloperMode() {
    const notification = document.createElement('div');
    notification.className = 'developer-mode-notification';
    notification.innerHTML = `
      <div class="developer-mode-content">
        <h3>🚀 Developer Mode Activated!</h3>
        <p>Performance metrics now visible in console</p>
        <p>Type <code>help()</code> in console for commands</p>
        <button class="close-dev-mode">Got it!</button>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .developer-mode-notification {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid #10b981;
        border-radius: 12px;
        padding: 24px;
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      
      .developer-mode-notification.show {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      
      .developer-mode-content {
        text-align: center;
        color: white;
      }
      
      .developer-mode-content h3 {
        margin: 0 0 12px 0;
        color: #10b981;
        font-size: 24px;
      }
      
      .developer-mode-content p {
        margin: 8px 0;
        color: #e5e7eb;
      }
      
      .developer-mode-content code {
        background: #374151;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: monospace;
        color: #10b981;
      }
      
      .close-dev-mode {
        margin-top: 16px;
        padding: 8px 24px;
        background: #10b981;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        transition: background 0.2s;
      }
      
      .close-dev-mode:hover {
        background: #059669;
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Close button
    notification
      .querySelector('.close-dev-mode')
      .addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
          notification.remove();
          style.remove();
        }, 300);
      });

    // Enable performance monitoring
    this.enablePerformanceMonitoring();
  }

  enablePerformanceMonitoring() {
    // Monitor calculation performance
    if (window.calculateAverage) {
      const originalCalculate = window.calculateAverage;
      window.calculateAverage = function (...args) {
        const startTime = window.performance.now();
        const result = originalCalculate.apply(this, args);
        const endTime = window.performance.now();

        console.log(
          '%c⚡ Performance Metrics',
          'color: #10b981; font-weight: bold;'
        );
        console.log(`Calculation Time: ${(endTime - startTime).toFixed(2)}ms`);
        console.log(
          `Memory Used: ${(window.performance.memory?.usedJSHeapSize / 1048576).toFixed(2)}MB`
        );
        console.log(`FPS: ${(1000 / (endTime - startTime)).toFixed(0)}`);

        return result;
      };
    }

    // Add console commands
    window.help = () => {
      console.log(
        '%c🛠️ Developer Commands',
        'color: #3b82f6; font-size: 16px; font-weight: bold;'
      );
      console.log(
        '%chelp()%c - Show this help menu',
        'color: #10b981; font-weight: bold;',
        'color: #e5e7eb;'
      );
      console.log(
        '%cabout()%c - About MeanMachine',
        'color: #10b981; font-weight: bold;',
        'color: #e5e7eb;'
      );
      console.log(
        '%cstats()%c - Show performance statistics',
        'color: #10b981; font-weight: bold;',
        'color: #e5e7eb;'
      );
      console.log(
        '%cclear()%c - Clear console',
        'color: #10b981; font-weight: bold;',
        'color: #e5e7eb;'
      );
      console.log(
        '%cachievements()%c - Show achievement progress',
        'color: #10b981; font-weight: bold;',
        'color: #e5e7eb;'
      );
      console.log(
        '%cmatrix()%c - Trigger matrix rain again',
        'color: #10b981; font-weight: bold;',
        'color: #e5e7eb;'
      );
    };

    window.about = () => {
      console.log(
        '%c📊 MeanMachine v1.2.3',
        'color: #3b82f6; font-size: 20px; font-weight: bold;'
      );
      console.log(
        '%cWhere numbers meet their destiny ✨',
        'color: #9ca3af; font-style: italic;'
      );
      console.log('\nBuilt with ❤️ by a passionate developer');
      console.log('Technologies: Vanilla JS, Webpack, Tailwind CSS');
      console.log('Features: PWA, Dark Mode, Accessibility (WCAG 2.1 AA)');
    };

    window.stats = () => {
      const metrics = window.performance.getEntriesByType('navigation')[0];
      console.log(
        '%c📈 Performance Statistics',
        'color: #10b981; font-weight: bold;'
      );
      console.log(`Page Load Time: ${metrics.loadEventEnd.toFixed(2)}ms`);
      console.log(
        `DOM Content Loaded: ${metrics.domContentLoadedEventEnd.toFixed(2)}ms`
      );
      console.log(
        `First Paint: ${window.performance.getEntriesByName('first-paint')[0]?.startTime.toFixed(2)}ms`
      );
      console.log(
        `Memory Usage: ${(window.performance.memory?.usedJSHeapSize / 1048576).toFixed(2)}MB`
      );
    };

    window.matrix = () => {
      this.triggerMatrixRain();
    };
  }

  reset() {
    this.isActive = false;
    this.currentIndex = 0;
  }
}

// Export singleton instance
export const konamiDetector = new KonamiCodeDetector();
