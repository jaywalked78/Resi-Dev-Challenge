/**
 * Console Art Module
 * Displays ASCII art and enhances console experience
 */

export function initConsoleArt() {
  // Display ASCII art logo on load
  const asciiLogo = `
%c
███╗   ███╗███████╗ █████╗ ███╗   ██╗
████╗ ████║██╔════╝██╔══██╗████╗  ██║
██╔████╔██║█████╗  ███████║██╔██╗ ██║
██║╚██╔╝██║██╔══╝  ██╔══██║██║╚██╗██║
██║ ╚═╝ ██║███████╗██║  ██║██║ ╚████║
╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
                                      
███╗   ███╗ █████╗  ██████╗██╗  ██╗██╗███╗   ██╗███████╗
████╗ ████║██╔══██╗██╔════╝██║  ██║██║████╗  ██║██╔════╝
██╔████╔██║███████║██║     ███████║██║██╔██╗ ██║█████╗  
██║╚██╔╝██║██╔══██║██║     ██╔══██║██║██║╚██╗██║██╔══╝  
██║ ╚═╝ ██║██║  ██║╚██████╗██║  ██║██║██║ ╚████║███████╗
╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝

%cWhere numbers meet their destiny ✨
`;

  console.log(
    asciiLogo,
    'color: #3b82f6; font-family: monospace; font-size: 10px; line-height: 1;',
    'color: #9ca3af; font-style: italic; font-size: 14px;'
  );

  // Welcome message
  console.log(
    '%c🎯 Welcome to MeanMachine!',
    'color: #10b981; font-size: 18px; font-weight: bold; padding: 10px 0;'
  );

  // Tips
  console.log('%c💡 Pro Tips:', 'color: #f59e0b; font-weight: bold;');
  console.log(
    '%c• Press Ctrl/Cmd + K to open the calculator\n' +
      '• Try the Konami Code for a surprise! (↑↑↓↓←→←→BA)\n' +
      '• Type help() for developer commands\n' +
      '• Dark mode saves your eyes and earns achievement points!',
    'color: #e5e7eb; line-height: 1.5;'
  );

  // Performance tip with colored output
  console.log(
    '\n%c⚡ Performance Tip: %cFor best performance, use Chrome or Edge',
    'color: #ef4444; font-weight: bold;',
    'color: #fbbf24;'
  );

  // Hidden messages
  console.log('%c', 'padding: 50px 0;'); // Add some space
  console.log(
    '%c🔍 Curious developer? You found the secret console area!',
    'color: #8b5cf6; font-size: 12px;'
  );
  console.log(
    '%c📧 Connect with the developer:',
    'color: #6366f1; font-size: 12px;'
  );
  console.log(
    '%c   GitHub: https://github.com/yourusername\n' +
      '   LinkedIn: https://linkedin.com/in/yourusername\n' +
      '   Portfolio: https://yourportfolio.com',
    'color: #9ca3af; font-size: 11px;'
  );

  // Add custom console methods
  addConsoleCommands();
}

