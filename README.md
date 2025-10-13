# ft_transcendence

## Project Overview

**ft_transcendence** is the final project of the 42 Common Core. It includes a
mandatory part and a series of modules on various topics.

At its core it is a multiplayer Pong game reimagined as a modern single-page application (SPA). It features real-time gameplay, tournaments, friend management, and user authentication (including Google OAuth2 and 2FA). The project is leveraging containerization, a WAF, and Vault-managed secrets.

✅ Completed with 110/100 @ Version 18.0

Made with ❤️ by

- [u413-284-si](https://github.com/u413-284-si)
- [QCHR1581](https://github.com/QCHR1581)
- [gwolf-011235](https://github.com/gwolf-011235)

---

## Mandatory Part Summary

<details>
<summary>Click to expand the mandatory part overview</summary>

### 1. Core Goal

- Create a **functional Pong website** where users can:
  - Play a **live Pong match**.
  - Participate in a **tournament system**.
  - **Register aliases** before each tournament.
  - See **matchmaking and next match announcements**.

### 2. Technical Constraints

#### Frontend

- Must be a **Single Page Application (SPA)**.
  - Users can navigate with browser Back/Forward buttons.
- Written in **TypeScript**.
- Works correctly on the **latest stable Firefox**.
- Must **not crash** — no unhandled errors or warnings.

#### Backend

- You may choose:
  - **No backend** (pure frontend logic), or
  - **Pure PHP** backend (**no frameworks**).
    → Frameworks like Fastify are allowed only in later modules.

#### Database

- Not required in the base version.
- If used, must comply with database module rules (e.g. **SQLite**).

#### Containerization

- Must be **fully Dockerized**:
  - Run everything with **one command** (e.g. `docker-compose up`).
  - No manual setup.
  - On rootless Docker systems:
    - Use `/goinfre` for images.
    - Avoid bind mounts (rebuild images instead).

### 3. Game Requirements

#### Pong Game

- **Local multiplayer**: Two players on the same keyboard.
- **Tournament mode**:
  - Players enter **aliases** before starting.
  - Aliases reset each tournament.
  - System handles **matchmaking and announcements**.
- **Game fairness**:
  - Equal paddle speed, same physics for all.
  - AI (if added later) must follow the same rules.
- **Visuals**:
  - Must preserve the **minimalist “original Pong” style**.
  - Enhancements allowed only in optional modules.

#### Libraries

- No libraries that implement Pong or handle all game logic.
- Allowed: small helper utilities (e.g. math, sound, or animation libs).
- You must be able to **justify** any external library choice.

### 4. Security Requirements

| Requirement                        | Description                                                   |
| ---------------------------------- | ------------------------------------------------------------- |
| **Password hashing**               | Hash all stored passwords (e.g. bcrypt, argon2).              |
| **XSS & SQL Injection Protection** | Sanitize and validate all user input.                         |
| **HTTPS**                          | Website and WebSocket connections must use HTTPS/WSS.         |
| **Form validation**                | Validate input on client or server side.                      |
| **Route protection**               | Secure all API routes and endpoints.                          |
| **Secrets management**             | Store API keys, passwords, and tokens in `.env` (gitignored). |

### Summary Checklist

| Category               | Must Have                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------- |
| **Frontend**           | TypeScript SPA, no framework (React/Vue/etc.), works in Firefox, no runtime errors |
| **Game**               | Playable Pong (local multiplayer), fair physics, simple visuals                    |
| **Tournament**         | Alias registration, matchmaking, match announcements                               |
| **Security**           | HTTPS, input validation, password hashing, sanitized routes                        |
| **Containerization**   | Dockerized setup, one-command start                                                |
| **Backend (optional)** | Pure PHP, unless you add the backend module                                        |

</details>

---

## Implemented Modules

The subject requires to implement 7 Major Modules, where 2 Minor Modules count as 1 Major Module.

We implemented 8 Major Modules.

<details>
<summary>Click to expand the list of implemented modules</summary>

### Use a Framework to Build the Backend (Major Module)

- Implemented with **Fastify** (Node.js) as the backend framework.
- Provides a structured, modular API for game logic, authentication, and user data.
- All routes are **secured and validated** according to web security best practices.

### Use a Framework or Toolkit to Build the Frontend (Minor Module)

- Frontend developed in **TypeScript + TailwindCSS**.
- No frontend framework (React/Vue) — uses **vanilla TypeScript + DOM routing**.
- Designed as a **Single Page Application (SPA)** with smooth navigation.
- UI built using custom **modular components**

### Use a Database for the Backend (Minor Module)

- Backend uses **Prisma ORM** with **SQLite**.
- Stores:
  - User data and authentication tokens.
  - Tournament brackets and match results.
  - Player and game statistics.
- Includes **schema validation**.

### Standard User Management, Authentication, Users Across Tournaments (Major Module)

- Implements full **user registration and login** system.
- Supports:
  - Persistent sessions with **JWTs**.
  - Password hashing using **bcrypt**.
  - Unique usernames across tournaments.
- Users can **create tournaments**, track results, add friends and maintain global profiles.

### Implementing a Remote Authentication (Major Module)

- Integrates **Google OAuth2 login** for remote authentication.
- Supports both **Google login** and local account creation.
- Securely handles OAuth callback and token exchange.

### Introduce an AI Opponent (Major Module)

- Adds an **AI-controlled paddle** as an opponent.
- Difficulty levels available (Easy, Normal, Hard).
- AI logic based on **predictive ball trajectory** and **reaction delay**.
- Allows single-player mode with identical physics to multiplayer.

### User and Game Stats Dashboards (Minor Module)

- Includes visual **statistics dashboards** for stats such as
  - Win/loss ratios.
  - Match history.
  - Tournament history.
- Uses **ApexCharts** for chart rendering.
- Fully integrated into the SPA interface with subtabs for categories (Matches, Tournaments, Friends)

### WAF/ModSecurity & HashiCorp Vault Integration (Major Module)

- Adds **ModSecurity (WAF)** in front of the Fastify server for additional protection.
- Hardened configuration to mitigate XSS, CSRF, SQLi, and brute-force attacks.
- **HashiCorp Vault** used for managing sensitive credentials (JWT secrets, API keys).
- Secrets loaded dynamically into the backend at runtime.

### Two-Factor Authentication (2FA) and JWT (Major Module)

- Implements **2FA** using **TOTP** (Time-based One-Time Passwords).
- Users can enable 2FA for enhanced security.
- **JWT-based authentication** with access and refresh tokens.
- Token rotation and expiration management ensure long-term security.

### Supports Multiple Languages (Minor Module)

- Application supports **multi-language UI** with the following languages:
  - English
  - French
  - German
  - Tron (inspired by film TRON)
  - Pirate
- Implemented using **i18next** with **Typescript language files**.
- Language preference stored per user in the database.
- Text dynamically changes without reloading the page.

</details>

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

## Quick Start & Usage

If you just want to try out ft_transcendence, all you need is Docker and Docker Compose installed. Clone the repository and run:

```bash
git clone https://github.com/u413-284-si/ft_transcendence.git
cd ft_transcendence
make up
```

This will start all required services (backend, frontend, Vault, WAF, etc.) automatically. The app will be available at the configured domain (see `.env.example`).

### Development

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

If you want to customize environment variables, database, or secrets, see the configuration section below.

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

---

## Development Container (Dev Container)

This project includes a [VS Code Dev Container](https://containers.dev/) setup for a fully reproducible development environment.

- **Location:** `.devcontainer/` (contains `devcontainer.json` and `Dockerfile`)
- **Base Image:** Node.js 24 (Debian Bookworm)
- **Features:**
  - Zsh shell
  - Pre-installed VS Code extensions: ESLint, Prettier, Postman, Prisma, Tailwind CSS
  - Automatic install of dependencies (`npm ci`)
  - Recommended editor settings (format on save, auto-save, ESLint integration)
- **Usage:**
  1. Open the project in VS Code.
  2. When prompted, "Reopen in Container" to start the dev container.
  3. All development tools and dependencies will be available inside the container.
  4. Ports/services can be forwarded as needed for local testing.
- **Remote User:** The container runs as the `node` user for security.

This setup ensures consistent tooling, code style, and environment for all contributors. For more details, see `.devcontainer/devcontainer.json`.
