# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## What this is

MyMerchantPay is the merchant portal SPA (React 18 + Vite 5, react-router 6, Recharts, Sass) for the MyPay payment platform. It consumes the REST API of the sibling Symfony project `../myPay` — see `../CLAUDE.md` for how the two connect (auth, CORS, endpoint list). UI text is French-first.

`README.md` is partly outdated: it says all data is mocked and to `cd web` — the app lives at this folder's root (`web/` is a leftover), and login, registration, profile and countries now hit the real API.

## Commands

```bash
npm install
npm run dev        # Vite dev server on :5173
npm run build      # production bundle into dist/
npm run preview

# or via Docker (no local Node needed)
docker compose up -d --build web                        # dev with hot reload on :5173
docker compose --profile prod up -d --build web-prod    # nginx on :8080 (clashes with myPay's adminer)
```

There is no test runner, linter, or TypeScript — verify changes by running the app against a running myPay backend.

Config: `VITE_API_BASE_URL` (copy `.env.example` to `.env`; defaults to `http://localhost:8000`).

## Architecture

**All HTTP goes through `src/api/client.js`.** `request()` adds JSON/Bearer headers, leaves `FormData` bodies alone (multipart uploads), and throws `ApiError(message, status, data)` on non-2xx or network failure (message from `data.message` / `data.error`). Add one exported function per endpoint with a comment giving the response shape — follow the existing ones. Don't call `fetch` directly from pages.

**Auth lives in `src/context/AuthContext.jsx`.** `login()` does `POST /api/login` → decodes the JWT for `username`/`roles` (`src/api/jwt.js`, no signature check — display only) → `GET /api/merchant/me` for the merchant profile. Token and user are kept in `sessionStorage` (`mmp_token`, `mmp_user`) and dropped on load if expired. Consume with `const { token, user, merchant, isAuthenticated } = useAuth()`, and pass `token` to client functions. `ProtectedRoute` guards everything under `/dashboard`.

**Routing** is in `src/App.jsx`: public `/`, `/login`, `/register`; authenticated pages are nested under `/dashboard` inside `DashboardLayout` (topbar + sidebar). Sidebar entries come from `SIDEBAR_ITEMS` in `src/data/mockData.js`; screens without designs use `PlaceholderPage`.

**Mock vs real data.** `src/data/mockData.js` still feeds Dashboard (charts, transactions, pending payments), ApiIntegration, Recharge, and RechargeHistory. myPay already exposes `/api/merchant/dashboard/summary`, `/transactions`, `/frauds`, `/compliance-documents` that aren't wired yet. When wiring a page, replace its mock import with a client function and handle loading/error states (see `src/hooks/useCountries.js`, which also caches module-level for data that rarely changes).

**Registration** (`src/pages/Register.jsx`) is a 4-step KYC form posted as multipart to `POST /api/merchant/register`: a `data` field holding JSON `{ company, representative, account, acceptedTerms }` plus one `documents[<type>]` file per entry in its `DOCUMENTS` list. Document types must match myPay's `KycDocumentType` enum.

**i18n** is a small in-house system (`src/i18n/I18nContext.jsx`), not a library: `const { t } = useTranslation()`, `t('dotted.key', { name })`. Locales in `src/i18n/locales/{fr,en}.js`; The starting locale is the saved `localStorage` choice, then the browser language, then French. Missing keys fall back to French, then to the key itself. To add a language, register it in `LOCALES`. Add every new key to both files. Only login/registration are translated so far — other pages have hard-coded French.

**Styling** is SCSS, BEM-style. `src/main.scss` is the only stylesheet imported (from `main.jsx`) and `@use`s every partial in `src/styles/`. Use tokens from `_variables.scss` and helpers from `_mixins.scss` (`flex()`, `card`, `button-variant()`, `field-input`, `badge-tone()`); new UI areas get a new `_partial.scss` registered in `main.scss`. Flags use `flag-icons` via `components/Flag.jsx`; icons via `components/Icon.jsx`.
