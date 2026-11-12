# SavyCart — agent notes

Vue 2 + Vuetify PWA with Capacitor (Android/iOS). The backend is a separate repo (`itsalb3rt/sheiley-shop-api`); this app only consumes it.

## Install / run

- `yarn` — lockfile is `yarn.lock`. Engines pin `node=16.20.1` (CI uses Node 16.20.1). Do not use npm (`engines` says "Plese use yarn").
- Create `.env` from `.env.bak` (gitignored). Key vars: `VUE_APP_API_DEV`, `VUE_APP_API_PRO`, `VUE_APP_I18N_LOCALE`, `EXPOSED_PORT`. API base is chosen by `NODE_ENV` in `src/api/HttpClient.js:4`.
- `yarn serve` — dev server (port 8080). `yarn build` — production build to `dist/` (gitignored).

## Tests

- `yarn test` — vitest with happy-dom, watches locally. CI (`.github/workflows/unit-tests.yml`) runs `yarn test --reporter verbose` on Node 16.20.1 (vitest exits once in CI).
- Run once / single test: `yarn test --run tests/components/Interface` (or any path/name filter).
- Aliases available in tests: `@`, `src`, `components`, `assets`, `tests` (`vitest.config.js`).
- No lint or typecheck scripts exist — do not run them.

## Mobile (Capacitor)

- `yarn serve:android` / `yarn serve:ios` — run `mobile.js` (rewrites `capacitor.config.json` `server.url` to the local machine IP, port 8081), then open Android Studio / Xcode.
- `yarn build:android` / `yarn build:ios` — build web (`dist`), then `cap copy`/`cap sync` and open the native IDE (`mobileBuild.js` removes `server.url` from config first).
- `src-capacitor/` is generated & gitignored (`/src-capacitor/www` in `.gitignore`).
- Gotcha: `capacitor.config.json` is tracked but mutated by `mobile.js` / `mobileBuild.js` — expect uncommitted changes after mobile commands; `mobile.js` points it at `http://<local-ip>:8081` so the emulator can reach the dev server.

## i18n

- `vue-i18n` v8; messages live in `src/locales/*.json`. Runtime default locale is `es` (`src/i18n.js:20`), not the `en` declared in `vue.config.js`.
- `yarn i18n:report` — reports unused/missing translation keys across `src/**` and locales.

## Notes

- Router is history mode, base `/` (`src/router.js`). Catch-all redirects to `/product/list`; unauthenticated routes redirect to `/login`.
- Vuex state persists to `localStorage` via `vuex-persist` (`src/store/store.js:13`).
- Docker: `EXPOSED_PORT:8080`, `Dockerfile` uses `node:9.11.1-alpine` (stale, not the source of truth for local dev).
- Tests and CI only cover unit tests; there are no integration/e2e scripts or required local services.
