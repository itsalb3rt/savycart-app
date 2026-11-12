# SavyCart — Complete Application UI/UX Modernization Plan

> Status: **PHASE 1 COMPLETE (2026-11-05) — baseline recorded; Phase 2 next.**
>
> ### Phase 1 results
> - **Environment:** Node 16.20.1 installed via nvm; `yarn install --frozen-lockfile --ignore-engines` (pre-existing lockfile conflict: `happy-dom@15.10.2` requires Node ≥18 while `engines` pins `=16.20.1` — CI runs plain `yarn`; tests pass either way); `.env` created from `.env.bak`.
> - **Baseline gates:** `yarn test --run` → **11 files / 46 tests PASSED** · `yarn build` → **DONE, 0 errors**.
> - **Direction sheet dealt:** `draw.mjs --app --kind wallet --style achromatic-ledger` (seed **141460847**) → saved `.taste-skill/direction.json`; reprints via `draw.mjs --show`.
>   - Sheet notes: colour budget <1% coloured pixels · shell = "no sidebar" (46–48px top bar over centred 1088–1208px column — matches `.app-canvas` 1120 plan) · settings = two-column label/panel pattern (§4 of plan) · `list`/`detail`/`analytics` compose from `app-screens.md` defaults.
>   - **Deviations to carry into the report:** (1) sheet dealt **Geist** type; owner locked **Inter** — Inter is the sheet's own declared fallback (`"Geist", Inter, system-ui`), reason: owner decision + offline self-host; (2) sheet chart hue `#1d5fbf` → replaced by brand `#03A9F4`/`#0277BD` per `--keep palette` (owner decision).
> - **Lint baseline:** `lint.mjs --app src` → **1 FAIL** (`[emoji]` 🚀 at `src/views/auth/register.vue:126`), **2 WARN** (`[shadow]` resting shadows on `ShopResume.vue:70`, `ShopResumeMobile.vue:100`).
> - **Inspect before** (`http://localhost:8080/login`, `.taste-skill/before/`): **4 FAIL** — `[button-fx]` shadowed button · `[contrast]` tagline 1.6:1 (`#ffc107` on white) · `[font-not-dealt]` renders Open-Sans/Roboto · `[no-title]` no h1 — **1 WARN** — `[hero-void]` 33% empty first screen. Screenshots at 1440/768/390 captured and reviewed.
> - Dev server left running at `http://localhost:8080` (`/tmp/savycart-serve.log`).
> Owner: opencode (Senior Product Designer / UI-UX Engineer / Senior Frontend Developer)
> Primary skill: `design-taste-frontend` (`references/app-screens.md` — the governing ruleset for every app screen).
> Secondary skill: `high-end-visual-design` (motion physics & performance guardrails only).
> Scope: **app only** — auth screens + all 18 authenticated screens + shell. The landing page (`LANDING_REDESIGN_PLAN.md`) stays a separate, deferred follow-up.

---

## 0. Locked decisions

| Decision | Choice | Why |
|---|---|---|
| **Visual direction** | `achromatic-ledger` × brand blue — no colour in the chrome, near-black primary actions, ink text, neutral grey nav with pill active states; brand blue `#03A9F4` reserved for data, active indicators and one accent | Dealt via `draw.mjs --app` (options: `pastel-consumer`, `achromatic-ledger`, `framed-sheet`, `editorial-greeting`). Closest to the brief: Linear / Stripe / Notion — clean, professional, lightweight, premium. |
| **Typography** | Self-hosted **Inter** woff2 (400/500/600/700, latin + latin-ext, OFL), single UI face, `font-display: swap`; Roboto import dropped | Modern SaaS standard, excellent tabular figures for prices/tables. Offline PWA → must be self-hosted. |
| **Palette** | `--keep palette` mapping: brand `#03A9F4` = data/accent hue; darkened `#0277BD` = blue *text/links* (4.5:1); actions near-black `#1d1f20` | Brand identity preserved (manifest `theme_color` stays `#03A9F4`), colour budget per achromatic-ledger. |
| **Theme** | Light only (existing) | Dark mode not requested; doubles scope. |
| **Stack** | Unchanged: Vue 2.7 + Vuetify 2.6.10, plain CSS in SFCs, no new npm deps | "Keep the stack" rule; webpack 4 / Node 16 constraints. |
| **Landing page** | Out of scope | Modernize what exists; add nothing. |

