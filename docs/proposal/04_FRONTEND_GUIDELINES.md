# Frontend Guidelines
### E-Commerce Marketplace Management System
**FAST-NUCES Karachi | Section B | SE Project 2024-2025**

---

## 4.1 Design Principles

- **Clarity First** — Every UI element must serve a clear purpose. Avoid decorative clutter.
- **Consistency** — Use the same colors, fonts, and spacing across all pages.
- **Responsive by Default** — Support screen widths from 768px to 1920px.
- **Accessibility** — Maintain WCAG 2.1 AA contrast ratios; use semantic HTML tags.
- **Performance** — No heavy frameworks; keep page weight minimal.

---

## 4.2 Color Palette

Define all colors as CSS custom properties in `global.css`:

```css
:root {
  --primary:       #2E86C1;  /* Buttons, links, headers — main brand blue */
  --primary-dark:  #1E3A5F;  /* Navbar, footer — deep navy */
  --accent:        #F39C12;  /* CTA buttons, badges — attention orange */
  --success:       #27AE60;  /* Order confirmed, in-stock — green */
  --danger:        #E74C3C;  /* Errors, out-of-stock — red */
  --warning:       #F1C40F;  /* Low stock, caution — yellow */
  --bg-light:      #F8F9FA;  /* Page backgrounds — off-white */
  --bg-white:      #FFFFFF;  /* Cards, modals */
  --text-primary:  #2C3E50;  /* Body text — dark gray */
  --text-muted:    #95A5A6;  /* Subtext, placeholders */
  --border:        #DEE2E6;  /* Input borders, dividers */
  --shadow-sm:     0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md:     0 4px 16px rgba(0, 0, 0, 0.15);
  --radius:        8px;
  --radius-sm:     4px;
}
```

---

## 4.3 Typography

```css
body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  font-size: 1rem;       /* 16px base */
  line-height: 1.6;
  color: var(--text-primary);
}

h1 { font-size: 2.5rem;  font-weight: 700; line-height: 1.2; }
h2 { font-size: 2rem;    font-weight: 600; line-height: 1.2; }
h3 { font-size: 1.5rem;  font-weight: 600; line-height: 1.3; }
h4 { font-size: 1.25rem; font-weight: 600; }

.text-sm    { font-size: 0.875rem; }  /* Labels, captions */
.text-xs    { font-size: 0.75rem;  }  /* Badges, timestamps */
.text-muted { color: var(--text-muted); }
```

---

## 4.4 Component Standards

### Buttons

```css
/* Base */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

/* Variants */
.btn-primary   { background: var(--primary);  color: #fff; }
.btn-secondary { background: transparent; border-color: var(--primary); color: var(--primary); }
.btn-danger    { background: var(--danger);   color: #fff; }
.btn-accent    { background: var(--accent);   color: #fff; }

/* States */
.btn:hover   { filter: brightness(1.1); transform: translateY(-1px); }
.btn:focus   { outline: 3px solid var(--primary); outline-offset: 2px; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
```

### Forms & Inputs

```css
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }

label       { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); }
label.required::after { content: ' *'; color: var(--danger); }

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 1rem;
  transition: border-color 0.2s;
}
.form-input:focus  { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(46,134,193,0.15); }
.form-input.error  { border-color: var(--danger); }

.error-message { font-size: 0.8rem; color: var(--danger); }
```

> **Rule:** Never use placeholder text as the only label. Always show a visible `<label>` above the field.

### Product Cards

```css
.product-card {
  background: var(--bg-white);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.product-card__image  { width: 100%; aspect-ratio: 4/3; object-fit: cover; }
.product-card__body   { padding: 16px; }
.product-card__title  { font-size: 1rem; font-weight: 600; margin-bottom: 8px; }
.product-card__price  { font-size: 1.25rem; font-weight: 700; color: var(--primary); }

/* Stock badge — positioned top-right corner */
.product-card__badge  { position: absolute; top: 10px; right: 10px; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
.badge--in-stock  { background: var(--success); color: #fff; }
.badge--low-stock { background: var(--warning); color: #333; }
.badge--out       { background: var(--danger);  color: #fff; }
```

---

## 4.5 Page Layout

### Grid System

```css
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

/* Product grid */
.product-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(4, 1fr);  /* Desktop */
}
@media (max-width: 1024px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px)  { .product-grid { grid-template-columns: 1fr; } }

/* Listing layout with sidebar */
.listing-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
}
```

### Navbar

```css
.navbar {
  position: sticky;
  top: 0;
  height: 64px;
  background: var(--primary-dark);
  display: flex;
  align-items: center;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
```

---

## 4.6 Folder Structure

```
/frontend
  /css
    global.css        — CSS variables, reset, typography
    components.css    — Buttons, cards, forms, modals, badges
    layout.css        — Navbar, footer, grid, containers
    pages.css         — Page-specific overrides
  /js
    api.js            — Centralized fetch wrapper with JWT header injection
    auth.js           — Login, register, logout, token management
    cart.js           — Cart state: add, remove, update, render
    utils.js          — formatPrice(), formatDate(), debounce(), showToast()
    validation.js     — Form validation helpers
  /pages
    index.html
    login.html
    register.html
    products.html
    product-detail.html
    cart.html
    checkout.html
    order-confirm.html
    orders.html
    seller-dashboard.html
    seller-products.html
    seller-orders.html
    admin-dashboard.html
    admin-users.html
    admin-reports.html
  /assets
    /images           — Static images, logo
    /icons            — SVG icon files
```

---

## 4.7 Naming Conventions

| Context | Convention | Example |
|---------|-----------|---------|
| CSS classes | BEM: `.block__element--modifier` | `.product-card__price--discounted` |
| CSS variables | `--kebab-case` | `--primary-dark` |
| JS variables | `camelCase` | `cartItemCount`, `currentUser` |
| JS functions | `verbNoun` | `fetchProducts()`, `updateCartUI()` |
| HTML IDs | `kebab-case` | `product-search-input` |
| HTML files | `kebab-case.html` | `product-detail.html` |
| JS files | `camelCase.js` | `api.js`, `cartUtils.js` |

---

## 4.8 JavaScript Patterns

### Centralized API Wrapper (`api.js`)

```javascript
const BASE_URL = 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/pages/login.html';
    return;
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  get:    (url)          => request(url),
  post:   (url, body)    => request(url, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (url, body)    => request(url, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (url, body)    => request(url, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (url)          => request(url, { method: 'DELETE' }),
};
```

### Utility Helpers (`utils.js`)

```javascript
export const formatPrice = (amount) =>
  `PKR ${Number(amount).toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

export const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};

export const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};
```
