# SavyCart - Manual Test Checklist

> **Purpose:** Systematic manual testing of the SavyCart app using Browser MCP.  
> **Created:** 2026-11-12  
> **Status:** In Progress  
> **Test Environment:** `yarn serve` on `http://localhost:8080`  
> **Backend API:** `http://localhost:5018/sheiley-shop-api` (dev)  

---

## 📋 Instructions for Future Sessions

1. **Before starting tests:** Clear localStorage/sessionStorage to simulate a fresh user:
   ```js
   localStorage.clear(); sessionStorage.clear();
   ```
2. **To log in:** Use existing credentials (check with user for valid test account). The app stores `token` and `user` in localStorage after login.
3. **App structure:** Vue 2 + Vuetify PWA. Router is history mode. Auth guard checks for `token` in localStorage.
4. **Public pages** (no auth required): `/login`, `/register`, `/about`, `/auth/recovery`, `/auth/recoverypassword`
5. **Authenticated pages** (redirect to `/login` without token): All other routes
6. **Menu navigation:** Drawer menu has main items (My List, Logger Purchase, Shopping History) and Settings group (Measurement Units, Categories, More Settings)
7. **Store modules:** Auth, Products, Categories, MeasurementUnits, ShoppingCar, Shoppings, Taxes, Snackbar

---

## 🔐 Authentication Module

### Login Page (`/login`)
- [ ] Page loads correctly with form fields
- [ ] Username/email field is functional
- [ ] Password field is functional with show/hide toggle
- [ ] "Forgot your password?" link navigates to `/auth/recovery`
- [ ] "Create an account" link navigates to `/register`
- [ ] Login button submits form
- [ ] Invalid credentials show error message
- [ ] Valid credentials redirect to `/product/list` and store token in localStorage
- [ ] Console errors check (no JS errors on load)

### Register Page (`/register`)
- [ ] Page loads correctly with registration form
- [ ] All required fields are present (name, last name, email, password, etc.)
- [ ] Form validation works for empty/invalid fields
- [ ] Successful registration shows confirmation or redirects to login
- [ ] Duplicate email/username shows error message
- [ ] Console errors check

### Password Recovery - Step 1 (`/auth/recovery`)
- [ ] Page loads correctly
- [ ] Email input field is present
- [ ] Submit button sends recovery request
- [ ] Invalid email shows error
- [ ] Valid email shows success message and/or redirects to step 2
- [ ] Console errors check

### Password Recovery - Step 2 (`/auth/recoverypassword`)
- [ ] Page loads correctly
- [ ] New password fields are present
- [ ] Password confirmation validation works
- [ ] Submit updates password successfully
- [ ] Success redirects to login page
- [ ] Console errors check

### Logout (`/auth/logout`)
- [ ] Clicking logout in drawer menu clears token from localStorage
- [ ] Redirects to `/login` page
- [ ] User cannot access authenticated pages after logout

---

## 📦 Products Module

### Product List (`/product/list`)
- [ ] Page loads correctly (main dashboard page)
- [ ] Products are displayed in a list/grid
- [ ] Search/filter functionality works
- [ ] "Add Product" button/link navigates to `/product/add`
- [ ] Clicking a product navigates to `/product/view/:id`
- [ ] Empty state shows when no products exist
- [ ] Product count/display is correct
- [ ] Console errors check

### Add Product (`/product/add`)
- [ ] Page loads correctly with empty form
- [ ] All product fields are present (name, price, category, measurement unit, etc.)
- [ ] Form validation works for required fields
- [ ] Category dropdown loads categories from API
- [ ] Measurement unit dropdown loads units from API
- [ ] Submit creates a new product successfully
- [ ] Success redirects to product list or view
- [ ] API error shows error message
- [ ] Console errors check

### Edit Product (`/product/edit/:id`)
- [ ] Page loads with existing product data pre-filled
- [ ] All fields are editable
- [ ] Changes save successfully
- [ ] Invalid data shows validation errors
- [ ] Cancel/back button returns to previous page
- [ ] Console errors check

### View Product (`/product/view/:id`)
- [ ] Page loads with product details
- [ ] All product information is displayed correctly
- [ ] Edit button navigates to `/product/edit/:id`
- [ ] Delete button shows confirmation dialog
- [ ] Delete confirmation removes the product
- [ ] Console errors check

---

## 🛒 Shopping Module

