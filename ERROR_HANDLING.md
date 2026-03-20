# Error Handling Guide

This document outlines the comprehensive error handling system implemented across the portfolio application. The system is designed to be resilient, user-friendly, and easily extensible for future backend integrations.

## Architecture Overview

### Core Components

1. **Error Handler** (`src/lib/errorHandler.js`)
   - Centralized error tracking and logging
   - Supports severity levels (low, medium, high)
   - Categorizes errors for better analysis
   - Extensible for external services (Sentry, LogRocket)

2. **Logger** (`src/lib/logger.js`)
   - Development-friendly console logging
   - Automatic environment detection
   - Structured logging with timestamps
   - Different behavior for production vs. development

3. **Error Context** (`src/context/ErrorContext.jsx`)
   - Global state management for errors and toasts
   - Provides `showToast` function to all components
   - Manages toast lifecycle and auto-dismissal

4. **Error Boundary** (`src/components/ErrorBoundary.jsx`)
   - Catches React rendering errors
   - Displays user-friendly fallback UI
   - Shows error details in development
   - Allows recovery with "Try Again" or "Go Home" buttons

5. **Toast Notifications** (`src/components/Toast.jsx`)
   - Non-intrusive temporary notifications
   - Supports 4 types: info, success, warning, error
   - Auto-dismisses based on severity
   - Customizable duration

6. **useErrorHandler Hook** (`src/hooks/useErrorHandler.js`)
   - Simplifies error handling in components
   - Provides `catchError`, `withErrorHandling`, `withAsyncErrorHandling`, `assert` methods
   - Integrates with ErrorContext for user feedback

7. **Not Found Page** (`src/components/NotFound.jsx`)
   - Beautiful 404 error page matching portfolio design
   - Animated number counter with gold accents
   - Action buttons: "Go Back" and "Return Home"
   - Responsive mobile-friendly design
   - Easter egg error message

---

## Error Categories

The system supports the following error categories:

| Category           | Description                      | Examples                    |
| ------------------ | -------------------------------- | --------------------------- |
| `ASSET_LOADING`    | SVGs, images, fonts fail to load | Missing logo in Preloader   |
| `EXTERNAL_SERVICE` | Third-party service failures     | Broken social media links   |
| `FORM_VALIDATION`  | Input validation errors          | Empty required fields       |
| `RUNTIME_ERROR`    | JavaScript runtime errors        | Null reference, type errors |
| `ANIMATION`        | Framer Motion animation errors   | Invalid variants            |
| `SCROLL`           | Scroll event handling errors     | Ref access failures         |

---

## Error Severity Levels

| Level    | Toast Type     | Duration | User Action           | Example                           |
| -------- | -------------- | -------- | --------------------- | --------------------------------- |
| `LOW`    | ⓘ info/warning | 3s       | None required         | Missing image, silent fallback    |
| `MEDIUM` | ⚠️ warning     | 3-4s     | May require awareness | Form validation issue             |
| `HIGH`   | ❌ error       | 5s       | May require action    | Component crash, critical failure |

---

## Implementation Details

### 1. Preloader Error Handling

**File:** `src/components/Preloader.jsx`

**What's Protected:**

- Logo image load failure → Falls back to text "G Studio"
- Tree stage SVG load failure → Shows pulse animation placeholder

**How It Works:**

```jsx
const handleLogoError = () => {
  catchError(new Error("Preloader logo failed to load"), {
    category: ErrorCategory.ASSET_LOADING,
    severity: ErrorSeverity.LOW,
    context: { assetType: "logo" },
  });
  setLogoFailed(true); // Triggers fallback UI
};
```

**User Experience:**

- Preloader continues to function
- Loading progress completes normally
- User never sees broken images

---

### 2. Services Section Error Handling

**File:** `src/components/sections/Services.jsx`

**What's Protected:**

- Scroll event listeners
- Drag event handling
- Index state mutations
- Card click handlers

**How It Works:**

