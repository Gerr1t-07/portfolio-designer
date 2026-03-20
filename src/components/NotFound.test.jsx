/**
 * 404 Testing Helper
 * 
 * Quick ways to test the NotFound page in your development environment:
 * 
 * 1. TEMPORARY ROUTE METHOD (Recommended for quick testing):
 *    - Add to App.jsx: import { DEBUG_404 } from './components/NotFound.test'
 *    - Add to return: {DEBUG_404 && <NotFound />}
 *    - Set DEBUG_404 = true in this file, then toggle back to false
 * 
 * 2. COMPONENT PREVIEW:
 *    - Open this file
 *    - Run in console: npm run dev, then visit localhost:5173
 *    - Create a route like /test-404
 * 
 * 3. BROWSER CONSOLE:
 *    - Open DevTools Console
 *    - Copy/paste test code from below
 */

import NotFound from './NotFound.jsx'

// Flag to easily enable/disable 404 debugging
export const DEBUG_404 = false

/**
 * Quick test code for browser console:
 * 
 * // Import the NotFound component
 * import NotFound from '/src/components/NotFound.jsx'
 * 
 * // Create and render it
 * const root = document.getElementById('root')
 * const component = React.createElement(NotFound, { 
 *   onNavigate: (dest) => console.log('Navigate:', dest)
 * })
 * ReactDOM.render(component, root)
 * 
 * // To restore: location.reload()
 */

/**
 * Test harness for Storybook or component preview tools
 * Usage: Import and use in your test/story files
 */
export default {
  component: NotFound,
  title: 'Pages/404 Not Found',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

// Test variant: Default
export const Default = {
  args: {
    onNavigate: (destination) => console.log('Navigation to:', destination),
  },
}

// Test variant: Mobile view
export const Mobile = {
  args: {
    onNavigate: (destination) => console.log('Navigation to:', destination),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// Test variant: Tablet view
export const Tablet = {
  args: {
    onNavigate: (destination) => console.log('Navigation to:', destination),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}
