# CSS Quick Reference & Troubleshooting Guide

## Quick Access - Common Issues & Solutions

### Issue: Navbar Not Visible After Login
**Symptoms**: No navbar at top, page looks broken
**Solution**:
```css
.navbar {
    position: fixed !important;
    top: 0 !important;
    z-index: 999;
}
```
**Files to Check**: `public/css/mobile.css` (lines ~95-120)

### Issue: Alerts Hidden Behind Navbar
**Symptoms**: Flash messages appear but can't read them
**Solution**:
```css
.alert {
    margin-top: 75px !important;
    z-index: 998 !important;
}
```
**Files to Check**: `public/css/mobile.css` (lines ~1400-1500)

### Issue: Bottom Nav Overlapping Content
**Symptoms**: Last item in list covered by bottom navigation
**Solution**:
```css
.content-wrapper {
    padding-bottom: 70px !important;
}

.bottom-nav {
    height: 60px !important;
    position: fixed !important;
    bottom: 0 !important;
}
```
**Files to Check**: `public/css/mobile.css` (lines ~180-200)

### Issue: Icons Not Displaying
**Symptoms**: Icon placeholders show but no actual icons
**Solution**: Check Bootstrap Icons CDN in `views/layout.ejs`:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
```
**Files to Check**: `views/layout.ejs` (line ~13)

### Issue: Layout Broken on Mobile
**Symptoms**: Elements overlapping, content off-screen
**Solution**: Check viewport meta tag and responsive CSS
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
**Files to Check**: `views/layout.ejs` (line ~4)

## CSS Class Reference

### Navigation Classes
```
.navbar           - Main navigation bar
.navbar-brand     - Site title/logo area
.navbar-toggler   - Mobile hamburger menu button
.offcanvas        - Slide-out menu container
.offcanvas-header - Menu header area
.list-group-item  - Menu items
```

### Layout Classes
```
.content-wrapper  - Main content area (logged-in)
.container-fluid  - Full-width container
.row              - Flex row layout
.col / .col-6 / .col-12 - Column sizing
```

### Component Classes
```
.card              - Card container
.card-header       - Card title area
.card-body         - Card content area
.welcome-card      - Blue gradient welcome card
.stat-card         - Statistics display card
.post-card         - Post/content card
.alert             - Message alert boxes
.bottom-nav        - Fixed bottom navigation
```

### Utility Classes
```
.d-flex           - Display: flex
.gap-2 / .gap-3   - Gap between flex items
.p-0 / .p-1 / .p-3 - Padding utilities
.m-0 / .m-1 / .m-3 - Margin utilities
.mb-3             - Margin bottom
.mt-3             - Margin top
.text-center      - Text alignment
.fw-bold          - Font weight bold
.text-primary     - Primary color text
.bg-primary       - Primary background
```

## Z-Index Hierarchy

```
Navbar:          999  ← Top layer
Bottom Nav:      999  ← Same as navbar, fixed at bottom
Messages/Alerts: 998  ← Below navbar
Offcanvas Menu:  1050 ← Bootstrap default, above everything
Content:         auto ← Normal stacking order
```

## Color Palette

| Use | Color | Hex | Variable |
|-----|-------|-----|----------|
| Primary | Blue | #0d6efd | --bs-primary |
| Primary Gradient | Blue→Dark Blue | #0d6efd→#0a58ca | - |
| Success | Green | #198754 | --bs-success |
| Danger | Red | #dc3545 | --bs-danger |
| Warning | Yellow | #ffc107 | --bs-warning |
| Info | Cyan | #0dcaf0 | --bs-info |
| Light | Light Gray | #f8f9fa | --bs-light |
| Dark | Dark Gray | #212529 | --bs-dark |
| Border | Gray | #dee2e6 | --bs-gray-300 |
| Background | Very Light Gray | #f5f5f5 | - |

## Responsive Breakpoints

| Device | Width | CSS |
|--------|-------|-----|
| Small Phone | 320px-480px | `@media (min-width: 320px)` |
| Large Phone | 480px-768px | `@media (min-width: 480px)` |
| Tablet | 768px+ | `@media (min-width: 768px)` |
| Desktop | 1024px+ | `@media (min-width: 1024px)` |

## Development Tips

### Clear Browser Cache
```powershell
# Windows - Press these together
Ctrl + Shift + Delete

# Or hard refresh
Ctrl + Shift + R
```

### Test Locally
```powershell
npm start
# Then visit http://localhost:3000
```

### Check CSS in DevTools
1. Open DevTools (F12)
2. Right-click element → Inspect
3. View "Computed" tab to see final CSS
4. Check "Sources" tab for CSS file path

### Debug Common Issues
```powershell
# Check if server is running
Get-Process node