- All event handlers wrapped with `withErrorHandling` hook
- Validates inputs before state updates
- Cleans up timers properly on unmount
- Catches and logs drag/scroll errors silently

**User Experience:**

- Services carousel remains responsive
- Scroll doesn't break the page
- Drag interactions fail gracefully

---

### 3. Contact Form Validation

**File:** `src/components/ContactButton.jsx`

**What's Protected:**

- Empty name field
- Empty project title field
- Missing project type selection
- Mailto link failures

**Validation Rules:**

```javascript
const validateForm = () => {
  const newErrors = {};

  if (!name.trim()) newErrors.name = "Name is required";
  if (!title.trim()) newErrors.title = "Project title is required";
  if (!type) newErrors.type = "Please select a project type";

  return Object.keys(newErrors).length === 0;
};
```

**User Experience:**

- Red error text beneath invalid fields with icon
- Toast notification if form validation fails
- Submit button disabled while processing
- Clear error messages guide users

---

### 4. React Error Boundary

**File:** `src/components/ErrorBoundary.jsx`

**What's Protected:**

- Component rendering errors
- Child component crashes
- Plugin/library errors

**Fallback UI Shows:**

- Error icon and descriptive message
- "Try Again" button (resets error state)
- "Go Home" button (navigation)
- **Dev Mode Only:** Full error stack trace

**User Experience:**

- App doesn't white-screen crash
- User guided to recovery action
- Developers get debugging info

---

## Usage Examples

### Basic Error Catching

```jsx
import { useErrorHandler } from "../hooks/useErrorHandler";
import { ErrorCategory, ErrorSeverity } from "../lib/errorHandler";

function MyComponent() {
  const { catchError } = useErrorHandler();

  const handleClick = () => {
    try {
      // Do something risky
    } catch (err) {
      catchError(err, {
        category: ErrorCategory.RUNTIME_ERROR,
        severity: ErrorSeverity.MEDIUM,
        showToastMessage: "Something went wrong. Please try again.",
      });
    }
  };
}
```

### Wrap Async Operations

```jsx
const { withAsyncErrorHandling } = useErrorHandler();

const fetchData = withAsyncErrorHandling(
  async () => {
    return await fetch("/api/data").then((r) => r.json());
  },
  {
    category: ErrorCategory.EXTERNAL_SERVICE,
    severity: ErrorSeverity.MEDIUM,
    showToastMessage: "Failed to load data",
  },
);

// Usage
const data = await fetchData();
```

### Wrap Callbacks

```jsx
const { withErrorHandling } = useErrorHandler();

const handleDragEnd = withErrorHandling(
  (event, info) => {
    // Handle drag
  },
  {
    category: ErrorCategory.ANIMATION,
    severity: ErrorSeverity.LOW,
  },
);
```

### Assert Conditions

```jsx
const { assert } = useErrorHandler();

if (
  assert(data, "Data is required", {
    showToastMessage: "No data available",
  })
) {
  // Proceed safely
}
```

---

## Toast Notifications

### Showing Toasts

```jsx
import { useContext } from "react";
import { ErrorContext } from "../context/ErrorContext";

function MyComponent() {
  const { showToast } = useContext(ErrorContext);

  const handleSuccess = () => {
    showToast({
      type: "success",
      message: "Changes saved successfully",
      duration: 2000,
    });
  };

  const handleError = () => {
    showToast({
      type: "error",
      message: "Something went wrong",
      duration: 5000,
    });
  };
}
```

### Toast Types & Defaults

| Type      | Icon | Color  | Default Duration |
| --------- | ---- | ------ | ---------------- |
| `info`    | ⓘ    | Blue   | 3000ms           |
| `success` | ✓    | Green  | 3000ms           |
| `warning` | ⚠️   | Yellow | 3000ms           |
| `error`   | ✗    | Red    | 5000ms           |

---

## Development vs. Production Behavior

### Development Mode

