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
| 7 | 2026-11-12 | `/nonexistent` → `/login` | `src/router.js:224-26` | Page title shows "My list" instead of "Login" after catch-all redirect chain. Title is set by intermediate `/product/list` route and never updated after guard redirects to `/login`. **Fixed:** Added `document.title = i18n.t('page_titles.login')` before `next('/login')`. | Low | **Fixed** |
| 8 | 2026-11-12 | `/about` | `src/views/About.vue` | Page is a placeholder with only "This is an about page". Page title is generic "sheiley_shop_app". Needs content. **Fixed:** Added full page content with description, features list, version info, and i18n translations (en/es). Added `meta.title` to route. | Low | **Fixed** |
| 9 | 2026-11-12 | `/register` | `src/views/auth/register.vue:80` | Typo: variable named `userExitst` instead of `userExists`. Also `emailExits` instead of `emailExists`. **Fixed:** Renamed all occurrences. | Low | **Fixed** |
| 10 | 2026-11-12 | `/auth/recovery` | `src/views/auth/recoveryAccount.vue:109-111` | **REGRESSION** — `recoveryWasRequested = true` was removed from `.finally()` in uncommitted changes, so the success screen (checkmark + message) never displays after a valid recovery request. **Fixed:** Added `.then()` handler to set `recoveryWasRequested = true` on success. | High | **Fixed** |
| 11 | 2026-11-12 | `/product/edit/:id` | `src/views/products/edit.vue:168-170` | **Loading overlay stuck** — `updateProduct` catch handler uses `function(error)` losing `this` context; `isLoading` never resets on API failure. **Fixed:** Changed to arrow function, added `isLoading = false` and snackbar error message. | High | **Fixed** |
| 12 | 2026-11-12 | `/product/edit/:id` | `src/views/products/edit.vue:197-199` | **Loading overlay stuck** — `getProduct` catch handler uses `function(error)` losing `this` context; `isLoading` never resets if fetching product fails. **Fixed:** Changed to arrow function, added `isLoading = false` and snackbar error message. | High | **Fixed** |
| 13 | 2026-11-12 | `/product/edit/:id` | `src/views/products/edit.vue:191` | Variable mismatch: `this.include_tax` set but form binds to `itbis`. **Fixed:** Changed to `this.itbis = this.product.include_tax`. | Low | **Fixed** |
| 14 | 2026-11-12 | `/product/view/:id` | `src/views/products/view.vue:148-156` | **Loading overlay stuck** — When offline, `loading` is never set to `false`, so the loading overlay stays forever. **Fixed:** Added `else { this.loading = false }` branch. | Medium | **Fixed** |
| 15 | 2026-11-12 | `/shop/registation` | `src/views/shop/registrationShopping.vue:140-144` | **Loading overlay stuck** — `products/getAll` dispatch has no `.catch()` handler; if API fails, `isLoading` stays true forever. **Fixed:** Added `.catch()` with `isLoading = false` and snackbar error. | High | **Fixed** |
| 16 | 2026-11-12 | `/shop/shopping_car` | `src/views/shop/shoppingCar.vue:133-136` | **CRASH** — `getMeasurementName` returns `value.name` without checking if `value` exists; crashes when no matching measurement unit is found. **Fixed:** Added null check `return value ? value.name : ''`. | **Critical** | **Fixed** |
| 17 | 2026-11-12 | `/shop/shopping_car` | `src/views/shop/shoppingCar.vue:171` | Wrong i18n key: `message.server_error` (singular) instead of `messages.server_error` (plural). **Fixed:** Corrected to `messages.server_error`. | Low | **Fixed** |
| 18 | 2026-11-12 | `/shop/shopping_car` | `src/views/shop/shoppingCar.vue:116` | Inconsistent: `subTotal` uses `parseInt` while `totalTax` uses `parseFloat` for price/quantity, causing precision issues with decimal prices. **Fixed:** Changed to `parseFloat`. | Low | **Fixed** |
| 19 | 2026-11-12 | `/analysis/shopping_history` | `src/views/analysis/shoppingHistory.vue:107-109` | **Loading overlay stuck** — `requestShoppingHistory` catch handler doesn't reset `isLoading`. **Fixed:** Added `isLoading = false` and snackbar error message. | High | **Fixed** |
| 20 | 2026-11-12 | `/analysis/purchase_details/:id` | `src/views/analysis/purchaseDetails.vue:98-118` | **CRASH** — `subTotal` and `itbis` computed properties will crash if `purchaseDetails.purchase_details` or `purchaseDetails.tax` is undefined. **Fixed:** Added null guards returning 0. | **Critical** | **Fixed** |
| 21 | 2026-11-12 | `/analysis/purchase_details/:id` | `src/views/analysis/purchaseDetails.vue:121-127` | `requestPurchaseDetails` has no `.catch()` handler; API failures show no error indication. **Fixed:** Added `.catch()` with snackbar error message. | Medium | **Fixed** |
| 22 | 2026-11-12 | `/user/profile` | `src/views/user/profile.vue:116-118` | **Loading overlay stuck** — `requestUser` catch handler uses `function(error)` losing `this` context; `isLoading` never resets on failure. **Fixed:** Changed to arrow function, added `isLoading = false` and snackbar error. | High | **Fixed** |
| 23 | 2026-11-12 | `/categories` | `src/views/miscellany/categories.vue:143-145` | `createCategory` catch handler uses `function(error)` losing `this` context; no user feedback on non-409 errors. **Fixed:** Changed to arrow function, added snackbar error message. | Medium | **Fixed** |
| 24 | 2026-11-12 | `/measurement_units` | `src/views/miscellany/measurement_units.vue:145-147` | `createMeasurementUnit` catch handler uses `function(error)` losing `this` context; no user feedback on non-409 errors. **Fixed:** Changed to arrow function, added snackbar error message. | Medium | **Fixed** |
| 25 | 2026-11-12 | `/measurement_units` | `src/views/miscellany/measurement_units.vue:160` | Typo: method named `dispatchDeleteMesasurementUnit` instead of `dispatchDeleteMeasurementUnit`. **Fixed:** Renamed method and updated template reference. | Low | **Fixed** |

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

