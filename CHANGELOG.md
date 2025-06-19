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
  
- **Enhanced User Experience**
  - Keyboard shortcut support (Ctrl/Cmd + K to open calculator)
  - "Clear all" button to reset inputs while preserving calculation memory
  - "Calculate Again" preserves previous numbers for iterative calculations
  - Real-time input validation with visual feedback
  - Animated number counting effect when displaying results
  - Copy to clipboard functionality with success feedback
  - Number pills display showing all input values
  
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

- **Design System**:
  - Full-viewport background image with `fixed` positioning
  - CSS backdrop-filter for glassmorphism effects
  - Coordinated color scheme (dark gray headers, green accents)
  - Flexbox layout for perfect vertical centering

- **Accessibility Features**:
  - Focus trap implementation
  - ARIA attributes (role="dialog", aria-modal="true", aria-label)
  - Keyboard navigation (Tab, Shift+Tab, Escape)
  - Focus restoration on modal close
  - Screen reader announcements

- **State Management**:
  - Maintains calculation history
  - Preserves user inputs between calculations
  - Separate state for custom vs random modes

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