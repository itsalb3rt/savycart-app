# SavyCart New Design Revamp Plan

> Status: **IN PROGRESS** — Screen inventory complete, phased implementation plan ready.
> Design files: `new_design/light/` and `new_design/dark/` (14 screens × 2 themes = 28 PNG files).

---

## New Design Screen Inventory

The `new_design/` directory contains **14 unique screens**, each with a `light/` and `dark/` variant (28 total PNG files).

### Screens (light/dark pairs)

| # | Screen | Light File | Dark File | Existing View |
|---|---|---|---|---|
| 1 | **Log in** | `Log in.png` | `Log in (dark).png` | `src/views/auth/login.vue` |
| 2 | **Register** | `Register.png` | `Register (dark).png` | `src/views/auth/register.vue` |
| 3 | **Password recovery** | `Password recovery.png` | `Password recovery (dark).png` | `src/views/auth/recoveryAccount.vue` |
| 4 | **My list** | `My list.png` | `My list (dark).png` | `src/views/products/list.vue` |
| 5 | **Add product** | `Add product.png` | `Add product (dark).png` | `src/views/products/add.vue` |
| 6 | **Edit product** | `Edit product.png` | `Edit product (dark).png` | `src/views/products/edit.vue` |
| 7 | **View product** | `View product.png` | `View product (dark).png` | `src/views/products/view.vue` |
| 8 | **Categories** | `Categories.png` | `Categories (dark).png` | `src/views/miscellany/categories.vue` |
| 9 | **Measurement units** | `Measurement units.png` | `Measurement units (dark).png` | `src/views/miscellany/measurement_units.vue` |
| 10 | **Log purchase** | `Log purchase.png` | `Log purchase (dark).png` | `src/views/shop/registrationShopping.vue` |
| 11 | **Empty cart** | `Empty cart.png` | `Empty cart (dark).png` | `src/views/shop/shoppingCar.vue` |
| 12 | **History** | `History.png` | `History (dark).png` | `src/views/analysis/shoppingHistory.vue` |
| 13 | **Purchase detail** | `Purchase detail.png` | `Purchase detail (dark).png` | `src/views/analysis/purchaseDetails.vue` |
| 14 | **Settings** | `Settings.png` | `Settings (dark).png` | `src/views/miscellany/settings.vue` |

### Notes
- Each screen has both a light and dark mode variant, meaning the redesign includes **dark mode support**.
- All 14 screens map directly to existing views in the app — no new routes or views are required.
- The existing `APP_MODERNIZATION_PLAN.md` covers a previous redesign approach; this new design replaces it with a completely fresh visual direction including dark mode.
- The `Password recovery` screen may also cover `recoveryAccountNewPassword.vue` (the second step of recovery flow).
- `My list` corresponds to the main product list (`products/list.vue`), which is the app's home screen.
- `Empty cart` is the empty state of `shoppingCar.vue`.
- `Settings` may also encompass `user/profile.vue` depending on the design.

---

## Phased Implementation Plan

Each phase focuses on one screen (with its light and dark variants). Phases are ordered by dependency and logical grouping.

### Phase Order Rationale
1. **Auth screens first** — they're entry points and standalone (no shell dependency).
2. **Shell & navigation** — the common framework for all authenticated screens.
3. **Core screens** — product list, add/edit/view (the main workflow).
4. **Shop flow** — log purchase and cart.
5. **Analysis** — history and purchase detail.
6. **Management** — categories, measurement units.
7. **Settings & profile** — user settings.

---

### Phase 1: Auth Screens (Log in, Register, Password Recovery)
**Design files:** `Log in.png`, `Register.png`, `Password recovery.png` (and dark variants)
**Views:** `login.vue`, `register.vue`, `recoveryAccount.vue`, `recoveryAccountNewPassword.vue`

- Redesign all 4 auth views to match the new design.
- Implement dark mode support for auth pages.
- Create a shared `AuthShell` component if not already present.
- Auth pages render outside the main menu/shell, so they need their own layout.

---

