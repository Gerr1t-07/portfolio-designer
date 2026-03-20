# 404 Not Found Page - Quick Testing Guide

The 404 page has been created and is ready to test! Here are several ways to quickly see it in action.

## File Location

- **Component:** `src/components/NotFound.jsx`
- **Test Helper:** `src/components/NotFound.test.jsx`

---

## 🚀 Quickest Method: Add Debug Route (2 minutes)

### Step 1: Update App.jsx

Open `src/App.jsx` and add an import at the top:

```jsx
import NotFound from "./components/NotFound";
```

### Step 2: Add Test Button

Inside the `App()` function, add state:

```jsx
const [show404, setShow404] = useState(false);
```

### Step 3: Add Toggle Button to UI

Add this button anywhere in your JSX (for testing only - remove later):

```jsx
<button
  onClick={() => setShow404(!show404)}
  style={{
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 9999,
    padding: "10px 15px",
    background: "#A68F1F",
    color: "#1a1e0e",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "12px",
  }}
>
  {show404 ? "Hide" : "Test"} 404
</button>
```

### Step 4: Render the 404 Page

Wrap your main content:

```jsx
{
  show404 ? (
    <NotFound onNavigate={() => setShow404(false)} />
  ) : (
    <div className="relative min-h-screen bg-bg text-cream">
      {/* Your existing content here */}
    </div>
  );
}
```

### Step 5: Test

1. Run `npm run dev`
2. Open the portfolio
3. Click the "Test 404" button in bottom right
4. See the 404 page appear with animations
5. Click buttons to return to the portfolio

---

## Browser Console Method

This is the quickest if you already have your dev server running.

### Steps:

1. **Open your portfolio** in browser: `http://localhost:5173`
2. **Press `F12`** to open DevTools
3. **Go to Console tab**
4. **Paste this code:**

```javascript
// Create and show 404 page
const root = document.getElementById("root");
const originalContent = root.innerHTML;

// Create an iframe to isolate the component
const iframe = document.createElement("iframe");
iframe.id = "test-404-frame";
iframe.style.cssText =
  "position:fixed; top:0; left:0; width:100%; height:100%; border:none; z-index:99999;";
document.body.appendChild(iframe);

// Show the 404 inside iframe
fetch("http://localhost:5173")
  .then((r) => r.text())
  .then((html) => {
    iframe.srcdoc = html.replace(
      '<div id="root">',
      '<div id="root" style="min-height:100vh; background:#1a1e0e;">',
    );
  });

// To remove later, run this in console:
// document.getElementById('test-404-frame')?.remove()
```

---

## Manual Network Testing

Test how the 404 page behaves with actual broken routes.

### In Vite Dev Server:

1. **Start the dev server:**

   ```bash
   npm run dev
   ```

2. **Visit a fake route:**
   - Go to: `http://localhost:5173/non-existent-page`
   - Open DevTools Network tab
   - The route will fail to load

3. **Create a catch-all route** (if using React Router):

   ```jsx
   import { BrowserRouter, Routes, Route } from "react-router-dom";
   import NotFound from "./components/NotFound";

   <Routes>
     <Route path="/" element={<Home />} />
     <Route path="*" element={<NotFound />} />
   </Routes>;
   ```

---

## Mobile Testing

### iPhone/iPad Simulator:

1. Open DevTools: `F12`
2. Click device toggle icon (or press `Ctrl+Shift+M`)
3. Select "iPhone 12" or similar
4. Test the 404 page responsiveness
5. Verify buttons work on touch

### Android Simulator:

1. Same steps as iPhone
2. Select "Pixel 5" or similar
3. Test touch interactions

### Physical Device:

1. Get your dev server URL: `http://YOUR_IP:5173`
2. On your phone, open that URL
3. Navigate to a fake route: `http://YOUR_IP:5173/test`
4. You'll see the 404 page

---

## Verification Checklist

While testing, check off these items:

### ✅ Visual/Animation