### Shopping Registration / Logger Purchase (`/shop/registation`)
- [ ] Page loads correctly
- [ ] Product search/filter works
- [ ] Products can be added to shopping cart
- [ ] Quantity adjustment works
- [ ] Shopping cart summary is visible and accurate
- [ ] Total calculation is correct
- [ ] Submit/Complete purchase works
- [ ] Empty cart state is handled
- [ ] Console errors check

### Shopping Cart (`/shop/shopping_car`)
- [ ] Page loads correctly
- [ ] Cart items are displayed
- [ ] Quantity can be modified
- [ ] Items can be removed
- [ ] Total price updates correctly
- [ ] Empty cart shows appropriate message
- [ ] Console errors check

---

## 📊 Analysis Module

### Shopping History (`/analysis/shopping_history`)
- [ ] Page loads correctly
- [ ] Past purchases/shopping trips are listed
- [ ] Date filtering works (if available)
- [ ] Clicking a purchase navigates to `/analysis/purchase_details/:id`
- [ ] Empty state shows when no history exists
- [ ] Console errors check

### Purchase Details (`/analysis/purchase_details/:id`)
- [ ] Page loads with purchase information
- [ ] Purchase date, total, and items are displayed
- [ ] Individual item details (name, quantity, price) are correct
- [ ] Back button returns to shopping history
- [ ] Console errors check

---

## 👤 User Module

### User Profile (`/user/profile`)
- [ ] Page loads correctly
- [ ] User information is displayed (name, email, etc.)
- [ ] Profile can be edited
- [ ] Changes save successfully
- [ ] Validation works for invalid data
- [ ] Console errors check

---

## ⚙️ Settings / Miscellany Module

### Measurement Units (`/measurement_units`)
- [ ] Page loads correctly
- [ ] Existing measurement units are listed
- [ ] New unit can be added
- [ ] Unit can be edited
- [ ] Unit can be deleted with confirmation
- [ ] API errors are handled gracefully
- [ ] Console errors check

### Categories (`/categories`)
- [ ] Page loads correctly
- [ ] Existing categories are listed
- [ ] New category can be added
- [ ] Category can be edited
- [ ] Category can be deleted with confirmation
- [ ] API errors are handled gracefully
- [ ] Console errors check

### Settings (`/settings`)
- [ ] Page loads correctly
- [ ] Language switcher works (if available)
- [ ] App settings can be modified
- [ ] Changes persist after reload
- [ ] Console errors check

---

## 🧭 Navigation & UI

### Drawer Menu (`TheMenu.vue`)
- [ ] Menu icon opens drawer on non-sub pages
- [ ] Back button works on sub-pages (`isSubDir: true`)
- [ ] Swipe right opens drawer (hammer.js gesture)
- [ ] All menu items navigate correctly:
  - [ ] My List → `/product/list`
  - [ ] Logger Purchase → `/shop/registation`
  - [ ] Shopping History → `/analysis/shopping_history`
- [ ] Settings group expands/collapses:
  - [ ] Measurement Units → `/measurement_units`
  - [ ] Categories → `/categories`
  - [ ] More Settings → `/settings`
- [ ] User name displays in drawer footer
- [ ] Profile link in drawer navigates to `/user/profile`
- [ ] Logout link navigates to `/auth/logout`

### General UI
- [ ] Page titles update in browser tab
- [ ] NProgress bar shows on route changes
- [ ] No console JavaScript errors on any page
- [ ] Vuetify components render correctly
- [ ] Responsive design works (test different widths)
- [ ] i18n translations load correctly (default: English)
- [ ] Snackbar notifications appear for actions
- [ ] Delete confirmation dialogs work
- [ ] Empty states display when no data exists

---

## 🌐 Public Pages

### About (`/about`)
- [ ] Page loads correctly without authentication
- [ ] App information is displayed
- [ ] Console errors check

### Root Redirect (`/`)
- [ ] Redirects to `/login` when not authenticated
- [ ] Redirects to `/product/list` when authenticated (per router catch-all)

### Unknown Route (`/nonexistent`)
- [ ] Redirects to `/product/list` (catch-all route)

---

## 🐛 Errors Found

