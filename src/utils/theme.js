export class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.listeners = [];
    this.init();
  }

  init() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('meanmachine_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    this.currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.applyTheme(this.currentTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('meanmachine_theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme) {
    this.currentTheme = theme;
    this.applyTheme(theme);
    localStorage.setItem('meanmachine_theme', theme);
    this.notifyListeners(theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      // Update favicon for dark mode
      this.updateFavicon('#1f2937'); // dark gray
    } else {
      root.classList.remove('dark');
      // Update favicon for light mode
      this.updateFavicon('#059669'); // green
    }
  }

  updateFavicon(color) {
    // Create a simple colored favicon
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Draw a simple calculator-like icon
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(4, 4, 24, 24);
    ctx.fillStyle = color;
    
    // Draw calculator buttons
    const buttonSize = 4;
    const spacing = 6;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const x = 8 + col * spacing;
        const y = 8 + row * spacing;
        ctx.fillRect(x, y, buttonSize, buttonSize);
      }
    }
    
    // Update favicon
    const link = document.querySelector('link[rel="icon"]') || document.createElement('link');
    link.rel = 'icon';
    link.href = canvas.toDataURL();
    if (!document.querySelector('link[rel="icon"]')) {
      document.head.appendChild(link);
    }
  }

  onThemeChange(callback) {
    this.listeners.push(callback);
  }

  removeThemeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners(theme) {
    this.listeners.forEach(callback => callback(theme));
  }

  getTheme() {
    return this.currentTheme;
  }

  isDark() {
    return this.currentTheme === 'dark';
  }
}