### Phase 2: Shell & Navigation
**Design files:** visible in every authenticated screen's design
**Components:** `TheMenu.vue`, `App.vue`

- Redesign the app bar, drawer/navigation, and global shell.
- Implement dark mode theme toggle and Vuetify theme configuration.
- Set up design tokens (colors, spacing, typography) for both light and dark themes.
- This phase enables all subsequent phases to inherit the new shell.

---

### Phase 3: Product List (My List)
**Design files:** `My list.png` (and dark variant)
**Views:** `products/list.vue`
**Components:** `Products/ListProduct.vue`, `Products/Filter.vue`

- Redesign the main product list screen.
- Update the list item component (`ListProduct.vue`).
- Update the filter component (`Filter.vue`).
- This is the app's home screen and the most frequently used view.

---

### Phase 4: Product Forms (Add Product, Edit Product)
**Design files:** `Add product.png`, `Edit product.png` (and dark variants)
**Views:** `products/add.vue`, `products/edit.vue`

- Redesign the add and edit product forms.
- These share similar form patterns, so they can be done together.
- Update form inputs, buttons, and dialog patterns.

---

### Phase 5: Product Detail (View Product)
**Design files:** `View product.png` (and dark variant)
**Views:** `products/view.vue`

- Redesign the product detail/view screen.
- Update any product detail components.

---

### Phase 6: Shop Flow (Log Purchase, Empty Cart)
**Design files:** `Log purchase.png`, `Empty cart.png` (and dark variants)
**Views:** `shop/registrationShopping.vue`, `shop/shoppingCar.vue`
**Components:** `ShopResume.vue`, `ShopResumeMobile.vue`, `ShoppingCar.vue`

- Redesign the purchase logging screen (the shopping cart flow).
- Redesign the empty cart state.
- Update the resume bar components (desktop and mobile).

---

### Phase 7: Analysis (History, Purchase Detail)
**Design files:** `History.png`, `Purchase detail.png` (and dark variants)
**Views:** `analysis/shoppingHistory.vue`, `analysis/purchaseDetails.vue`

- Redesign the purchase history screen (table-based view).
- Redesign the purchase detail screen.
- Update table styling and data presentation.

---

### Phase 8: Management (Categories, Measurement Units)
**Design files:** `Categories.png`, `Measurement units.png` (and dark variants)
**Views:** `miscellany/categories.vue`, `miscellany/measurement_units.vue`

- Redesign the categories management screen.
- Redesign the measurement units management screen.
- These share CRUD patterns and can be done together.

---

### Phase 9: Settings & Profile
**Design files:** `Settings.png` (and dark variant)
**Views:** `miscellany/settings.vue`, `user/profile.vue`

- Redesign the settings screen.
- Update the user profile view if included in the settings design.
- Implement theme toggle (light/dark) if shown in settings.

---

### Phase 10: Final Polish & QA

- Run `yarn test --run` and `yarn build` to verify no regressions.
- Run `yarn i18n:report` to check for missing translations.
- Visual review at 1440px / 768px / 390px breakpoints.
- Verify dark mode toggle works across all screens.
- Check all 19 routes resolve correctly.
- Verify no script-block changes (templates/styles only).

---

## Implementation Checklist

Use this checklist to track progress across sessions. Update the status as each phase completes.

### Phase 1: Auth Screens
- [ ] `login.vue` — redesigned to match `Log in.png`
- [ ] `register.vue` — redesigned to match `Register.png`
- [ ] `recoveryAccount.vue` — redesigned to match `Password recovery.png`
- [ ] `recoveryAccountNewPassword.vue` — redesigned (if applicable)
- [ ] Auth dark mode support
- [ ] Shared `AuthShell` component (if needed)

### Phase 2: Shell & Navigation
- [ ] `App.vue` — global shell and dark mode setup
- [ ] `TheMenu.vue` — navigation drawer and app bar
- [ ] Vuetify theme configuration (light + dark)
- [ ] Design tokens (CSS variables for both themes)
- [ ] Typography (Inter font, if not already done)

