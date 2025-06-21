module.exports = {
  content: ['./src/**/*.{html,js,php}', './*.html', './*.php'],
  darkMode: 'class',
  theme: {
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['0.9375rem', { lineHeight: '1.5rem' }], // 15px
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    spacing: {
      0: '0',
      1: '0.25rem', // 4px
      2: '0.5rem', // 8px
      3: '0.75rem', // 12px
      4: '1rem', // 16px
      5: '1.25rem', // 20px
      6: '1.5rem', // 24px
      8: '2rem', // 32px
      10: '2.5rem', // 40px
      12: '3rem', // 48px
      16: '4rem', // 64px
      20: '5rem', // 80px
      24: '6rem', // 96px
      32: '8rem', // 128px
      40: '10rem', // 160px
      48: '12rem', // 192px
      56: '14rem', // 224px
      64: '16rem', // 256px
    },
    extend: {
      colors: {
        // Tier colors
        'tier-bronze': '#cd7f32',
        'tier-bronze-dark': '#b8860b',
        'tier-silver': '#c0c0c0',
        'tier-silver-dark': '#a0a0a0',
        'tier-gold': '#daa520',
        'tier-gold-light': '#ffb347',
        'tier-platinum': '#e5e7eb',
        'tier-platinum-light': '#ffffff',
        'tier-diamond-pink': '#ff0080',
        'tier-diamond-cyan': '#00ffff',
        'tier-diamond-yellow': '#ffff00',
      },
      backgroundImage: {
        // Tier gradients
        'bronze-gradient': 'linear-gradient(135deg, #cd7f32 0%, #b8860b 100%)',
        'silver-gradient': 'linear-gradient(135deg, #c0c0c0 0%, #a0a0a0 100%)',
        'gold-gradient': 'linear-gradient(135deg, #daa520 0%, #ffb347 50%, #b8860b 100%)',
        'platinum-gradient': 'linear-gradient(135deg, #e5e7eb 0%, #ffffff 50%, #d1d5db 100%)',
        'diamond-gradient': 'linear-gradient(135deg, #ff0080 0%, #00ffff 50%, #ffff00 100%)',
      },
      boxShadow: {
        'tier-bronze': '0 2px 8px rgba(205, 127, 50, 0.2)',
        'tier-silver': '0 4px 16px rgba(192, 192, 192, 0.2)',
        'tier-gold': '0 6px 20px rgba(255, 215, 0, 0.2)',
        'tier-platinum': '0 8px 24px rgba(229, 231, 235, 0.2)',
        'tier-diamond': '0 12px 36px rgba(255, 0, 128, 0.2)',
      },
      keyframes: {
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        goldContentSweep: {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' }
        },
        goldCardSweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        diamondButtonShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4)' }
        }
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.8s ease-out forwards',
        'goldContentSweep': 'goldContentSweep 6s ease-in-out infinite',
        'goldCardSweep': 'goldCardSweep 1s ease-out',
        'diamondButtonShift': 'diamondButtonShift 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite'
      },
      borderWidth: {
        '3': '3px',
      },
      textShadow: {
        'md': '0 2px 4px rgba(0, 0, 0, 0.5)'
      },
      margin: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
      },
      padding: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
      },
    },
  },
  plugins: [
    function({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    },
  ],
};
