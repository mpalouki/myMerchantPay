# MyMerchantPay — Web

A React (Vite) recreation of the MyMerchantPay merchant portal screens: login, multi-country dashboard, account profile, account settings, API key integration, and the account-recharge flow (form + history table). All data is mocked client-side — there is no backend yet.

## Getting started

Node.js isn't installed on this machine, so the app is run inside Docker instead.

### Option A — Docker Compose (recommended, no local Node needed)

```bash
cd web
docker compose up -d --build web   # dev server with hot reload
```

Open **http://localhost:5173**. Source files are bind-mounted, so edits on the host hot-reload in the browser. `node_modules` lives in an anonymous volume inside the container, so it never gets clobbered by the host filesystem.

Other useful commands:

```bash
docker compose logs -f web          # tail dev server logs
docker compose down                 # stop and remove the dev container
docker compose --profile prod up -d --build web-prod   # production build, served by nginx on :8080
```

### Option B — Native Node.js

Once Node.js 18+ / npm is available on the host:

```bash
cd web
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`). Any email/password combination logs you in (mock auth, stored in `sessionStorage`).

## Project structure

```
src/
  components/   Sidebar, Topbar, Tabs, Icon, ProtectedRoute, PlaceholderPage
  context/      AuthContext (mock login/logout)
  data/         mockData.js — balances, API keys, recharge history, nav config
  layouts/      DashboardLayout (topbar + sidebar shell)
  pages/        Login, Dashboard, Profile, Settings, ApiIntegration, Recharge, RechargeHistory
  styles/       SCSS partials (variables, mixins, one file per UI area)
  main.scss     Entry stylesheet — @use's every partial in cascade order
```

### Translations (i18n)

Labels live in `src/i18n/locales/<lang>.js` (currently `fr` — default — and `en`), as nested objects addressed by dotted keys. Components call `const { t } = useTranslation()` then `t('register.company.name')`; `{{name}}` placeholders are filled from a second argument. Missing keys fall back to French, then to the key itself. The chosen language is saved in `localStorage` and a `<LanguageSwitcher />` sits on the login and registration pages. To add a language, create `locales/<code>.js` with the same keys and register it in `LOCALES` in `src/i18n/I18nContext.jsx`. Only the login and registration pages are translated so far.

### Styling (Sass)

Styles are written in SCSS and compiled by Vite's built-in Sass integration (the `sass` devDependency — no extra config beyond `vite.config.js`'s `css.preprocessorOptions.scss`). Structure:

- `styles/_variables.scss` — colors, radius, shadow, layout sizes as `$variables`
- `styles/_mixins.scss` — `flex()`, `card`, `button-variant()`, `field-input`, `badge-tone()`
- one partial per UI area (`_buttons`, `_badges`, `_login`, `_layout`, `_sidebar`, `_cards`, `_dashboard`, `_tables`, `_forms`, `_api`, `_stepper`), each using BEM-style nesting (`&__element`, `&--modifier`)
- `main.scss` — the only file imported from `main.jsx`; pulls every partial in with `@use`

Edit any `.scss` file and the dev server hot-reloads the compiled CSS automatically.

## Screens implemented

- **Login** — gradient background, "Content de vous revoir !" card.
- **Inscription marchand (`/register`)** — 4-step KYC form (entreprise, représentant légal, documents, compte). Submits `multipart/form-data` to `POST /api/merchants/register`: a `data` JSON field plus one `documents[<type>]` file per KYC document, for review in the back office.
- **Dashboard** — country pills (loaded from `GET /api/merchant/countries`), tabs (Etat actuel du compte / Transactions récentes / Paiements dus), balance cards, transactions chart (Recharts).
- **Profil du gestionnaire de compte** — read-only key/value table.
- **Paramètres du compte** — tabs: infos personnelles, changer mot de passe, contacts SAV, autres.
- **Intégrez notre API** — app info, maskable/copyable API keys (test + production), per-country payment methods, PAL/PER/IPN status, actions.
- **Recharger mon compte** — 2-step form (bank/mobile money), then routes to history.
- **Mes recharges** — searchable, paginated-style table with status badges.

Sidebar items without a detailed screen in the source PDF (Gérer ma boutique, Envoyer de l'argent, Demander un paiement, Collecter des paiements, Débourser des paiements, OneQR, Gestion des rôles, Retirer de l'argent) render a placeholder page so the app is fully navigable — swap in real screens as designs become available.

## Next steps

- Wire pages to a real API (replace `src/data/mockData.js` and `AuthContext`).
- Add form validation feedback matching your backend's error shapes.
- Swap the text-based `Logo` component for the real brand mark/asset.
