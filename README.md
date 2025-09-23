# ft_transcendence

## Project Overview

**ft_transcendence** is a multiplayer Pong game reimagined as a modern single-page application (SPA). It features real-time gameplay, tournaments, friend management, and user authentication (including Google OAuth2 and 2FA). The project is designed for both local development and secure production deployment, leveraging containerization, a WAF, and Vault-managed secrets.

---

## Tech Stack

### Backend

- **Node.js** (ES modules)
- **Fastify** (web server, plugins for CORS, JWT, OAuth2, multipart, etc.)
- **Prisma ORM** (database access)
- **SQLite** (development database)
- **HashiCorp Vault** (secrets/certificates management)
- **Nodemon** (dev auto-reload)
- **Pino-pretty** (logging)

### Frontend

- **TypeScript** (custom SPA, no framework)
- **Vanilla JS** (modular, custom rendering)
- **Tailwind CSS** (utility-first styling)
- **ApexCharts** (charts)
- **DOMPurify** (XSS protection)
- **i18next** (localization, multiple languages including “pirate” mode)

### DevOps / Tooling

- **Docker Compose** (multi-service orchestration)
- **Nginx + ModSecurity** (WAF)
- **ngrok** (optional, for tunneling)
- **Husky + lint-staged + Prettier + ESLint** (code quality)
- **Madge** (dependency graph)

---

## Installation Guide

### Requirements

- Node.js (v18+ recommended)
- npm (v9+)
- Docker & Docker Compose
- (Optional) ngrok account for tunneling

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/u413-284-si/ft_transcendence.git
   cd ft_transcendence
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Copy `.env.example` to `.env` and adjust as needed:
     ```bash
     cp .env.example .env
     ```
   - Fill in secrets for Google OAuth2, etc.

4. **Initialize the database**

   ```bash
   npm run db:init
   npm run db:seed
   ```

5. **Build frontend assets**
   ```bash
   npm run build
   ```

---

## Usage Instructions

### Development

- **Start all services (backend, frontend, Vault, WAF, etc.):**
  ```bash
  make up
  ```
- **Watch mode (auto-rebuild on changes):**
  ```bash
  make watch
  ```
- **Backend only (auto-restart):**
  ```bash
  npm run watch-backend
  ```
- **Frontend only (auto-rebuild):**
  ```bash
  npm run watch-frontend
  ```

### Production

- **Build containers:**
  ```bash
  make build
  ```
- **Start services:**

  ```bash
  make up
  ```

- **Stop services:**
  ```bash
  make down
  ```

---

## Configuration

- **Environment variables:**
  See `.env.example` for all options. Key variables:

  - `DOMAIN_NAME`, `APP_PORT`, `LOG_LEVEL`, `NODE_ENV`
  - Vault/NGINX/ModSecurity config
  - Google OAuth2 credentials
  - Rate limits, file size, etc.

- **Secrets:**
  Managed via Vault (see `vault/` and `vault-agent-*`).

- **Frontend build:**
  - `npm run build` compiles TypeScript, builds CSS, and vendors JS libraries.

---

## Database

- **Technology:** SQLite (dev), managed via Prisma ORM.
- **Schema:** See `app/backend/prisma/schema.prisma`.
- **Migrations:**
  ```bash
  npm run db:init
  ```
- **Seeding:**
  ```bash
  npm run db:seed
  ```
- **Reset:**
  ```bash
  npm run db:reset
  ```

---

## Project Structure

```
.
├── app/
│   ├── backend/         # Fastify server, Prisma, API logic
│   │   ├── prisma/      # Prisma schema, migrations, seeders
│   │   ├── src/         # Controllers, modules, services, config
│   ├── frontend/        # TypeScript SPA, custom components, assets
│   │   ├── src/         # TS modules, views, routing, localization
│   │   ├── public/      # Built assets, static files
├── db/                  # SQLite database (dev)
├── scripts/             # Utility scripts (e.g., copy-ext-files.js)
├── vault/               # Vault config, policies, tools
├── waf/                 # Nginx + ModSecurity WAF config
├── docker-compose.yml   # Service orchestration
├── Makefile             # Dev workflows
└── .env.example         # Environment variable template
```

---

## Testing

- **No formal test suite.**
  Manual testing via frontend and API. (Add tests if needed.)

---

## Deployment Guide

- **Docker Compose** is used for orchestration.
- **Vault** and **WAF** are included as services.
- **ngrok** can be enabled for public tunneling (set `USE_NGROK=1`).
- **Production tips:**
  - Set `NODE_ENV=production`
  - Use secure secrets in Vault
  - Adjust rate limits and CORS as needed

---

## Contributing

- Follow Prettier and ESLint rules (auto-run on commit via Husky/lint-staged).
- Use clear commit messages and PR descriptions.
- For new API routes: add controller, schema, and register in `modules/api.module.js`.
- For new frontend components: add a `.ts` file in `components/`, export a function returning an HTML string.
- For new languages: add a file in `src/locales/` following the shape of `en.ts`.
- Open issues or PRs for discussion before large changes.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgments

- Inspired by the classic Pong game and TRON aesthetics.
- Built with Fastify, Prisma, Tailwind CSS, and open-source libraries.
