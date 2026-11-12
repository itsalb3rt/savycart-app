# Phase 2 execution plan — SavyCart design system

Context: `APP_MODERNIZATION_PLAN.md` is the approved master plan. Phase 1 done (baseline, direction sheet `achromatic-ledger × brand blue`, seed 141460847). Phase 2 started: `src/styles/tokens.css` + Inter woff2 fonts already on disk (uncommitted). All Vuetify 2.6 research done. This plan lists the remaining Phase 2 edits in order.

## Decisions locked (empirically verified this session)

- **Inputs = outlined + dense via prop-default patch** (plan §2.2 fallback; Vuetify 2.6 has no `defaults` API).
  In `src/plugins/vuetify.js` right after `Vue.use(Vuetify)`:
  for each of `VTextField, VSelect, VCombobox, VTextarea, VAutocomplete, VFileInput` set
  `Vue.options.components[name].options.props.outlined.default = true` and `...dense.default = true`
  (guarded: skip if component/prop missing). Verified in Node: defaults flip false→true; explicit
  `outlined="false"` still wins; full-build `vuetify` (what the app imports) registers all of them
  globally; no test touches any input component. Component-level props always win — spot-check forms after.
- **Typography = Inter** (sheet dealt Geist; deviation documented in master plan). Add
  `"allow": ["font-not-dealt"]` to `.taste-skill/direction.json` before the inspect gate.
- **Floating labels kept** (documented deviation vs app-screens §8.1) — no static-label CSS.

## Step 1 — create `src/styles/vuetify-overrides.css`

Imported in `main.js` after `plugins/vuetify` (so after `vuetify/dist/vuetify.css`). Use `html`-prefixed selectors to beat Vuetify specificity; `!important` only where Vuetify used it (typography). Contents:

1. **Font defeat (77 `Roboto !important` occurrences):**
   `html .v-application { font-family: var(--font); line-height: 1.5; }` and
   `html .theme--light.v-application { background: var(--ground); color: var(--text); }`
   plus one grouped rule for all 25 typography classes
   (`.display-1..4, .headline, .title, .subtitle-1/2, .body-1/2, .caption, .overline,
   .text-h1..h6, .text-body-1/2, .text-button, .text-caption, .text-subtitle-1/2, .text-overline`)
   → `font-family: var(--font) !important`.
2. **Buttons:** `html .v-btn` → sentence case (`text-transform: none; letter-spacing: normal; text-indent: 0`), `font-weight: 500`, `border-radius: var(--radius-control)` (Vuetify `.v-btn` = 4px uppercase `.089em`); kill resting elevation
   `html .v-btn--is-elevated, html .v-btn--is-elevated:after, html .v-btn--is-elevated:active { box-shadow: none }`
   (FAB variants too); keep Vuetify hover `::before` wash (tone-step, legal); press feedback:
   `html .v-btn:not(.v-btn--disabled):active { transform: scale(.98) }` with
   `transition: transform var(--t-press) var(--ease-out)`; global
   `html :focus-visible { outline: 2px solid var(--accent-ink); outline-offset: 2px }` (skip inputs — they get the fieldset ring from focus state).
   `box-shadow: none` lines carry `/* taste-skill-ignore shadow */` (lint regex matches `box-shadow:` … actually `none` is allowed by the rule — verify, only add comment if lint flags it).
3. **Inputs (outlined+dense now render via patch):** fieldset border color → `var(--control)`:
   `html .v-text-field--outlined:not(.v-input--is-focused) … fieldset { border-color: var(--control) }`
   (override Vuetify lines 18986+), focused/error fieldset keep `currentColor` (theme `primary` is now ink → focus ring reads as ink); label colors → `var(--muted)`, focused label → `var(--text)`; `html .v-text-field--outlined { border-radius: var(--radius-control) }` (Vuetify 4px).
4. **Cards:** `html .v-sheet.v-card, html .v-card { border: 1px solid var(--border); border-radius: var(--radius-card); box-shadow: none }` and `html .theme--light.v-sheet { background: var(--surface); border-color: var(--border); color: var(--text) }` (Vuetify: radius 0, white border, elevation shadows). Re-enable float shadows only on: `html .v-dialog { border-radius: var(--radius-card); box-shadow: var(--shadow-float) }`, `html .v-menu__content { border-radius: var(--radius-card); box-shadow: var(--shadow-float) }`, `html .v-snack__wrapper { border-radius: var(--radius-card); box-shadow: var(--shadow-snack) }`, `html .v-tooltip__content { background: var(--text); border-radius: var(--radius-control) }`.
5. **VDataTable** (only `shoppingHistory.vue`): header th → `font-size: 12px; font-weight: 500; color: var(--muted); text-transform: none` (override `rgba(0,0,0,.6)` at 23864); row borders → `var(--rule)`; `tr.active`/hover band → `var(--raised)`; keep `.num` right-align from tokens.css (add `text-align: right` there if missing — check: tokens only set tabular-nums; add `html .v-data-table td.num, html .v-data-table th.num { text-align: right }` here).
6. **VTabs** (`list.vue`, `registrationShopping.vue`): `html .v-tab { text-transform: none; letter-spacing: normal; min-width: 0; color: var(--muted) }`, active → `color: var(--text)`, slider → `background: var(--text); height: 2px` (Vuetify `.v-tabs-slider` is `currentColor` full-height inside bar).
7. **VSkeletonLoader:** `html .theme--light.v-skeleton-loader .v-skeleton-loader__bone::after { display: none }` (kills shimmer gradient, line 27360); bones background → `var(--active)`.
8. **VListItem active:** `html .theme--light.v-list-item--active::before { background: var(--active); opacity: 1 }` + `html .v-list .v-list-item--active { color: var(--text); font-weight: 500 }` (Vuetify: 0.12 currentColor wash → neutral grey pill + ink label per §2.3).
9. **VSnackbar:** covered by wrapper rule above; token colors come from theme.
10. **Motion guard:** `@media (prefers-reduced-motion: reduce) { html * { animation-duration: .01ms !important; transition-duration: .01ms !important } }` (plan §2.1) — actually tokens.css already planned to hold this; put it in overrides (after Vuetify transitions) rather than tokens if not yet present.

