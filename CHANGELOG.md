# CHANGELOG

## [1.1.0] - 2025-06-19

### Added
- **Interactive Calculator Modal System**
  - Base Modal component with accessibility features (focus trap, ARIA labels, keyboard navigation)
  - Sophisticated CalculatorModal with tabbed interface
  - Custom Numbers tab with dynamic input fields (2-10 numbers)
  - Random Numbers tab with range controls and quantity selector
  - Smooth animations and transitions (fade in/out, scale effects)
  - Backdrop blur effect for better visual hierarchy
  
- **Comprehensive Statistical Analysis (Phase 2)**
  - Advanced statistical calculations: Median, Variance, Range, Standard Deviation, Sum, Count
  - All calculations accurate to 2 decimal places with proper number formatting
  - Interactive tooltips explaining each statistical term (hover ⓘ icons)
  - Color-coded statistic cards with gradient backgrounds for visual distinction
  - Variance replaces Mode for more meaningful statistical insights in typical use cases

- **Dark Mode & Visual Enhancements (Phase 3)**
  - Complete dark mode implementation with system preference detection
  - Theme toggle in header with smooth transitions (300ms duration)
  - localStorage persistence for theme preference across sessions
  - Dynamic favicon updates based on theme
  - All components support dark mode with proper contrast ratios

- **Enhanced Animations & Micro-interactions**
  - Page load animations: staggered card reveals, header fade-in, main content slide-up
  - Advanced number morphing animation with 3D rotation effects
  - Success celebration with confetti particles (50 colorful particles)
  - Button press animations with scale effects
  - Tooltip animations with smooth appearance transitions
  - Pulse glow effects on statistics cards with staggered reveals
  - Loading states with spinning indicators during calculations

- **Data Visualization**
  - Interactive SVG bar chart showing input numbers
  - Animated average line with dashed styling
  - Responsive chart sizing with proper scaling
  - Smooth bar growth animations with 100ms stagger
  - Value labels on bars with fade-in effects
  - Grid lines and axis labels for better readability
  - Dark mode support with theme-appropriate colors
  - Smart rendering that ensures chart displays correctly from any tab

- **Dark Mode Polish & Bug Fixes**
  - Complete modal dark mode implementation with proper contrast ratios
  - Fixed Overview tab text colors appearing too dark on initial calculation
  - Enhanced History tab contrast with neutral gray backgrounds
  - Improved Statistics tab card readability in dark mode
  - Fixed "Calculate Again" button stuck in loading state
  - Smart color enforcement with DOM settling delays
  - All form elements (inputs, labels, buttons) fully dark mode compatible
  - Error states and tooltips properly themed for dark mode

- **Tabbed Results Interface**
  - **Overview Tab**: Primary average display with sum and count summary
  - **Statistics Tab**: Four statistical measures in responsive grid layout
  - **History Tab**: Last 10 calculations with timestamps and re-run functionality
  - Seamless tab switching with proper ARIA attributes for accessibility

- **Calculation History & Persistence**
  - localStorage integration for persistent calculation history across browser sessions
  - Click any history item to instantly re-run previous calculations
  - History shows first 5 numbers with count indicator for longer lists
  - Clear history functionality with confirmation dialog
  - Timestamps with smart formatting (relative time: "2m ago", "1h ago", etc.)
  - Input type tracking (custom vs random number generation)

- **Enhanced User Experience**
  - Keyboard shortcut support (Ctrl/Cmd + K to open calculator)
  - "Clear all" button to reset inputs while preserving calculation memory
  - "Calculate Again" preserves previous numbers for iterative calculations
  - Real-time input validation with visual feedback
  - Animated number counting effect when displaying results
  - Copy to clipboard functionality with success feedback
  - Number pills display showing all input values with formatted numbers
  
- **Brand Identity & Visual Design**
  - Rebranded from "Average Calculator" to "MeanMachine"
  - Creative tagline: "Where numbers meet their destiny ✨"
  - Full-page hero image background with geometric patterns
  - Glassmorphism design with backdrop blur effects
  - Centered card layout with semi-transparent overlays
  
- **UI/UX Improvements**
  - Custom styled number inputs (removed spinner controls)
  - Custom range slider styling for random number controls
  - Responsive design for all screen sizes
  - Touch-friendly button sizes and spacing
  - Error handling with user-friendly messages
  - Focus visible indicators for accessibility
  - Dark header and footer framing with matching gray theme
  - Bright green CTA button for visual hierarchy

- **SEO & Content Optimization**
  - Enhanced structured data with WebApplication and SoftwareApplication schemas
  - SEO-optimized meta tags and descriptions
  - Semantic HTML structure with proper heading hierarchy
  - Feature showcase with icon-based benefits
  - Improved alt text and accessibility labels