### Session 3 - 2026-11-12
- **Reviewed latest commits:** UI refactoring (PageHeader, EmptyState components), code structure refactoring, dependency updates
- **Verified uncommitted changes from previous session:**
  - Bug #7 fix: `router.js` — sets login page title before redirect from unknown routes ✓
  - Bug #8 fix: `About.vue` — full page content with i18n (en/es), route meta title ✓
  - `recoveryAccount.vue` — network error snackbar added ✓
- **Found and fixed Bug #10 (REGRESSION):** `recoveryAccount.vue` — `recoveryWasRequested = true` was removed from `.finally()`, so the success screen never displayed. Fixed by adding `.then()` handler.
- **Verified all error handling fixes:** All 9 `error.response?.status` locations confirmed with optional chaining. No remaining unsafe patterns.
- **Reviewed `products/list.vue`:** No issues found — proper error handling, loading states, empty states.
- **Ran tests:** All 46 tests pass (11 test files).
- **All bugs now Fixed** (except #1 — permissions policy violation, noted as non-actionable).
- **Uncommitted changes summary:**
  - `src/router.js` — Bug #7 fix
  - `src/views/About.vue` — Bug #8 fix
  - `src/locales/en.json` — About page translations (en)
  - `src/locales/es.json` — About page translations (es)
  - `src/views/auth/recoveryAccount.vue` — Network error handler + Bug #10 fix
- **Next:**
  1. Commit the uncommitted changes
  2. Start the backend API to test authenticated pages (Products, Shopping, Analysis modules)

### Session 4 - 2026-11-12
- **Static analysis of all 18 authenticated view files** completed (backend API not available for live testing).
- **Found and fixed 15 new bugs** (bugs #11–#25) across 9 files:
  - **6 Loading overlay stuck bugs:** `products/edit.vue` (2 instances), `products/view.vue`, `shop/registrationShopping.vue`, `analysis/shoppingHistory.vue`, `user/profile.vue` — catch handlers either used `function(error)` losing `this` context, or were missing entirely, causing `isLoading` to never reset on API failures.
  - **2 Crash bugs:** `shoppingCar.vue` — `getMeasurementName` crashes on undefined measurement unit; `purchaseDetails.vue` — computed properties crash on undefined `purchase_details`/`tax`.
  - **3 Missing error feedback bugs:** `categories.vue`, `measurement_units.vue`, `purchaseDetails.vue` — catch handlers only logged errors without showing snackbar notifications.
  - **2 Minor bugs:** `shoppingCar.vue` — wrong i18n key (`message` vs `messages`), `parseInt` vs `parseFloat` inconsistency; `products/edit.vue` — variable mismatch (`include_tax` vs `itbis`).
  - **1 Typo:** `measurement_units.vue` — `dispatchDeleteMesasurementUnit` → `dispatchDeleteMeasurementUnit`.
- **Files modified:**
  - `src/views/products/edit.vue`
  - `src/views/products/view.vue`
  - `src/views/shop/registrationShopping.vue`
  - `src/views/shop/shoppingCar.vue`
  - `src/views/analysis/shoppingHistory.vue`
  - `src/views/analysis/purchaseDetails.vue`
  - `src/views/user/profile.vue`
  - `src/views/miscellany/categories.vue`
  - `src/views/miscellany/measurement_units.vue`
- **Pattern identified:** Systemic issue with `function(error)` in `.catch()` handlers losing `this` context — affects 6 files. All fixed to arrow functions.
- **Ran tests:** All 46 tests pass (11 test files).
- **All 25 bugs now Fixed** (except #1 — permissions policy violation, noted as non-actionable).
- **Next:**
  1. Commit the changes
  2. Start the backend API to test authenticated pages with real data