# View server logs
# Check terminal window running npm start

# Test CSS loads
curl http://localhost:3000/css/mobile.css
```

## CSS Property Quick Reference

### Positioning
```css
position: fixed;      /* Stay in place on scroll */
position: sticky;     /* Stick to viewport until scrolled */
top: 0;              /* Distance from top */
bottom: 0;           /* Distance from bottom */
z-index: 999;        /* Stacking order (higher = on top) */
```

### Flexbox
```css
display: flex;                  /* Enable flex layout */
flex-direction: column;         /* Items in column */
flex-direction: row;            /* Items in row */
align-items: center;            /* Vertical center */
justify-content: space-between; /* Horizontal spacing */
gap: 1rem;                      /* Space between items */
flex: 1;                        /* Take available space */
```

### Sizing
```css
width: 100%;              /* Full width */
max-width: 100%;          /* Don't exceed container */
height: auto;             /* Auto height */
min-height: 100vh;        /* Full viewport height */
padding: 1rem;            /* Inside spacing */
margin: 1rem;             /* Outside spacing */
```

### Colors & Backgrounds
```css
background: #0d6efd;                              /* Solid color */
background: linear-gradient(135deg, #0d6efd, #0a58ca); /* Gradient */
color: white;                                     /* Text color */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);       /* Shadow */
border: 1px solid #dee2e6;                       /* Border */
border-radius: 8px;                              /* Rounded corners */
opacity: 0.9;                                    /* Transparency */
```

### Transitions & Animations
```css
transition: all 0.2s ease;              /* Smooth change */
transform: translateY(-2px);            /* Move on Y axis */
transform: translateX(4px);             /* Move on X axis */
animation: slideDown 0.3s ease-out;     /* Play animation */
```

## Common Bootstrap 5 Classes

### Display
```
.d-none           - Hide element
.d-block          - Display as block
.d-flex           - Display as flex
.d-grid           - Display as grid
```

### Visibility
```
.visible          - Element visible
.invisible        - Element hidden but takes space
.opacity-0        - Transparent
.opacity-50       - 50% transparent
.opacity-100      - Fully opaque
```

### Spacing
```
.m-0 through .m-5 - Margin (all sides)
.mt-3             - Margin top
.mb-3             - Margin bottom
.p-0 through .p-5 - Padding (all sides)
.pt-3             - Padding top
.pb-3             - Padding bottom
```

### Text
```
.fw-bold          - Font weight bold
.fw-normal        - Normal weight
.text-center      - Center text
.text-primary     - Primary color
.text-muted       - Muted gray color
```

### Backgrounds
```
.bg-primary       - Primary color background
.bg-success       - Success color background
.bg-danger        - Danger color background
.bg-white         - White background
.bg-light         - Light gray background
```

## CSS Performance Tips

1. **Use !important sparingly** - Only when necessary to override conflicting styles
2. **Combine selectors** - Use fewer, more specific selectors
3. **Minimize animations** - Heavy animations can slow down mobile
4. **Use CSS variables** - Define colors once, reuse everywhere
5. **Leverage GPU** - Use `transform: translateZ(0)` for smooth animations

## Version Control

| File | Current Version | Last Updated |
|------|-----------------|--------------|
| mobile.css | v6.0 | Nov 18, 2025 |
| Bootstrap Icons | 1.11.3 | Nov 18, 2025 |
| Bootstrap CSS | 5.3.0 | Oct 2023 |

## Quick Fixes Reference

### If navbar appears behind content
```css
/* Add to navbar CSS */
position: fixed !important;
z-index: 999;
```

### If alerts aren't showing
```css
/* Add to alert CSS */
margin-top: 75px !important;
z-index: 998 !important;
display: block !important;
```

### If bottom nav overlaps content
```css
/* Add to content-wrapper */
padding-bottom: 70px !important;
```

### If responsive design breaks
```html
<!-- Ensure viewport meta tag exists -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### If icons don't show
```html
<!-- Verify CDN link -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
```

## Useful Browser DevTools Shortcuts

| Task | Shortcut |
|------|----------|
| Open DevTools | F12 |
| Inspect Element | Ctrl+Shift+C |
| Toggle Device Mode | Ctrl+Shift+M |
| Clear Cache | Ctrl+Shift+Delete |
| Hard Refresh | Ctrl+Shift+R |
| Soft Refresh | F5 or Ctrl+R |

---

**Last Updated**: November 18, 2025
**Version**: 6.0
**Maintained By**: Frontend Team
