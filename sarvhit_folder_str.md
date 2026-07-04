# 📂 Sarvhit — Production Folder Structure

> **Monorepo architecture** with clear separation of frontend (`client/`), backend (`server/`), and shared code (`shared/`).
> Designed for **team collaboration with minimal Git conflicts**.

---

## 🗂️ Complete Project Tree

```
sarvhit/
│
│── .github/                          ← GitHub CI/CD & Team Templates
│   ├── workflows/
│   │   ├── ci.yml                    ← Continuous Integration (lint + test)
│   │   ├── cd-staging.yml            ← Deploy to staging on PR merge
│   │   └── cd-production.yml         ← Deploy to production on release tag
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md             ← Bug report template
│   │   └── feature_request.md        ← Feature request template
│   └── PULL_REQUEST_TEMPLATE/
│       └── pull_request.md           ← PR checklist template
│
├── client/                           ← 🖥️ React + Vite Frontend
│   ├── public/
│   │   └── images/                   ← Static images (logos, favicons, OG)
│   │       └── posts/                ← Social feed post images
│   │
│   ├── src/
│   │   ├── api/                      ← 🌐 API client layer
│   │   │   ├── axiosInstance.js       ← Base Axios config with interceptors
│   │   │   ├── authAPI.js            ← Auth endpoints
│   │   │   ├── eventsAPI.js          ← Events endpoints
│   │   │   └── index.js              ← Barrel export
│   │   │
│   │   ├── assets/                   ← 🎨 Bundled assets (SVGs, illustrations)
│   │   │
│   │   ├── components/               ← 🧩 Reusable UI Components
│   │   │   ├── ui/                   ← Generic design-system components
│   │   │   │   ├── AboutFlipCards.jsx + .css
│   │   │   │   ├── CountUp.jsx
│   │   │   │   ├── CursorParticles.jsx + .css
│   │   │   │   ├── EventCarousel.jsx + .css
│   │   │   │   ├── FilterTag.jsx + .css
│   │   │   │   ├── ImpactMarquee.jsx + .css
│   │   │   │   ├── PageHeader.jsx + .css
│   │   │   │   ├── ProgressBar.jsx + .css
│   │   │   │   ├── SpotlightCard.jsx + .css
│   │   │   │   ├── StatCard.jsx + .css
│   │   │   │   └── index.js          ← Barrel export
│   │   │   │
│   │   │   └── AIChatbot/            ← AI Chatbot feature component
│   │   │       ├── AIChatbot.jsx
│   │   │       └── AIChatbot.css
│   │   │
│   │   ├── constants/                ← 📌 App-wide constants & enums
│   │   │
│   │   ├── context/                  ← 🔄 React Context providers
│   │   │   ├── AuthContext.jsx       ← Authentication state
│   │   │   └── ThemeContext.jsx      ← Light/Dark theme state
│   │   │
│   │   ├── data/                     ← 📊 Mock data (development only)
│   │   │   ├── dashboard.js
│   │   │   ├── discover.js
│   │   │   ├── events.js
│   │   │   ├── leaderboardData.js
│   │   │   ├── navigation.js
│   │   │   ├── socialFeed.js
│   │   │   ├── userProfiles.js
│   │   │   ├── affectedAreas.js
│   │   │   └── locations.js
│   │   │
│   │   ├── hooks/                    ← 🪝 Custom React hooks
│   │   │   └── useAnimations.js      ← Framer Motion presets
│   │   │
│   │   ├── layouts/                  ← 📐 Page layout shells
│   │   │   └── AppLayout/
│   │   │       ├── AppLayout.jsx     ← Sidebar + Topbar wrapper
│   │   │       └── AppLayout.css
│   │   │
│   │   ├── pages/                    ← 📄 Feature pages (one folder per route)
│   │   │   ├── Auth/                 ← Login, Register
│   │   │   ├── Dashboard/            ← Main dashboard, Activity detail
│   │   │   ├── Discover/             ← Discover feed, Detail page
│   │   │   ├── Events/               ← Browse events, Event detail, My Events
│   │   │   ├── ImpactMap/            ← Interactive Leaflet map
│   │   │   ├── Landing/              ← Public landing page
│   │   │   ├── Leaderboard/          ← Volunteer rankings
│   │   │   ├── Messages/             ← Chat / messaging
│   │   │   ├── NGO/                  ← Create event, Reports, Team mgmt
│   │   │   ├── Profile/              ← User profile
│   │   │   ├── Settings/             ← App settings
│   │   │   ├── Sponsor/              ← Browse projects, Impact reports, Tax
│   │   │   ├── UserProfile/          ← Public user profile view
│   │   │   └── Volunteer/            ← Badges, Log hours, My NGO
│   │   │
│   │   ├── services/                 ← 🛠️ External integrations
│   │   │   └── geminiService.js      ← Google Gemini AI integration
│   │   │
│   │   ├── store/                    ← 🗃️ Global state (Zustand / Redux)
│   │   │
│   │   ├── styles/                   ← 🎨 Global CSS design system
│   │   │   ├── variables.css         ← CSS custom properties
│   │   │   ├── reset.css             ← CSS normalize
│   │   │   ├── utilities.css         ← Utility classes
│   │   │   └── index.css             ← CSS entry point
│   │   │
│   │   ├── utils/                    ← 🔧 Utility functions
│   │   │   └── formatters.js         ← Date, currency formatters
│   │   │
│   │   ├── App.jsx                   ← Root component + Router
│   │   └── main.jsx                  ← ReactDOM entry point
│   │
│   ├── tests/
│   │   ├── unit/                     ← Component & hook unit tests
│   │   └── e2e/                      ← End-to-end browser tests
│   │
│   ├── index.html                    ← Vite HTML entry
│   ├── vite.config.js                ← Vite build config
│   ├── eslint.config.js              ← ESLint rules
│   ├── package.json                  ← Frontend dependencies
│   └── package-lock.json
│
├── server/                           ← ⚙️ Node.js + Express Backend
│   ├── src/
│   │   ├── config/                   ← Database, env, cors, logger setup
│   │   ├── controllers/              ← Request handlers (auth, user, event, ngo, volunteer, sponsor)
│   │   ├── middlewares/              ← JWT auth, error handler, rate limiter, file upload
│   │   ├── models/                   ← MongoDB / Mongoose schemas
│   │   ├── routes/                   ← API route definitions (/api/v1/...)
│   │   ├── services/                 ← Business logic (email, payment, storage, AI)
│   │   ├── utils/                    ← ApiError, ApiResponse, asyncHandler
│   │   ├── validators/               ← Joi/Zod request validation schemas
│   │   └── app.js                    ← Express app setup
│   │
│   ├── tests/
│   │   ├── unit/                     ← Isolated function tests
│   │   └── integration/              ← API endpoint tests
│   │
│   ├── server.js                     ← HTTP server entry point
│   └── package.json                  ← Backend dependencies
│
├── shared/                           ← 🤝 Code shared by client & server
│   ├── types/                        ← TypeScript interfaces / JSDoc types
│   ├── constants/
│   │   └── index.js                  ← ROLES, EVENT_STATUS enums
│   ├── utils/
│   │   └── index.js                  ← formatDate, slugify, isValidEmail
│   ├── index.js                      ← Barrel export
│   └── package.json
│
├── infra/                            ← 🏗️ Infrastructure & Deployment
│   ├── docker/                       ← Dockerfiles for client & server
│   ├── nginx/                        ← Reverse proxy config
│   └── k8s/                          ← Kubernetes manifests (future)
│
├── docs/                             ← 📄 Project Documentation
│   ├── api/                          ← API endpoint reference docs
│   ├── architecture/                 ← System design, ERD, ADRs
│   ├── guides/                       ← Setup, deployment, contributing guides
│   └── assets/
│       └── media/                    ← Demo videos, screenshots
│
├── scripts/                          ← 🔧 Automation Scripts
│   ├── seed-db.js                    ← Database seeding
│   ├── migrate.js                    ← Migration runner
│   └── deploy.sh                     ← Deployment automation
│
├── .env.example                      ← Environment variables template
├── .gitignore                        ← Git ignore rules
├── docker-compose.yml                ← Dev orchestration (client + server + MongoDB)
├── package.json                      ← Root workspace config (npm workspaces)
├── README.md                         ← Project overview & quick start
└── sarvhit_folder_str.md             ← This file
```