## Step 2 — create `src/styles/shared.css`

Cross-file contracts relocated out of views (§2.5):

- `.right { float: right !important; }` (was `list.vue:354-356`, consumer `ListProduct.vue:52`), then delete the block from `list.vue`.
- `.quantity-indicator { color: var(--muted); font-variant-numeric: tabular-nums; font-weight: 500; }` (was `purchaseDetails.vue:166-169` with undefined `--grey` + bold → token weight 500), delete from `purchaseDetails.vue`, consumer `PurchasedProduct.vue:5` unchanged.

## Step 3 — edit `src/plugins/vuetify.js`

- Theme → `primary: '#1d1f20'`, `secondary: '#5f6368'`, `accent/info: '#0277BD'`, `error: '#c4242a'`, `success: '#247b50'`, `warning: '#92400e'`; keep `options.customProperties: true`, `iconfont: 'fa'`.
- After `Vue.use(Vuetify)`: the input prop-default patch (Decision above).

## Step 4 — edit `src/main.js`

- Remove line 11 `import 'roboto-fontface/...'`.
- After `import vuetify from './plugins/vuetify'` (line 3) add: `import './styles/tokens.css'; import './styles/vuetify-overrides.css'; import './styles/shared.css';` — order matters: tokens first, then overrides (after vuetify.css which loads via line 3's import chain), shared last.

## Step 5 — edit `src/App.vue`

- Delete broken `@font-face Open-Sans` + `#app { font-family: Open-Sans }` (lines 124-131). Open Sans files stay on disk.
- Leave `.constrain` / `padding-top: 40px` alone for now (canvas restructure is post-gate, §2.5).

## Step 6 — foundation fixes (§2.5, template/style only)

- Undefined vars → tokens: `var(--grey)` → `var(--muted)` (`shoppingHistory.vue:117`, `shoppingCar.vue:226`, `purchaseDetails.vue:167`); `var(--light-grey)` → `var(--border)` (`purchaseDetails.vue:164,171`); `--white`/`--primary-blue` in `components/shop/ShoppingCar.vue:33-40` → `var(--surface)`/`var(--accent-ink)` (verify contrast: white text on `#0277BD` = 4.6:1 OK).
- Delete dead CSS only (master plan §2.5 list): `registrationShopping.vue:315-322`, `shoppingCar.vue:228-230`, `purchaseDetails.vue:158-165,170-183`, `profile.vue:4` `.edit-form`, `register.vue:157` `.resgiter_container` media query. (Skip the `horizontal-line-text-*` ×4 deletion until AuthShell lands — step 8.)
- `.taste-skill/direction.json`: add `"allow": ["font-not-dealt"]`.

## Step 7 — first gate

```bash
source ~/.nvm/nvm.sh && nvm use 16.20.1
yarn test --run          # expect 11 files / 46 PASS
yarn build               # expect 0 errors
node /Users/albert/.claude/skills/design-taste-frontend/scripts/lint.mjs --app src
# expect: 0 FAIL (emoji baseline fix: strip 🚀 from register.vue:126 console.log — it's a log message, not logic), ≤2 pre-existing shadow WARNs
node /Users/albert/.claude/skills/design-taste-frontend/scripts/inspect.mjs --app http://localhost:8080/login --out .taste-skill/phase2
# expect: button-fx FAIL gone, font-not-dealt allowed, contrast/hero-void/no-title still open until Phase 4/3
```

Visually verify on dev server (localhost:8080): login form renders outlined+dense, buttons sentence-case flat, cards bordered radius-8, drawer/FAB unchanged.

## Step 8 — §2.6 shared components (same phase, after gate)

- `Interface/EmptyState.vue`, `Interface/PageHeader.vue` (real h1 24/600), `auth/AuthShell.vue` (+ tagline keys in `en.json`/`es.json`), restyle `Interface/Dialogs/Delete.vue` + `Offline/OfflineInformation.vue` — props/emits identical, zero script changes. Then delete `horizontal-line-text-*` ×4.
- Adopt on screens as Phase 4 reaches them (components ship first).

## Step 9 — canvas restructure (⚠ last, re-gate immediately after)

- Drop `.constrain` from `<v-app>`; add `.app-canvas{max-width:var(--canvas-max);margin:auto}` to `v-container`.
- `TheMenu.vue` `v-toolbar flat` → `v-app-bar app flat` (test asserts `.v-toolbar__title` — class persists on app-bar; run `yarn test tests/components/TheMenu` right after).
- Replace `.main-app-container{padding-top:40px}` with Vuetify's native v-main offset; centralize `--resume-bar-h` (ShopResume 900/950, shoppingCar 150px, registrationShopping 115/130px).
- Re-verify drawer overlay, FAB, fixed bars + rerun full gate.

## Out of scope / untouched

Router, store, api, mixins, validation, permissions, i18n logic, tests, script-side business logic; `manifest.json` theme_color stays `#03A9F4`; Open Sans files stay on disk; `src-capacitor/`, `capacitor.config.json`.