### Governing rules (design-taste-frontend `app-screens.md`)

Colour on data, not chrome · near-black primary · KPIs are type, not tiles · flat surfaces (border **or** shadow, never both) · rules + alignment tables, no zebra, no header bands · neutral pill nav active state · 12px grey sentence-case headers · right-aligned tabular figures · honest empty/zero/loading/error states · an `h1` on every screen · no gradients, glass, eyebrows, emoji, uppercase-tracked labels, resting shadows, icon-tiled KPIs.

### Conflict resolution

`high-end-visual-design` bans Open Sans/Inter/FontAwesome and wants glass-pill navs, eyebrow tags and double-bezel cards — these **conflict** with design-taste house rules. **design-taste-frontend wins everywhere they collide.** `high-end-visual-design` contributes only: custom cubic-bezier motion, press/hover feedback, transform/opacity-only animation, `prefers-reduced-motion` guards, z-index discipline.

### Red lines (functional preservation)

No changes to: router paths/meta semantics · store modules · API clients · mixins · validation rules · permission/auth-guard logic · i18n key semantics · any script-side business logic. No feature removal. No deduplication of logic (the duplicated filter chains, `getMeasurementName` ×4 etc. stay duplicated — refactoring is risk without visual payoff). Every existing key, binding, handler and workflow survives. Only templates, styles, theme config, and purely-presentational extraction.

---

## 1. Phase 1 — Application audit, environment & baseline

**Audit (done, recorded below in §9).** Environment steps at execution start:

1. `nvm install 16.20.1 && nvm use 16.20.1` — only Node 20/22/24 are installed; `engines` pins `=16.20.1` strictly and webpack 4 breaks on Node ≥17 → then `yarn install`; create `.env` from `.env.bak`.
2. Baseline gates **before any edit** (record results):
   - `yarn test --run` — 13 test files must pass as-is.
   - `yarn build` — 0 errors.
3. Record the *before*:
   - Deal the full direction sheet (Node 24 absolute path, skill scripts never under Node 16):
     ```bash
     /Users/albert/.nvm/versions/node/v24.21.0/bin/node \
       /Users/albert/.claude/skills/design-taste-frontend/scripts/draw.mjs \
       --app --kind wallet --style achromatic-ledger \
       --brief "SavyCart: a grocery shopping list and purchase-tracking PWA/mobile app that replaces paper at the supermarket — product catalog, logging purchases per store with running totals and tax, receipt-style purchase history and settings" \
       --screens list,detail,settings,analytics
     ```
   - `yarn serve` → `inspect.mjs --app http://localhost:8080/login --out .taste-skill/before`; `lint.mjs --app src` for the baseline report.
4. API: `VUE_APP_API_DEV=http://localhost:5018/sheiley-shop-api` — backend likely absent, so authenticated QA uses **seeded `localStorage`** (see §8.4).

---

## 2. Phase 2 — Design system

### 2.1 Tokens — new `src/styles/tokens.css` (single import in `main.js`)

| Group | Values |
|---|---|
| Ground/surface | `--ground:#f9fafb` · `--surface:#ffffff` · `--raised:#f9f9f9` · `--active:#eeeeee` |
| Lines | `--border:#e8e8e8` (card edges) · `--rule:#f2f2f2` (row rules) · `--control:#d1d5db` (input borders) |
| Text | `--text:#111111` · `--muted:#5f6368` · `--faint:#6b6b6b` — all ≥4.5:1 |
| Action | `--primary:#1d1f20` (near-black fill, white label) — the achromatic-ledger move |
| Brand/data hue | `--accent:#03A9F4` (graphics, data marks, indicators) · `--accent-ink:#0277BD` (blue text/links, 4.5:1) |
| Semantic | `--positive:#247b50` + pill `#dcfae5/#04250e` · `--negative:#c4242a` + pill `#ffedea/#831c1e` · warning pill `#fffbeb/#92400e` (border `#fde68a`) |
| Geometry | `--radius-card:8px` `--radius-control:6px` `--radius-chip:4px` · `--gap:16px` `--card-pad:20px` `--pad:24px` · `--control-h:36px` `--row-h:48px` `--nav-row:34px` · `--canvas-max:1120px` · `--resume-bar-h` (fixed-bar clearance; initially current pixel values) |
| Motion | `--ease-out:cubic-bezier(0.32,0.72,0,1)` · `--t-press:140ms` `--t-hover:180ms`; global `@media (prefers-reduced-motion:reduce)` disables transforms/transitions |
| Type | Inter; scale **12/14/16/18/24**; `.num{font-variant-numeric:tabular-nums}` |