function addConsoleCommands() {
  // Store original console methods
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  // Easter egg: rainbow console.log
  console.rainbow = text => {
    const colors = [
      '#e74c3c',
      '#e67e22',
      '#f1c40f',
      '#2ecc71',
      '#3498db',
      '#9b59b6',
      '#e74c3c',
    ];
    let output = '';
    const styles = [];

    for (let i = 0; i < text.length; i++) {
      const colorIndex = i % colors.length;
      output += `%c${text[i]}`;
      styles.push(
        `color: ${colors[colorIndex]}; font-weight: bold; font-size: 16px;`
      );
    }

    originalLog(output, ...styles);
  };

  // Calculator in console
  console.calculate = (...numbers) => {
    if (numbers.length === 0) {
      console.warn('Please provide numbers to calculate');
      return;
    }

    const sum = numbers.reduce((a, b) => a + b, 0);
    const avg = sum / numbers.length;

    console.log('%c📊 Quick Calculation', 'color: #3b82f6; font-weight: bold;');
    console.log(`Numbers: [${numbers.join(', ')}]`);
    console.log(`Average: ${avg.toFixed(2)}`);
    console.log(`Sum: ${sum}`);
    console.log(`Count: ${numbers.length}`);

    return avg;
  };

  // System info
  console.sysinfo = () => {
    const info = {
      Browser:
        navigator.userAgent.match(/Chrome|Firefox|Safari|Edge/)?.[0] ||
        'Unknown',
      Platform: navigator.platform,
      Language: navigator.language,
      Screen: `${window.screen.width}x${window.screen.height}`,
      Memory: window.performance.memory
        ? `${(window.performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB`
        : 'N/A',
      Cores: navigator.hardwareConcurrency || 'Unknown',
    };

    console.log(
      '%c💻 System Information',
      'color: #10b981; font-weight: bold; font-size: 14px;'
    );
    console.table(info);
  };

  // Theme switcher from console
  console.theme = mode => {
    if (mode === 'dark' || mode === 'light') {
      document.documentElement.setAttribute('data-theme', mode);
      localStorage.setItem('theme', mode);
      console.log(
        `%c🎨 Theme switched to ${mode} mode`,
        'color: #f59e0b; font-weight: bold;'
      );
    } else {
      console.log(
        '%c🎨 Usage: console.theme("dark") or console.theme("light")',
        'color: #ef4444;'
      );
    }
  };

  // Matrix mode
  console.matrix = () => {
    console.log(
      '%c🐇 Follow the white rabbit...',
      'color: #10b981; font-style: italic;'
    );
    setTimeout(() => {
      window.matrix?.();
    }, 1000);
  };

  // Credits
  console.credits = () => {
    console.log(
      '%c🎬 CREDITS',
      'color: #f59e0b; font-size: 20px; font-weight: bold;'
    );
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6b7280;');
    console.log(
      '%cDeveloped with ❤️ by Jay',
      'color: #3b82f6; font-size: 16px;'
    );
    console.log('%cSpecial Thanks:', 'color: #10b981; font-weight: bold;');
    console.log('• The JavaScript community');
    console.log('• Stack Overflow (as always)');
    console.log('• Coffee ☕');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6b7280;');
    console.log('%cBuilt with:', 'color: #8b5cf6; font-weight: bold;');
    console.log('• Vanilla JavaScript');
    console.log('• Webpack');
    console.log('• Tailwind CSS');
    console.log('• A lot of creativity');
  };

  // Fun fact generator
  const mathFacts = [
    'The number 142857 is cyclic - multiply it by 2,3,4,5, or 6 and you get a rotation of the same digits!',
    'The golden ratio (1.618...) appears everywhere in nature, from seashells to galaxies.',
    'There are more possible games of chess than atoms in the observable universe.',
    'Zero is the only number that cannot be represented in Roman numerals.',
    'The word "calculator" comes from the Latin "calculare" which means "to count with stones".',
    '111,111,111 × 111,111,111 = 12,345,678,987,654,321',
    'The symbol for division (÷) is called an obelus.',
    'A "jiffy" is an actual unit of time - 1/100th of a second.',
    'The = sign was invented in 1557 by Robert Recorde.',
    'If you shuffle a deck of cards properly, the order has probably never existed before in history.',
  ];

  console.funfact = () => {
    const fact = mathFacts[Math.floor(Math.random() * mathFacts.length)];
    console.log(
      '%c🎲 Math Fun Fact:',
      'color: #f59e0b; font-weight: bold; font-size: 14px;'
    );
    console.log(
      `%c${fact}`,
      'color: #e5e7eb; font-style: italic; line-height: 1.5;'
    );
  };

  // Override clear to show a message
  const originalClear = console.clear;
  console.clear = () => {
    console.log(
      '%c🧹 Console cleared! Type help() to see available commands.',
      'color: #6b7280; font-style: italic;'
    );
    originalClear();
  };
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  // Log performance metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.getEntriesByType('navigation')[0];
      const paintData = window.performance.getEntriesByType('paint');

      console.log(
        '%c⚡ Page Performance Metrics',
        'color: #10b981; font-weight: bold; font-size: 14px;'
      );
      console.log(
        `DOM Content Loaded: ${perfData.domContentLoadedEventEnd.toFixed(2)}ms`
      );
      console.log(`Page Load Complete: ${perfData.loadEventEnd.toFixed(2)}ms`);

      paintData.forEach(entry => {
        console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
      });

      // Memory usage if available
      if (window.performance.memory) {
        console.log(
          `Memory Usage: ${(window.performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB`
        );
      }
    }, 100);
  });
}

// Auto-initialize on import
initConsoleArt();
initPerformanceMonitoring();
