/**
 * Signature Module
 * Shows creator signature and manages special touches
 */

export class SignatureManager {
  constructor() {
    this.showCount = 0;
    this.init();
  }

  init() {
    // Import signature styles
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/styles/signature.css';
    document.head.appendChild(link);

    // Add easter egg hint
    this.addEasterEggHint();

    // Initialize favicon animation
    this.setupFaviconAnimation();

    // Setup achievement progress bar
    this.setupAchievementProgress();
  }

  showSignature() {
    this.showCount++;

    // Show signature every 3 calculations
    if (this.showCount % 3 !== 0) return;

    const signature = document.createElement('div');
    signature.className = 'creator-signature';
    signature.innerHTML = `
      Built with ❤️ by
      <a href="https://github.com/yourusername" target="_blank" rel="noopener">Jay</a>
    `;

    document.body.appendChild(signature);

    // Show with animation
    setTimeout(() => {
      signature.classList.add('show');
    }, 100);

    // Hide after 3 seconds
    setTimeout(() => {
      signature.classList.remove('show');
      setTimeout(() => signature.remove(), 300);
    }, 3000);
  }

  addEasterEggHint() {
    const hint = document.createElement('div');
    hint.className = 'easter-egg-hint';
    hint.textContent = '↑↑↓↓←→←→BA';
    hint.title = 'Try this sequence on your keyboard...';
    document.body.appendChild(hint);
  }

  setupFaviconAnimation() {
    this.originalFavicon = document.querySelector('link[rel="icon"]')?.href;

    // Create animated favicon for calculations
    this.animatedFavicon = this.createAnimatedFavicon();
  }

  createAnimatedFavicon() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // Return a function that generates animated favicon
    return progress => {
      ctx.clearRect(0, 0, 32, 32);

      // Background
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(0, 0, 32, 32);

      // Animated loading bar
      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, 28, 32 * progress, 4);

      // Calculator symbol
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('∑', 16, 14);

      return canvas.toDataURL();
    };
  }

  animateFavicon(duration = 2000) {
    const favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      favicon.href = this.animatedFavicon(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Restore original favicon
        if (this.originalFavicon) {
          favicon.href = this.originalFavicon;
        }
      }
    };

    animate();
  }

  setupAchievementProgress() {
    // Create progress bar container
    const progressBar = document.createElement('div');
    progressBar.className =
      'fixed bottom-0 left-0 right-0 h-2 bg-black/20 z-[9999] opacity-0 transition-opacity duration-300';
    progressBar.innerHTML =
      '<div class="h-full bg-gradient-to-r from-blue-600 via-green-500 to-amber-500 transition-[width] duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" style="width: 0%;"></div>';
    document.body.appendChild(progressBar);

    this.progressBar = progressBar;
    this.progressBarInner = progressBar.querySelector('div');
  }

  updateAchievementProgress(progress) {
    if (!this.progressBar) {
      console.log('Progress bar not initialized');
      return;
    }

    console.log(`Updating achievement progress: ${progress}%`);

    // Show progress bar
    this.progressBar.classList.remove('opacity-0');
    this.progressBar.classList.add('opacity-100');

    // Update width
    this.progressBarInner.style.width = `${progress}%`;

    // Hide after 3 seconds
    clearTimeout(this.progressTimeout);
    this.progressTimeout = setTimeout(() => {
      this.progressBar.classList.remove('opacity-100');
      this.progressBar.classList.add('opacity-0');
    }, 3000);
  }

  create404Page() {
    // This would be used if we had routing, but for now it's just a template
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Lost in Calculation</title>
        <style>
          body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
          ${this.get404Styles()}
        </style>
      </head>
      <body>
        <div class="error-404">
          <h1>404</h1>
          <h2>Lost in the Numbers!</h2>
          <p>The page you're looking for doesn't add up.</p>
          <pre class="calculator-ascii">
     _____________________
    |  _________________  |
    | |              0. | |
    | |_________________| |
    |  ___ ___ ___   ___  |
    | | 7 | 8 | 9 | | + | |
    | |___|___|___| |___| |
    | | 4 | 5 | 6 | | - | |
    | |___|___|___| |___| |
    | | 1 | 2 | 3 | | × | |
    | |___|___|___| |___| |
    | | . | 0 | = | | ÷ | |
    | |___|___|___| |___| |
    |_____________________|
          </pre>
          <a href="/" style="color: white; font-size: 1.2rem;">← Back to Calculator</a>
        </div>
      </body>
      </html>
    `;
  }

  get404Styles() {
    // Return the 404 specific styles
    return `
      .error-404 {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      /* ... rest of 404 styles from signature.css ... */
    `;
  }
}

// Export singleton instance
export const signatureManager = new SignatureManager();
