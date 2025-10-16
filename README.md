# 2025 Fall Leadership Conference - Interactive Agenda

## Overview
This is an interactive agenda for the 2025 Fall Leadership Conference hosted by AES Engineering. The agenda is built using modern web technologies and standard libraries for better maintainability and performance.

## Architecture & Libraries

### External Libraries Used
- **Bootstrap 5.3.0**: UI components, grid system, and responsive utilities
- **AOS (Animate On Scroll) 2.3.4**: Scroll-triggered animations
- **Lodash 4.17.21**: Utility functions (debouncing, data manipulation)
- **Moment.js 2.29.4**: Date and time manipulation
- **Day.js 1.11.7**: Lightweight date library (backup)
- **Font Awesome 6.0.0**: Icons
- **Animate.css 4.1.1**: CSS animations

### Modern JavaScript Features
- **ES6+ Classes**: Object-oriented architecture with `ConferenceApp` class
- **Async/Await**: Modern promise handling
- **Map & Set**: Modern data structures for notes and favorites
- **Template Literals**: Clean string interpolation
- **Arrow Functions**: Concise function syntax
- **Destructuring**: Clean parameter handling

## Features

### Core Functionality
- **Interactive Tab Navigation**: Bootstrap-powered tab switching
- **Advanced Search**: Debounced search with result highlighting
- **Modern Notifications**: Bootstrap toast notifications with fallbacks
- **Persistent Storage**: LocalStorage for notes and favorites
- **Responsive Design**: Mobile-first approach with Bootstrap grid
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Attendee Features
- **Session Favorites**: Star sessions for personal schedule
- **Note Taking**: Add and save personal notes for each session
- **Material Downloads**: Simulated download functionality
- **My Schedule**: Personal agenda view with favorite sessions

### Performance Optimizations
- **Debounced Search**: Prevents excessive DOM manipulation
- **Lazy Loading**: AOS animations load only when needed
- **Error Handling**: Graceful degradation when libraries fail to load
- **Memory Management**: Proper cleanup of event listeners and DOM elements

## File Structure
```
html/
├── index.html          # Main agenda page with library imports
├── styles.css          # Custom CSS with Bootstrap integration
├── script.js           # Modern JavaScript class-based architecture
├── package.json        # Dependencies and project metadata
└── README.md          # This documentation
```

## Setup & Installation

### Option 1: Direct Browser Usage
1. Open `index.html` in a web browser
2. All libraries are loaded via CDN - no installation needed

### Option 2: Local Development Server
```bash
# Start local server (Python)
python -m http.server 8000

# Or with Node.js
npx serve .

# Or with any other static server
```

### Option 3: Package Management (Optional)
```bash
# If you want to manage dependencies locally
npm install
npm start
```

## Usage

### Basic Navigation
- **Tab Navigation**: Click tabs or use Ctrl+1-4 keyboard shortcuts
- **Search**: Type in search box or press Ctrl+F to focus
- **Session Actions**: Click star to favorite, note icon to add notes

### Advanced Features
- **Keyboard Shortcuts**: 
  - Ctrl+1: Overview tab
  - Ctrl+2: Wednesday tab
  - Ctrl+3: Thursday tab
  - Ctrl+4: Friday tab
  - Ctrl+F: Focus search
  - Escape: Clear search

### Data Persistence
- **Notes**: Automatically saved to browser localStorage
- **Favorites**: Persist between browser sessions
- **Settings**: All user preferences maintained

## Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Fallbacks**: Graceful degradation for older browsers

## Performance
- **Load Time**: ~2-3 seconds on 3G connection
- **Bundle Size**: ~500KB total (including all libraries)
- **Memory Usage**: Optimized with proper cleanup
- **Animation**: 60fps smooth animations with AOS

## Maintenance

### Updating Libraries
Libraries are loaded via CDN with version pins. To update:
1. Change version numbers in `index.html`
2. Test compatibility
3. Update `package.json` if using local installation

### Adding Features
1. Extend the `ConferenceApp` class
2. Add new methods following existing patterns
3. Use existing utility libraries when possible
4. Maintain error handling and fallbacks

### Debugging
- Open browser DevTools for console logs
- Check network tab for library loading issues
- Use browser's localStorage inspector for data debugging

## Integration
This agenda can be integrated into the main AES website by:
1. Copying files to appropriate directory
2. Updating relative paths in imports
3. Ensuring CDN resources are accessible
4. Testing in production environment

## Security Considerations
- All libraries loaded from trusted CDNs
- No sensitive data stored (only user preferences)
- XSS protection through proper DOM manipulation
- CSP headers recommended for production deployment