---

## 🛡️ How This Structure Prevents Git Conflicts

| Strategy | How It Helps |
|----------|-------------|
| **Feature-based page folders** | Dev A works in `pages/Events/`, Dev B in `pages/Dashboard/` — zero overlap |
| **Separate `client/` and `server/`** | Frontend and backend devs never touch the same files |
| **Barrel exports (`index.js`)** | New components don't require editing shared import files |
| **Domain-split controllers/routes** | Backend devs own their domain: `authController` vs `eventController` |
| **`shared/` package** | Common types/constants change rarely and are reviewed carefully |
| **Component co-location** | CSS + JSX live in the same folder — one dev owns the whole unit |
| **Config in dedicated dirs** | Configs are rarely touched; isolated from feature code |

---

## 📋 Recommended Team Ownership

| Team Member | Owns |
|-------------|------|
| Frontend Dev 1 | `client/src/pages/Landing/`, `client/src/pages/Dashboard/` |
| Frontend Dev 2 | `client/src/pages/Events/`, `client/src/pages/Discover/` |
| Frontend Dev 3 | `client/src/pages/NGO/`, `client/src/pages/Volunteer/`, `client/src/pages/Sponsor/` |
| UI/Design Dev | `client/src/components/ui/`, `client/src/styles/` |
| Backend Dev 1 | `server/src/controllers/auth*`, `server/src/routes/auth*` |
| Backend Dev 2 | `server/src/controllers/event*`, `server/src/controllers/ngo*` |
| DevOps | `infra/`, `.github/workflows/`, `scripts/` |

---

## 🚀 Quick Start Commands

```bash
# Install all workspace dependencies
npm install

# Start both client + server
npm run dev

# Start individually
npm run dev:client       # Frontend on :5173
npm run dev:server       # Backend on :5000

# Run tests
npm run test

# Lint
npm run lint
```

---

*Last Updated: July 2026 · Maintainer: Sarvhit Team*