### 2.2 Vuetify theme — `src/plugins/vuetify.js`

- `primary:#1d1f20`, `secondary:#5f6368`, `accent/info:#0277BD`, retinted `error/success/warning` to the tokens above; keep `options.customProperties:true` (emits `--v-*`).
- Global `defaults` (**verify Vuetify 2.6 supports it at execution**; fallback = override CSS in §2.3): `VBtn{rounded:6,height:36}`, `VTextField/VSelect/VCombobox/VTextarea{outlined,dense}`, `VCard{flat,rounded:8}`, `VDialog{rounded:8}`. Component-level props always win — verify every form after applying.
- `public/manifest.json` `theme_color` **stays `#03A9F4`** (brand identity, not chrome).

### 2.3 Overrides — new `src/styles/vuetify-overrides.css`

- **Buttons:** height 36, radius 6, weight 500, no letter-spacing, flat (no resting elevation), hover = tone step, press `scale(.98)` 140ms.
- **Inputs:** outlined, dense, 1px `--control` border, visible `:focus-visible` ring. *Documented deviation:* Vuetify's floating field labels are kept (native a11y behavior) instead of forcing static labels above — one-sentence defense per skill protocol.
- **VCard:** flat, 1px `--border`, radius 8, **no resting shadow**.
- **Floats** (dialog, menu, snackbar, tooltip): radius 8–12, shadow allowed.
- **VDataTable:** 12px grey sentence-case headers, no fill band, no zebra, row rules `--rule`, numeric columns right-aligned via `.num`.
- **VTabs:** 2px ink indicator, active label ink.
- **VSkeletonLoader:** flat `#eee` bones — no shimmer gradient (skill house rule).
- **VListItem active:** neutral grey pill (`--active` fill, ink label).
- **VSnackbar:** restyle (radius 8, icon per colour, token colours).

### 2.4 Typography

- Download **Inter woff2** (400/500/600/700, latin + latin-ext, OFL, official source) → `src/assets/fonts/inter/`; `@font-face` with `font-weight:400 700` + `font-display:swap`; set app font-family `Inter, system-ui, sans-serif`.
- **Remove** `roboto-fontface` import (`src/main.js:11`) and the broken Open Sans `@font-face` + `#app` rule (`src/App.vue:124-131`). Open Sans files remain on disk untouched.
- Fallback if download unavailable: `system-ui` stack — never blocks the build.

### 2.5 Shared foundation fixes (before any per-screen work)

- **Relocate cross-file class contracts** into new `src/styles/shared.css`:
  - `.right { float:right }` — defined in `src/views/products/list.vue:354`, consumed by `src/components/Products/ListProduct.vue:52`.
  - `.quantity-indicator` — defined in `src/views/analysis/purchaseDetails.vue:166`, consumed by `src/components/Products/PurchasedProduct.vue:5` (also in `products/view.vue` dialog).
- **Fix the 4 undefined CSS variables** (`var(--grey)` `var(--light-grey)` `var(--white)` `var(--primary-blue)`) → token aliases or replace usages (`shoppingCar.vue:226`, `shoppingHistory.vue:117`, `purchaseDetails.vue:164-171`, `components/shop/ShoppingCar.vue:33-40`).
- **Delete dead CSS only** (JS dead code stays — red line):
  `registrationShopping.vue:315-322` · `shoppingCar.vue:228-230` · `purchaseDetails.vue:158-165,170-183` · `profile.vue:4` `.edit-form` · `register.vue:157` `.resgiter_container` typo media query · duplicated `horizontal-line-text-*` blocks ×4 (replaced by AuthShell).