### Technical Implementation Details
- **Component Architecture**:
  - `Modal.js`: Reusable base modal class with event handling
  - `CalculatorModal.js`: Extends Modal with calculator-specific features
  - Event delegation for dynamically added elements
  - Proper cleanup and memory management

- **Utility Modules (Phase 2)**:
  - `src/utils/statistics.js`: Mathematical functions for all statistical calculations
  - `src/utils/storage.js`: localStorage wrapper with error handling and data validation
  - `formatNumber()`: Internationalized number formatting with configurable decimals
  - `calculateAllStats()`: Single function returning complete statistical analysis

- **Advanced Features**:
  - Tooltip system with dynamic positioning relative to modal container
  - History management with automatic pruning (max 10 items)
  - Smart timestamp formatting with relative time display
  - Tab state management for both input and results interfaces
  - Error boundaries for calculation failures

- **Visual & Animation System (Phase 3)**:
  - `src/utils/theme.js`: Complete theme management with system preference detection
  - `src/utils/animations.css`: 20+ custom animations with GPU acceleration
  - `src/components/Chart.js`: Lightweight SVG chart component with smooth animations
  - Performance optimized animations (60fps) with `will-change` and `transform: translateZ(0)`
  - Reduced motion support for accessibility compliance
  - Custom scrollbar styling with dark mode variants

- **Design System**:
  - Full-viewport background image with `fixed` positioning
  - CSS backdrop-filter for glassmorphism effects
  - Coordinated color scheme (dark gray headers, green accents)
  - Flexbox layout for perfect vertical centering
  - Gradient card system for statistical categories (green=median, purple=variance, orange=range, red=std dev)

- **Accessibility Features**:
  - Focus trap implementation
  - ARIA attributes (role="dialog", aria-modal="true", aria-label)
  - Keyboard navigation (Tab, Shift+Tab, Escape)
  - Focus restoration on modal close
  - Screen reader announcements
  - Semantic HTML with proper heading hierarchy
  - Tooltip content for screen readers

- **State Management**:
  - Maintains calculation history with localStorage persistence
  - Preserves user inputs between calculations
  - Separate state for custom vs random modes
  - Complete statistical results caching for performance
  - History item click-to-load functionality

## [1.0.0] - 2025-06-19

### Added
- Webpack build system with development and production configurations
- Tailwind CSS compilation with custom spacing scale (1rem = 16px base)
- Babel transpilation for modern JavaScript
- Hot module replacement (HMR) for development
- SEO meta tags including Open Graph properties
- Proper event listener for button click functionality
- Test case for calculateAverage function
- Development workflow with PHP proxy support

### Fixed
- **JavaScript Errors:**
  - Fixed typo: `console.lgo` → `console.log` in calculateAverage function
  - Fixed function call: `calculateAverage(10, 20, 30)` → `calculateAverage([10, 20, 30])` to properly pass array parameter
  - Added event listener for button click to replace inline onclick handler
  
- **PHP Errors:**
  - Fixed variable typo: `$emailAdress` → `$emailAddress` in contact.php

- **HTML/CSS Issues:**
  - Fixed Tailwind class: `bg-blu-500` → `bg-blue-500`
  - Removed Tailwind CDN in favor of compiled CSS via Webpack
  - Removed hardcoded script/style tags (now injected by Webpack)
  - Added comprehensive SEO meta tags and Open Graph properties

- **Structured Data (JSON-LD):**
  - Fixed property name: `"naem"` → `"name"`
  - Removed invalid property: `"invalidProperty"`

- **Build Configuration:**
  - Fixed webpack-dev-server proxy configuration to use array format
  - Updated proxy target to match PHP server port (7654)
  - **Critical Fix**: Removed `"type": "commonjs"` from package.json which was causing ES6 module parsing errors
  - Configured babel-loader with proper preset options to handle ES6 modules

### Changed
- Migrated from CDN-based setup to modern build toolchain
- Moved JavaScript and CSS files to src/ directory
- Updated button to use event listener instead of inline onclick

### Technical Details
- Base font size set to 15px as specified
- Custom Tailwind spacing scale implemented (1rem = 16px)
- All assets are now processed through Webpack with content hashing for cache busting
- Development server runs on port 3000 with PHP proxy to port 7654
- Babel configured with @babel/preset-env for modern JavaScript transpilation

### Troubleshooting Notes
- The ES6 module parsing error was caused by `"type": "commonjs"` in package.json
- Webpack dev server proxy must use array format for pattern-based routing
- Babel must be configured with `modules: 'auto'` to properly handle ES6 imports