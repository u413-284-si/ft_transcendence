# Copilot Instructions for ft_transcendence

## Project Overview

- **ft_transcendence** is a multiplayer Pong game as a single-page application (SPA), with a Fastify backend and a TypeScript/vanilla JS frontend.
- The project is containerized using Docker Compose, with additional services for Vault (secrets), WAF (nginx+modsecurity), and optional ngrok tunneling.
- The backend uses Prisma ORM with a SQLite database (see `app/backend/prisma/`).
- The frontend is a custom TypeScript app (not React/Vue), built to `app/frontend/public/dist`.

## Key Directories

- `app/backend/` — Fastify server, business logic, Prisma, and API modules.
- `app/frontend/` — TypeScript SPA, custom UI components, localization, and assets.
- `vault/`, `vault-agent-*` — HashiCorp Vault setup, policies, and agent configs for secrets and certificates.
- `waf/` — Nginx + ModSecurity WAF container setup.
- `db/` — SQLite database file (dev only).
- `scripts/` — Utility scripts (e.g., `copy-ext-files.js` for vendoring frontend dependencies).

## Developer Workflows

- **Start/stop all services:** `make up` / `make down` (uses Docker Compose)
- **Build containers:** `make build` (add `VERBOSE=1` for logs)
- **Watch mode (dev):** `make watch` (auto-rebuilds on file changes)
- **Backend dev:** `npm run watch-backend` (nodemon, auto-restarts Fastify)
- **Frontend dev:** `npm run watch-frontend` (nodemon, rebuilds CSS/TS)
- **Database:**
  - Migrate: `npm run db:init`
  - Seed: `npm run db:seed`
  - Reset: `npm run db:reset`
- **Frontend build:** `npm run build` (runs CSS build, TypeScript compile, and vendor copy)

## Project Conventions & Patterns

**Frontend:**

- No framework; uses TypeScript modules and custom HTML rendering (see `components/`).
- UI state and DOM updates are managed manually.
- **Layout & Router interaction:**
  - The `Layout` singleton manages the persistent page shell (header, footer, language switcher, avatar drawer) and is responsible for switching between "auth" and "guest" modes. It renders the static structure and provides the `#app-content` container for dynamic view content.
  - The `Router` singleton handles SPA navigation, route guards, and view switching. It instantiates the correct `AbstractView` subclass for the current route and calls its `mount()` method.
  - On navigation, `Router` updates the current view by calling `view.mount()`, which triggers `view.render()`. This replaces the inner HTML of `#app-content` (managed by `Layout`) with the new view's content.
  - The `Layout` and `Router` are loosely coupled: `Layout` is responsible for the persistent UI shell, while `Router` manages dynamic content and navigation. The two interact via DOM updates and event listeners, not direct method calls.
  - The main entrypoint (`main.ts`) wires up route definitions, guards, and listeners. It also ensures that when authentication state changes, `Layout` and `Router` are updated in sync (see `auth.onChange`).
- Localization via `src/locales/` (multiple languages, pirate mode included).
- Vendored JS libraries (ApexCharts, DOMPurify, i18next) are copied to `public/ext/` via `scripts/copy-ext-files.js`.

**Backend:**

- Fastify plugins for CORS, JWT, OAuth2, multipart, etc.
- Secrets (JWT, Google OAuth) are loaded from Vault if `USE_VAULT` is true (see `config/env.js`).
- API modules are registered in `modules/` and exposed under `/api`.
- Schemas for validation in `schema/`.

**Secrets & Certificates:**

- Vault is used for secrets/certs in dev and prod; see `vault/` and `vault-agent-*`.
- Policies and agent configs are in their respective folders.

**Testing:**

- No formal test suite; manual testing via frontend and API.

**Linting/Formatting:**

- Prettier and ESLint are configured; run on commit via Husky/lint-staged.

## Integration Points

- **OAuth2:** Google login via Fastify OAuth2 plugin.
- **WAF:** Nginx+ModSecurity container protects the app; config in `waf/`.
- **Vault:** All secrets/certs are managed via Vault; see `vault/` for setup and policies.

## Examples

- To add a new API route: create a controller in `controllers/`, add schema in `schema/`, register in `modules/api.module.js`.
- To add a new frontend component: add a `.ts` file in `components/`, export a function returning an HTML string.
- To add a new language: add a file in `src/locales/` following the shape of `en.ts`.
