# Sarvhit — Impact Platform

Connecting **NGOs**, **Volunteers**, and **Sponsors** on a single platform for social impact.

## Monorepo Structure

```
sarvhit/
├── client/          → React + Vite Frontend
├── server/          → Node.js + Express Backend
├── shared/          → Shared types, constants, utils
├── infra/           → Docker, Nginx, K8s configs
├── docs/            → Project documentation
├── scripts/         → Automation scripts
└── .github/         → CI/CD & templates
```

> See [sarvhit_folder_str.md](./sarvhit_folder_str.md) for the full detailed structure.

## Tech Stack

| Layer | Stack |
|-------|-------|
| **Frontend** | React 19, Vite 7, React Router v7, Framer Motion, Lucide React, React Leaflet |
| **Backend** | Node.js, Express, MongoDB (Mongoose), JWT Auth |
| **Infrastructure** | Docker, Nginx, GitHub Actions CI/CD |

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-org/sarvhit.git
cd sarvhit

# 2. Copy environment variables
cp .env.example .env

# 3. Install all dependencies (workspace-aware)
npm install

# 4. Start development (both client + server)
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| API Health | http://localhost:5000/api/v1/health |

## Roles

| Role | Accent | Key Features |
|------|--------|-------------|
| NGO | Green | Create events, manage volunteers, track funds |
| Volunteer | Amber | Browse events, log hours, earn badges |
| Sponsor | Purple | Fund projects, view impact reports, tax receipts |

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Work in the relevant directory (`client/`, `server/`, or `shared/`)
3. Commit with conventional commits: `feat:`, `fix:`, `docs:`
4. Open a Pull Request

## License

MIT