- **Console Logging:** Full structured logging with colors and groups
- **Error Details:** Shows complete stack traces in Error Boundary
- **Network Errors:** Logs all API/asset failures to console
- **Performance Metrics:** Includes timing information

### Production Mode

- **Console Logging:** Errors and warnings only (no verbose info)
- **Error Details:** User-friendly message only
- **Network Errors:** Silently handled with fallbacks
- **External Transport:** Ready for Sentry/LogRocket integration

---

## Future Enhancements

### Integrate External Error Reporting

```javascript
// In your app initialization

import errorHandler from "./lib/errorHandler";

// Example: Sentry integration
errorHandler.registerExternalTransport(async (errorRecord) => {
  await fetch("https://sentry.io/api/..", {
    method: "POST",
    body: JSON.stringify(errorRecord),
  });
});
```

### Add Analytics Tracking

Extend the logger to track error frequency:

```javascript
// Helps identify patterns in production
logger._trackEvent("error", {
  category: "form_validation",
  severity: "medium",
  frequency: 1,
});
```

### Implement Error Recovery

Components can subscribe to error events for custom recovery:

```jsx
import errorHandler from "../lib/errorHandler";

useEffect(() => {
  const unsubscribe = errorHandler.subscribe((error) => {
    if (error.category === "EXTERNAL_SERVICE") {
      // Auto-retry logic
      retryOperation();
    }
  });

  return unsubscribe;
}, []);
```

---

## Testing Error Scenarios

### Test Asset Loading Errors

```
1. Open DevTools Network tab
2. Right-click SVG/image, "Block request URL"
3. Reload page
4. Verify fallback displays correctly
```

### Test Form Validation

```
1. Open Contact modal
2. Click Send without filling fields
3. Verify inline error messages appear
4. Toast notification shown
```

### Test Component Error

```
1. Intentionally throw error in a component
2. Verify Error Boundary catches it
3. Check error details in Dev mode
4. Click "Try Again" to recover
```

### Test Console Logging (Dev)

```
1. Open browser DevTools Console
2. Interact with components
3. Observe structured logs with colors
4. Expand error details in groups
```

---

## Checklist for New Components

When adding new components, ensure:

- ☑️ Wrap DOM access with null checks
- ☑️ Use `useErrorHandler` hook for callbacks
- ☑️ Add `onError` handlers to images/assets
- ☑️ Validate input data before use
- ☑️ Clean up event listeners in useEffect return
- ☑️ Test error paths manually
- ☑️ Log errors with appropriate category & severity

---

## Common Patterns

### Image Loading with Fallback

```jsx
const [imageFailed, setImageFailed] = useState(false);

return (
  <>
    {!imageFailed ? (
      <img
        src={imageUrl}
        onError={() => {
          catchError(/* ... */);
          setImageFailed(true);
        }}
      />
    ) : (
      <div className="placeholder">Image unavailable</div>
    )}
  </>
);
```

### Safe DOM Access

```jsx
const elementRef = useRef(null);

const handleUpdate = () => {
  if (!elementRef.current) {
    catchError(new Error("Element ref is null"));
    return;
  }
  // Safe to use ref now
};
```

### Event Listener Cleanup

```jsx
useEffect(() => {
  const handler = withErrorHandling(() => {
    // handler logic
  });

  window.addEventListener("scroll", handler);
  return () => window.removeEventListener("scroll", handler);
}, [withErrorHandling]);
```

---

## Support & Debugging

### Enable Verbose Logging

Set environment variable in `.env`:

```
VITE_DEBUG=true
```

Then in errorHandler.js, modify isDevelopment check:

```javascript
const isDevelopment =
  import.meta.env.MODE === "development" ||
  import.meta.env.VITE_DEBUG === "true";
```

### Access Error Log

In browser console:

```javascript
import errorHandler from "src/lib/errorHandler";
console.table(errorHandler.getErrorLog());
console.table(errorHandler.getErrorsBySeverity("high"));
```

### Report Issues

When reporting bugs, include:

- Error type and message
- Browser/device info
- Steps to reproduce
- Screenshot of Error Boundary (if applicable)

---

## Testing the 404 Not Found Page

The 404 page (`src/components/NotFound.jsx`) is styled to match your portfolio with animated gold accents, dark backgrounds, and Framer Motion effects.

### Option 1: Manual Testing in Development

**Test the component directly in a dev route:**

1. Create a test route in your app that conditionally renders the 404 page:

```jsx
// In App.jsx or a routing component
import NotFound from "./components/NotFound";

// Example: Add a test button
<button onClick={() => setShowNotFound(true)}>Test 404 Page</button>;
{
  showNotFound && <NotFound onNavigate={() => setShowNotFound(false)} />;
}
```

2. Click the button to view the 404 page
3. Verify animations work smoothly
4. Test "Go Back" and "Return Home" buttons

### Option 2: Using Browser DevTools

**Simulate 404 by blocking requests:**

1. Open your portfolio: `http://localhost:5173`
2. Press `F12` to open DevTools
3. Go to **Network** tab
4. Manually visit a fake route: `http://localhost:5173/non-existent-page`
5. Check console for any errors
6. You can wrap the app in error handling to catch these

### Option 3: Manual Route Testing (No React Router)

**For a static HTML build (production):**

1. Build the project: `npm run build`
2. Create a `.html` file in your `dist/` folder:

```html
<!-- dist/404.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>404 - Not Found</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

3. Configure your server to serve `404.html` for missing routes:
   - **Vite preview**: Manually test with dev server
   - **Netlify**: Set `[[redirects]]` in `netlify.toml`
   - **Vercel**: Set `vercel.json` rewrites
   - **GitHub Pages**: Not directly supported (use client-side routing)

### Option 4: Quick Component Test

**In browser DevTools console:**

```javascript
// Import and render the 404 page
import NotFound from "/src/components/NotFound.jsx";

// This will show you the component structure
console.log(NotFound);
```

### What to Verify When Testing

✓ **Animations:**

- Number counter animates from 0 to 404
- Divider line slides in from left
- Content fades in smoothly
- Corner decorations rotate continuously
- Background blur pulses gently

✓ **Styling:**

- Gold accent colors (#A68F1F) display correctly
- Dark background (#1a1e0e) matches portfolio
- Film grain overlay visible
- Text is readable and aligned properly
- Responsive on mobile (test with phone viewport)

✓ **Functionality:**

- "Go Back" button works (uses window.history.back())
- "Return Home" button works (navigates to home)
- Both buttons respond to clicks
- No console errors appear

✓ **Accessibility:**

- Decorative elements have `aria-hidden="true"`
- Buttons are keyboard accessible
- Tab navigation works
- Screen readers can read the content

### Integration with Your Site

**To use the 404 page in your portfolio:**

```jsx
// App.jsx
import { useState } from "react";
import NotFound from "./components/NotFound";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  // Simulate navigation
  const navigate = (page) => {
    if (!VALID_PAGES.includes(page)) {
      setCurrentPage("404");
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {currentPage === "404" ? (
        <NotFound
          onNavigate={(dest) => {
            if (dest === "back") window.history.back();
            else setCurrentPage("home");
          }}
        />
      ) : (
        // Your normal portfolio content
        <YourPortfolioContent />
      )}
    </>
  );
}

const VALID_PAGES = ["home", "work", "services", "about", "contact"];
```

### Testing Checklist

- [ ] 404 page renders without errors
- [ ] Animations run smoothly at 60fps
- [ ] "Go Back" button works
- [ ] "Return Home" button works
- [ ] Layout is responsive on mobile
- [ ] Text is properly styled with correct colors
- [ ] Gold accents match portfolio theme (#A68F1F)
- [ ] Error is logged to console with correct category
- [ ] No JavaScript errors in console
- [ ] Page works in different browsers (Chrome, Firefox, Safari, Edge)

---

## References

- [React Error Boundaries Docs](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Sentry Integration Guide](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Web Error Handling Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