### Phase 3: Product List
- [ ] `products/list.vue` — redesigned to match `My list.png`
- [ ] `Products/ListProduct.vue` — list item component
- [ ] `Products/Filter.vue` — filter component
- [ ] Dark mode support

### Phase 4: Product Forms
- [ ] `products/add.vue` — redesigned to match `Add product.png`
- [ ] `products/edit.vue` — redesigned to match `Edit product.png`
- [ ] Form input styling (shared patterns)
- [ ] Dialog/button patterns
- [ ] Dark mode support

### Phase 5: Product Detail
- [ ] `products/view.vue` — redesigned to match `View product.png`
- [ ] Dark mode support

### Phase 6: Shop Flow
- [ ] `shop/registrationShopping.vue` — redesigned to match `Log purchase.png`
- [ ] `shop/shoppingCar.vue` — redesigned to match `Empty cart.png`
- [ ] `ShopResume.vue` — desktop resume bar
- [ ] `ShopResumeMobile.vue` — mobile resume bar
- [ ] Dark mode support

### Phase 7: Analysis
- [ ] `analysis/shoppingHistory.vue` — redesigned to match `History.png`
- [ ] `analysis/purchaseDetails.vue` — redesigned to match `Purchase detail.png`
- [ ] Table styling updates
- [ ] Dark mode support

### Phase 8: Management
- [ ] `miscellany/categories.vue` — redesigned to match `Categories.png`
- [ ] `miscellany/measurement_units.vue` — redesigned to match `Measurement units.png`
- [ ] CRUD patterns (shared)
- [ ] Dark mode support

### Phase 9: Settings & Profile
- [ ] `miscellany/settings.vue` — redesigned to match `Settings.png`
- [ ] `user/profile.vue` — updated (if applicable)
- [ ] Theme toggle (light/dark)
- [ ] Dark mode support

### Phase 10: Final Polish & QA
- [ ] `yarn test --run` — all tests pass
- [ ] `yarn build` — 0 errors
- [ ] `yarn i18n:report` — no missing translations
- [ ] Visual review at 1440px / 768px / 390px
- [ ] Dark mode toggle works globally
- [ ] All 19 routes resolve
- [ ] No script-block changes in diff
- [ ] Console: no new errors/warnings

---

### Session Notes

| Session | Date | Phase | Notes |
|---|---|---|---|
| — | — | — | *(Fill in as you work through phases)* |

### Context Carry-Forward

When context is full, reference this file to continue:
- **Design files location:** `new_design/light/` and `new_design/dark/`
- **This plan:** `NEW_DESIGN_REVAMP_PLAN.md` (root)
- **Existing modernization plan:** `APP_MODERNIZATION_PLAN.md` (superseded by this plan)
- **Key constraint:** No script-block changes — templates and styles only
- **Stack:** Vue 2.7 + Vuetify 2.6.10, plain CSS in SFCs
- **Node:** 16.20.1 (required for webpack 4 compatibility)
- **Tests:** `yarn test --run` (Node 16), vitest + happy-dom
- **Build:** `yarn build` → `dist/`
- **i18n:** vue-i18n v8, default runtime locale `es`, messages in `src/locales/*.json`
- **Dark mode:** New requirement — implement via Vuetify theme + CSS variables

### Red Lines (from existing plan, still apply)
- No changes to: router paths/meta, store modules, API clients, mixins, validation rules, permission/auth-guard logic, i18n key semantics, script-side business logic
- No feature removal
- Every existing key, binding, handler, and workflow survives
- Only templates, styles, theme config, and purely-presentational extraction

### Key Patterns to Follow
- Design tokens via CSS variables (light/dark)
- Vuetify theme override for dark mode
- Shared components for repeated UI patterns (buttons, inputs, empty states, etc.)
- Global CSS confined to named files (`tokens.css`, `shared.css`, `vuetify-overrides.css`)
- Per-component styles in SFC `<style>` blocks (no `scoped`, following existing pattern)
- Touch targets ≥44px on mobile
- Responsive: 1440px (desktop) / 768px (tablet) / 390px (mobile)