- **Canvas restructure:**
  - Remove `.constrain` (`max-width:900px`) from `<v-app>` (`src/App.vue:2`); page content gets `.app-canvas{max-width:var(--canvas-max);margin:auto}` — drawer/app-bar span full width, fixing today's chrome/content misalignment and giving desktop real breathing room.
  - Replace `.main-app-container{padding-top:40px}` (`App.vue:136-140`) by making the header a real `v-app-bar app` (Vuetify offsets `v-main` itself). ⚠ Risk item — re-verify drawer overlay, FAB, fixed bars immediately (§7).
- **Centralize fixed-bar clearance** on `--resume-bar-h` across `src/components/shop/ShopResume.vue` (breakpoint 900), `ShopResumeMobile.vue` (950), `shoppingCar.vue:234` (150px), `registrationShopping.vue:317,324` (115/130px) — same values initially, one place to tune.

### 2.6 New shared components (presentation-only; props/emits identical)

| Component | Replaces |
|---|---|
| `src/components/Interface/EmptyState.vue` — icon + title + optional CTA | **5 coexisting empty-state patterns** (`v-alert` in categories/units, `p.headline` in list/registration, `h1 + margin:40%` in shoppingCar/history, `display-1` in view/offline, centred `v-icon` in view) |
| `src/components/Interface/PageHeader.vue` — real `h1` (24/600 ink) + optional 14px grey subline + actions slot | Screens with no `h1` at all (title lives only in the toolbar; skill fails a screen without an `h1`). Toolbar keeps showing `$route.meta.title` — no router change. |
| `src/components/auth/AuthShell.vue` — shared brand block | 4× copy-pasted `horizontal-line-text-*` CSS + 4× inline `#fafafa` + 4× hard-coded "SavyCart / shopping registration application" tagline (**move tagline to `en.json` + `es.json`** — currently untranslated) |
| Restyle `src/components/Interface/Dialogs/Delete.vue` | Shared confirm dialog (4 screens) — keep props/emits identical; `.delete`/`.cancel` finally styled |
| Restyle `src/components/Offline/OfflineInformation.vue` | Offline block (edit + profile) |

---

## 3. Phase 3 — Application shell

**`src/components/TheMenu.vue`** — keep all data arrays, routes, `isSubDir` logic, `goBack`, v-hammer swipe **byte-identical**:

- `v-toolbar` → `v-app-bar app flat` (height 48–56, `--surface`, 1px bottom rule).
  ⚠ `tests/components/TheMenu.test.js:54` expects `.v-toolbar__title` — `v-app-bar` builds on `v-toolbar` so the class persists; **verify by running tests right after**.
- Title: 16/600 ink (was `primary--text` blue). Hamburger / back-chevron logic untouched.
- **Drawer:** product mark + "SavyCart" at top (skill house rule: the product must be named from the screenshot) · nav items 14px labels + 16px icons with **neutral grey pill active state** · settings group preserved (same 3 destinations) · **user row at the bottom** (avatar + name → `/user/profile`) · logout in `--negative`.
  - Fix the root cause of the `!important` hack: remove the nonsense `:class="$t('nav.…')"` on `v-list-item-content` (`TheMenu.vue:30` — translated label used as class name), then delete the override at `TheMenu.vue:131-136` and style active state properly.
  - Remove inline styles (`TheMenu.vue:11,16,40`) in favour of Vuetify density classes.
- **`src/App.vue`:** route transitions kept (restyle ease/duration, disabled under reduced-motion) · snackbar kept (CSS-restyled) · offline listener untouched · NProgress restyled to tokens · safe-area insets kept.

---

## 4. Phase 4 — Module modernization (execution order)