- [ ] Number animates from 0 to 404 smoothly
- [ ] Divider line slides in from left
- [ ] All text fades in with proper timing
- [ ] Corner decorations rotate continuously
- [ ] Background blur pulses gently
- [ ] Gold color (#A68F1F) is consistent

### ✅ Styling

- [ ] Dark background is correct (#1a1e0e)
- [ ] Film grain overlay is subtle
- [ ] Text is centered and readable
- [ ] Buttons have proper styling
- [ ] Layout looks good on mobile (test with DevTools phone mode)
- [ ] No text overflow on small screens

### ✅ Functionality

- [ ] "Go Back" button returns to previous page
- [ ] "Return Home" button works
- [ ] Both buttons respond immediately to clicks
- [ ] onNavigate callback fires correctly
- [ ] No console errors or warnings

### ✅ Accessibility

- [ ] Tab key navigates between buttons
- [ ] Button text is descriptive
- [ ] Decorative elements are hidden from screen readers
- [ ] Colors meet WCAG contrast standards

### ✅ Performance

- [ ] Page loads instantly
- [ ] Animations run at 60fps (no jank)
- [ ] No memory leaks when mounting/unmounting
- [ ] Console shows no errors

---

## Production Deployment

### For Netlify:

**Create `netlify.toml` in your root:**

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Then in your app, handle 404s:

```jsx
// App.jsx - detect invalid routes
const [currentPage, setCurrentPage] = useState("home");

const validRoutes = ["", "work", "services", "about", "contact"];
useEffect(() => {
  const path = window.location.pathname.slice(1);
  if (!validRoutes.includes(path)) {
    setCurrentPage("404");
  }
}, []);
```

### For Vercel:

**Create `vercel.json`:**

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### For GitHub Pages:

GitHub Pages doesn't support custom 404 handling. Use client-side routing:

```jsx
// Check window.location in useEffect
if (!IS_VALID_PAGE) {
  return <NotFound />;
}
```

---

## Cleanup Checklist

Once you've finished testing:

- [ ] Remove the debug "Test 404" button from App.jsx
- [ ] Remove the `show404` state from App.jsx
- [ ] Remove any test console code
- [ ] Verify portfolio still works normally
- [ ] Test all other pages/sections
- [ ] Commit changes: `git add . && git commit -m "Add 404 error page"`

---

## Common Issues & Solutions

### Issue: Animations are slow/janky

**Solution:**

- Check Chrome DevTools Performance tab
- Make sure GPU acceleration is enabled
- Reduce animation complexity if needed

### Issue: Button clicks don't work

**Solution:**

```jsx
// Make sure onNavigate is properly passed
<NotFound
  onNavigate={(dest) => {
    if (dest === "back") window.history.back();
    else window.location.href = "/";
  }}
/>
```

### Issue: Page looks different on mobile

**Solution:**

- Use DevTools responsive mode to test breakpoints
- Check if your Tailwind classes are properly scoped
- Verify `max-w-md` and `px-6` work as expected

### Issue: Console shows errors

**Solution:**

- Check if `HoverFillButton` component is imported correctly
- Verify error handler is initialized
- Look for import path issues

---

## Developer Tips

### To Style the 404 Page:

Edit `src/components/NotFound.jsx` - key style variables:

```javascript
color: "#A68F1F"; // Gold accent
background: "#1a1e0e"; // Dark background
color: "#F2E6DF"; // Cream text
textShadow: "0 0 60px rgba(166, 143, 31, 0.3)"; // Gold glow
```

### To Change Animations:

Look for `animate={}` and `transition={}` props in the component. Framer Motion docs: https://www.framer.com/motion/

### To Modify Buttons:

Edit the button section - they use your existing `HoverFillButton` component for consistency.

### To Log 404s:

The component automatically logs errors via the error handler:

```javascript
errorHandler.log(error, ErrorCategory.RUNTIME_ERROR, ErrorSeverity.LOW, {
  action: "navigate_from_404",
  destination,
});
```

Monitor these in production via the error handler.

---

## Next Steps

1. ✅ Test the 404 page using one of the methods above
2. ✅ Verify it matches your portfolio style
3. ✅ Integrate it into your routing logic
4. ✅ Deploy to production
5. ✅ Monitor error logs in production

Happy testing! 🎉