| # | Date | Page/Route | File | Description | Severity | Status |
|---|------|------------|------|-------------|----------|--------|
| 1 | 2026-11-12 | All pages | N/A | Permissions policy violation: "unload is not allowed in this document" | Low | Noted |
| 2 | 2026-11-12 | `/login` | `src/views/auth/login.vue:94-96` | Network errors show generic "Wrong data" message instead of a network/unavailable error. **Fixed:** Added snackbar with server error message when `error.response` is undefined. | Medium | **Fixed** |
| 3 | 2026-11-12 | `/register` | `src/views/auth/register.vue:95` | **CRASH** - `TypeError: Cannot read properties of undefined (reading 'status')` when backend is down. **Fixed:** Added optional chaining `error.response?.status`. | **Critical** | **Fixed** |
| 4 | 2026-11-12 | `/register` | `src/views/auth/register.vue:120` | `error.response.data` accessed without checking `error.response` exists. **Fixed:** Added optional chaining `error.response?.data?.errors`. | **Critical** | **Fixed** |
| 5 | 2026-11-12 | All authenticated API calls | `src/api/HttpClient.js:25` | **CRASH** - Response interceptor accesses `error.response.status` without null check. **Fixed:** Added optional chaining `error.response?.status`. | **Critical** | **Fixed** |
| 6 | 2026-11-12 | Multiple pages | See below | Same `error.response.status` pattern (no null check) in 7+ files. **Fixed:** All 6 files updated with optional chaining. | **Critical** | **Fixed** |
| 7 | 2026-11-12 | `/nonexistent` → `/login` | `src/router.js:229-32` | Page title shows "My list" instead of "Login" after catch-all redirect chain. Title is set by intermediate `/product/list` route and never updated after guard redirects to `/login`. | Low | Open |
| 8 | 2026-11-12 | `/about` | `src/views/About.vue` | Page is a placeholder with only "This is an about page". Page title is generic "sheiley_shop_app". Needs content. | Low | Open |
| 9 | 2026-11-12 | `/register` | `src/views/auth/register.vue:80` | Typo: variable named `userExitst` instead of `userExists`. Also `emailExits` instead of `emailExists`. **Fixed:** Renamed all occurrences. | Low | **Fixed** |

### Files with `error.response.status` without null check (will crash on network errors):

| File | Line | Status Code Checked |
|------|------|-------------------|
| `src/api/HttpClient.js` | 25 | 401 |
| `src/views/auth/register.vue` | 95 | 404 |
| `src/views/auth/recoveryAccountNewPassword.vue` | 142 | 401 |
| `src/views/auth/recoveryAccountNewPassword.vue` | 150 | 409 |
| `src/views/miscellany/categories.vue` | 186 | 409 |
| `src/views/miscellany/measurement_units.vue` | 188 | 409 |
| `src/views/products/add.vue` | 174 | 409 |
| `src/views/shop/shoppingCar.vue` | 168 | 500 |
| `src/views/user/profile.vue` | 140 | 409 |

**Fix pattern applied:** Replaced all `error.response.status` with `error.response?.status` (optional chaining) across all 9 locations.

---

## 📝 Session Notes

### Session 1 - 2026-11-12
- Started manual testing with Browser MCP
- App running on `http://localhost:8080`
- Dev server started with `yarn serve`
- Environment: `.env` created from `.env.bak`
- API endpoint: `http://localhost:5018/sheiley-shop-api` (backend NOT running during test)
- **Public pages tested:** Login ✓, Recovery ✓, Register (crash) ✗, About ✓, redirects ✓
- **Authenticated pages:** Could not test — backend API not available
- **Key finding:** Systemic `error.response` null-check issue across 9 locations in 8 files

### Session 2 - 2026-11-12
- **Fixed all 9 bugs** from Session 1:
  - Bugs #3, #4, #5, #6: Added optional chaining (`error.response?.status`) to 9 locations across 8 files
  - Bug #2: Added snackbar notification for network errors on login page
  - Bug #9: Renamed typo variables (`userExitst` → `userExists`, `emailExits` → `emailExists`)
- **Files modified:**
  - `src/api/HttpClient.js`
  - `src/views/auth/login.vue`
  - `src/views/auth/register.vue`
  - `src/views/auth/recoveryAccountNewPassword.vue`
  - `src/views/miscellany/categories.vue`
  - `src/views/miscellany/measurement_units.vue`
  - `src/views/products/add.vue`
  - `src/views/shop/shoppingCar.vue`
  - `src/views/user/profile.vue`
- **Verification:** Tested all public pages (Login, Register, Recovery) with backend down — no crashes
- **Remaining open bugs:** #1 (permissions policy - noted), #7 (page title on redirect - low), #8 (About page placeholder - low)
- **Next:**
  1. Start the backend API (`itsalb3rt/sheiley-shop-api`) to continue testing authenticated pages
  2. Continue from "📦 Products Module → Product List" section