Per screen: tokens + `PageHeader` h1 + **unified action language** (ink fill = primary CTA · `--negative` text/outlined = destructive · text button = cancel — normalizing today's incoherent `success` vs `primary` saves and 4 cancel patterns) + shared empty/loading/error states + inline/dead styles removed + **zero script changes**.

1. **Auth ×4** (`login`, `register`, `recoveryAccount`, `recoveryAccountNewPassword`) — AuthShell, outlined forms, keep every rule/validator/submit path; verify validation messages still fire.
2. **Products list** + `ListProduct` + `Filter` bottom-sheet + Delete dialog — search field, All/Favorites tabs with counts, skeleton loader, FAB.
   ⚠ **Virtual-scroll contract:** keep `item-height="170"` and the `screen.height` math (`list.vue:235-238`) unless row pitch changes — if it does, update `item-height` + height math **in the same step** and test scrolling. Badge `color="red"` → `error`.
3. **Product add / edit** (visual parity; divergent logic untouched) + **view detail** (8 hand-rolled label/value pairs → structured definition grid; purchase-history dialog restyled, spinner/empty states kept; `color="black"` icon buttons → themed).
4. **Logger purchase** (`registrationShopping`) + `PurchaseProduct` + `ShopResume`/`ShopResumeMobile` — keep the `v-if="viewPort"` desktop/mobile switch, tax math, cart handlers exactly as-is; unify the two resume bars onto one breakpoint + `--resume-bar-h`; `v-layout/v-flex` in `PurchaseProduct` → `v-row/v-col`.
5. **Shopping car** — qty steppers (store mutations untouched), 3-branch `saveShop` validation untouched; `EmptyState`; clearance via `--resume-bar-h`.
6. **Shopping history** (the app's only `v-data-table`) — restyle per §2.3; **no column/filter/sort removal**. **Purchase details** — totals grid, `.quantity-indicator` now from `shared.css`, delete flow.
7. **Categories + measurement units** — inline rows → clean hover rows with actions, CRUD dialogs restyled; fix only the wrong snackbar *colour* at `categories.vue:145` (visual, not logic).
8. **Settings + profile + About** — settings as label-column/panel rows (§8.2 of app-screens), stacking label→panel on mobile; `About.vue` `v-layout/v-flex` → `v-row/v-col`.
9. **Offline + logout** screens — restyle only.

**Cross-cutting cleanups (visual only):** `text-xs-right` → `text-right` (8×) · `subheading` → `text-subtitle-1` (10×) · `color="indigo"` avatar → themed · `tyle=` typo (`Filter.vue:14`) · hard-coded `#fafafa`/`rgba(128,128,128,.16)` → tokens · inline `margin-top:18px` badge hacks → spacing classes.

**Deliberately NOT done:** deduplicating the ~60-line filter/sort chains, `getMeasurementName` ×4, `requestCategories` ×5; removing any dead JS (`handleClearFilters`, `headers`, unused `MenuComponent`/`Loading` registrations) — logic removal is out of scope even when grep-confirmed dead.

---

## 5. Phase 5 — Responsive refinement

- Gutters: 16px mobile / 24–32px desktop, one gutter value per width.
- App-bar title truncates; drawer unchanged (already `temporary`).
- Tabs scroll inside their own row; filter controls collapse to one row + the existing bottom-sheet.
- `v-data-table` scrolls **inside its own frame** on small screens (page never scrolls sideways).
- Dialogs: `max-width` + `scrollable`; fullscreen on `xs` where content is long.
- Fixed bars + FAB re-verified at 390px against `--resume-bar-h` (safe-area insets kept).
- Virtual-scroll heights visually re-checked at 390 / 736 / 900 (existing magic numbers kept).
- Forms stay single-column; touch targets ≥44px on primary actions; settings label column stacks above its panel.

---

## 6. Interactions & accessibility (built into every phase)

- `:focus-visible` global ring (2px, `--accent-ink`); hover tone-steps on rows/buttons/cards; press `scale(.98)` 140ms; transitions 140–180ms on `--ease-out`; all disabled under `prefers-reduced-motion:reduce`.
- `aria-label` on every icon-only button (filter, close, nav-icon, back) — template attributes only.
- Contrast: all text tiers ≥4.5:1 (blue text uses `#0277BD`); semantic pill pairs as defined.
- Semantic HTML: one `h1` per screen via `PageHeader`, real `<button>`/`<a>` everywhere (Vuetify already supplies these), keyboard nav/dialog focus left to Vuetify (preserved).

---

## 7. Risk register

| Risk | Mitigation |
|---|---|
| `v-app-bar app` changes layout math (drawer, FAB, fixed bars, `padding-top:40px`) | Do in Phase 3 with an immediate visual check of all three; fallback = keep non-`app` toolbar, restyle only |
| Vuetify 2.6 `defaults` option support | Verify against installed 2.6 source at execution; fallback = pure CSS overrides (already planned in §2.3) |
| Virtual-scroll `item-height` / `screen.height` contract | Freeze row pitch initially; any pitch change updates `item-height` + height math together + scroll test |
| Cross-file class contracts (`.right`, `.quantity-indicator`) | Relocated to `shared.css` **before** any per-screen styling |
| Fixed-bar clearance spread across 4 files | Centralized on `--resume-bar-h` with unchanged initial values |
| Inter download needs network | Official OFL source; `system-ui` fallback never blocks the build |
| Node 16 missing (only 20/22/24 present) | `nvm install 16.20.1` first; skill scripts always via `/Users/albert/.nvm/versions/node/v24.21.0/bin/node` |
| Tests asserting Vuetify internals (`.v-toolbar__title`) | Run `yarn test --run` immediately after the shell change; keep selectors over editing tests |
| Zero `scoped` style blocks today | No scoping migration in this pass — global styles stay, but namespaced via `tokens/shared/overrides` files |
| vuex-persist rehydrates `snackbar.show` | Pre-existing quirk — do not touch |

---

## 8. QA & regression (Phase 6 — definition of done)

1. **After every phase:** `yarn test --run` (Node 16) + `yarn build`. All 13 test files pass; prefer keeping markup selectors over editing tests.
2. `yarn i18n:report` — any new string added to **both** `en.json` and `es.json`; prefer reusing existing keys.
3. `lint.mjs --app src` → 0 banned patterns.
4. `inspect.mjs --app` at **1440 / 768 / 390** → 0 FAIL; every WARN defended in one sentence or fixed. For authed screens drive Chrome via browser MCP:
   - seed `localStorage` (`token`, `user`, vuex-persist state with realistic products/purchases) so lists/tables render real-shaped data;
   - where the API is absent, verify **error states** match baseline behaviour.
   - Open **every** screenshot after the last change; ≤3 critique rounds (skill limit).
5. **Browser walkthrough of all 19 routes:** login/register/recovery validation messages · drawer nav + active pill + back button · product CRUD dialogs open/close · filter sheet · tabs · cart qty steppers · save flows (network errors must be **identical** to baseline — proof of no functional drift) · snackbars · offline branch · role/permission behaviour.
6. Console: no new errors/warnings; fonts load offline (PWA); no 404 assets.
7. `git diff` review: **no script-block changes at all** (templates/styles/theme only).
8. Before/after screenshot comparison at all three widths (`.taste-skill/before` vs `/after`).

---

## 9. Phase 1 audit — findings this plan is built on

### 9.1 Stack

Vue 2.7.13 Options API · Vuetify 2.6.10 (`src/plugins/vuetify.js`, `primary:#03A9F4`) · vue-router 3 history mode (19 routes) · Vuex + vuex-persist → localStorage · vue-i18n 8 (default runtime locale `es`) · **plain CSS in SFCs, 0 `scoped` blocks, no SCSS in source** · FontAwesome 5 CSS + a stray SVG component (2 users) · Vue CLI 3/webpack 4 · Vitest + happy-dom (13 tests) · Capacitor 5 PWA.

### 9.2 Module inventory

**Views (18 routed):** auth ×5 (login, register, recovery, recovery-password, logout) · products ×4 (list 357L, add 218L, edit 223L, view 245L) · shop ×2 (registrationShopping 327L, shoppingCar 239L) · analysis ×2 (shoppingHistory 118L — only `v-data-table`, purchaseDetails 183L) · miscellany ×3 (categories 219L, measurement_units 226L, settings 178L) · user/profile 137L · About 16L (Vuetify-1 stub).

**Components (11):** `TheMenu` (drawer + toolbar) · Products ×4 (ListProduct, PurchaseProduct, PurchasedProduct, Filter) · shop ×3 (ShopResume, ShopResumeMobile, ShoppingCar = dead code) · `Dialogs/Delete` (shared) · `OfflineInformation`.

**Shell:** `App.vue` (all global CSS, transitions, snackbar, offline) · `router.js` (`meta.title/isSubDir/transitionName`, auth guard) · `main.js`.

### 9.3 Worst inconsistencies (drivers of §2–§4)

1. All 14 style blocks global; cross-file class contracts `.right` + `.quantity-indicator`.
2. `horizontal-line-text-*` block copy-pasted **4×**; hard-coded "SavyCart" tagline 4× (untranslated); inline `#fafafa` 4×.
3. Undefined CSS vars (`--grey`, `--light-grey`, `--white`, `--primary-blue`) → silently missing colours.
4. **5 different empty-state patterns**; 2 loading systems (`vue-loading-overlay` in 9 files vs `v-skeleton-loader` vs `v-progress-circular`).
5. Save actions split `success` vs `primary`; 4 different cancel/close patterns; raw `color="red"/"black"/"indigo"/"white"` literals.
6. `.constrain` (900px) applied to `<v-app>` → chrome and content use different alignment; manual `padding-top:40px` compensates for the non-`app` toolbar.
7. Fixed-bar clearance magic numbers spread over 4 files (115/130/150px); duplicated resume bars with divergent breakpoints (900 vs 950).
8. Vuetify-1 leftovers: `subheading` ×10, `text-xs-*` ×8, `v-layout/v-flex` in About + PurchaseProduct.
9. TheMenu active-state `!important` hack caused by the `:class="$t(...)"` bug (`TheMenu.vue:30`).
10. No `h1` on any screen (title lives only in the toolbar).

### 9.4 Risk areas identified (see §7)

`screen.height`-derived virtual-scroll sizing (`list.vue:235-238`, `registrationShopping.vue:245-248`) · fixed-bar spacing contract across 4 files · `v-if="viewPort"` desktop/mobile branch with side effects · `isSubDir` meta → header chrome · `hasFilters()` feeding badge + button colour · 36 snackbar call sites with raw colour strings · tests asserting `.v-toolbar__title` · auth pages render outside `MenuComponent` (own shell needed) · offline branch swaps whole forms (`edit.vue`, `profile.vue`).

---

## 10. File change map

**New (~6 + fonts):**

```
src/styles/tokens.css               — design tokens (colour, type, space, radius, motion)
src/styles/vuetify-overrides.css    — component-default overrides
src/styles/shared.css               — relocated cross-file classes (.right, .quantity-indicator)
src/components/Interface/EmptyState.vue
src/components/Interface/PageHeader.vue
src/components/auth/AuthShell.vue
src/assets/fonts/inter/*            — self-hosted Inter woff2 (400/500/600/700)
```

**Modified (~35):** `src/plugins/vuetify.js` · `src/main.js` · `src/App.vue` · `src/components/TheMenu.vue` · all 18 views · 11 components · `src/locales/en.json` + `es.json` (tagline + any new UI copy) · `public/index.html` (font preload, optional) · `src/styles/*` imported once.

**Untouched:** `src/router.js` · `src/store/**` · `src/api/**` · `src/mixins/**` · `src/i18n.js` · `tests/**` · `vue.config.js` · `manifest.json` theme colour · Capacitor/mobile scripts.

---

## 11. Success criteria

1. Every existing module visually modernized — no screen skipped (auth, list, forms, detail, logger, cart, history, details, categories, units, settings, profile, about, offline).
2. One unified design system (tokens + overrides + shared components) — no divergent implementations of the same component.
3. Navigation and workflows unchanged; all 19 routes resolve; `isSubDir` back/hamburger behaviour intact.
4. No feature, permission, validation, API or business rule removed or altered (verified by §8.7 diff review + §8.5 walkthrough).
5. Forms, tables, dashboards, dialogs share one consistent modern appearance with honest empty/loading/error states.
6. Desktop (1120 canvas) and mobile (390) both polished; no horizontal page scroll.
7. `yarn test --run` + `yarn build` green on Node 16.20.1; `lint.mjs` 0 fails; `inspect.mjs` 0 FAIL at 1440/768/390 on measurable routes.
8. Maintainable: all colour/space/type references go through tokens; global CSS confined to three named files + per-component blocks.
