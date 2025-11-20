# 🎨 ResumeNest Architecture Diagrams

## 📊 Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USERS & CLIENTS                                 │
│                                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                │
│   │   Browser    │    │    Mobile    │    │   Desktop    │                │
│   │   (Chrome)   │    │   (Safari)   │    │   (Firefox)  │                │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                │
│          │                    │                    │                         │
└──────────┼────────────────────┼────────────────────┼─────────────────────────┘
           │                    │                    │
           │                 HTTPS                   │
           │                    │                    │
           ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            LOAD BALANCER (Optional)                          │
│                        Nginx / CloudFlare / AWS ALB                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DOCKER HOST / SERVER                               │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    Docker Network (resumenest-network)                 │ │
│  │                                                                         │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────────┐  │ │
│  │  │   Frontend       │  │   Backend       │  │   MongoDB            │  │ │
│  │  │   Container      │  │   Container     │  │   Container          │  │ │
│  │  │                  │  │                 │  │                      │  │ │
│  │  │  React 18        │  │  Express.js     │  │  MongoDB 7.0         │  │ │
│  │  │  TypeScript      │  │  TypeScript     │  │                      │  │ │
│  │  │  Vite            │  │  Node.js 20     │  │  Database Storage    │  │ │
│  │  │  Tailwind CSS    │  │  JWT Auth       │  │  - Users             │  │ │
│  │  │                  │  │  REST API       │  │  - Resumes           │  │ │
│  │  │  ┌────────────┐  │  │                 │  │                      │  │ │
│  │  │  │   Nginx    │  │  │  ┌───────────┐ │  │  ┌────────────────┐  │  │ │
│  │  │  │   Server   │◄─┼──┼─►│  API      │◄┼──┼─►│  Mongoose ODM  │  │  │ │
│  │  │  │            │  │  │  │  Routes   │ │  │  └────────────────┘  │  │ │
│  │  │  │  Port 80   │  │  │  │           │ │  │                      │  │ │
│  │  │  │  or 5173   │  │  │  │  Port     │ │  │  Port 27017          │  │ │
│  │  │  │            │  │  │  │  3000     │ │  │                      │  │ │
│  │  │  └────────────┘  │  │  └───────────┘ │  │  Volumes:            │  │ │
│  │  │                  │  │                 │  │  - mongodb_data      │  │ │
│  │  │  Health: /health │  │  Health: /api/  │  │  - mongodb_config    │  │ │
│  │  │                  │  │         health  │  │                      │  │ │
│  │  └─────────────────┘  └─────────────────┘  └──────────────────────┘  │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Persistent Volumes:                                                         │
│  ├── mongodb_data       (Database storage)                                  │
│  ├── mongodb_config     (MongoDB configuration)                             │
│  ├── backend_node_modules (Dev dependencies)                                │
│  └── frontend_node_modules (Dev dependencies)                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 CI/CD Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              GITHUB REPOSITORY                               │
│                      https://github.com/Lochan-01/ResumeNest                │
└─────────────────────────────────────────────────────────────────────────────┘
          │                                        │
          │ Pull Request                           │ Push to main
          │                                        │
          ▼                                        ▼
┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│     CI PIPELINE (ci.yml)        │    │     CD PIPELINE (cd.yml)        │
│                                 │    │                                 │
│  ┌────────────────────────────┐ │    │  ┌────────────────────────────┐ │
│  │ 1. Lint & Type Check       │ │    │  │ 1. Build Docker Images     │ │
│  │    - ESLint (Frontend)     │ │    │  │    - Multi-stage builds    │ │
│  │    - TypeScript validation │ │    │  │    - Production target     │ │
│  └────────────────────────────┘ │    │  └────────────────────────────┘ │
│               ↓                  │    │               ↓                  │
│  ┌────────────────────────────┐ │    │  ┌────────────────────────────┐ │
│  │ 2. Build Applications      │ │    │  │ 2. Push to Registries      │ │
│  │    - Frontend (Vite)       │ │    │  │    - GitHub Container      │ │
│  │    - Backend (TypeScript)  │ │    │  │      Registry (ghcr.io)    │ │
│  └────────────────────────────┘ │    │  │    - Docker Hub (optional) │ │
│               ↓                  │    │  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │    │               ↓                  │
│  │ 3. Build Docker Images     │ │    │  ┌────────────────────────────┐ │
│  │    - Frontend image        │ │    │  │ 3. Deploy to Production    │ │
│  │    - Backend image         │ │    │  │    Choose one:             │ │
│  │    - NO PUSH (test only)   │ │    │  │    ┌──────────────────┐   │ │
│  └────────────────────────────┘ │    │  │    │  AWS EC2         │   │ │
│               ↓                  │    │  │    │  - SSH connect   │   │ │
│  ┌────────────────────────────┐ │    │  │    │  - Pull images   │   │ │
│  │ 4. Security Scan           │ │    │  │    │  - Restart       │   │ │
│  │    - npm audit             │ │    │  │    └──────────────────┘   │ │
│  │    - Vulnerability check   │ │    │  │    ┌──────────────────┐   │ │
│  └────────────────────────────┘ │    │  │    │  Render          │   │ │
│               ↓                  │    │  │    │  - Webhook       │   │ │
│  ┌────────────────────────────┐ │    │  │    └──────────────────┘   │ │
│  │ ✅ All Checks Passed       │ │    │  │    ┌──────────────────┐   │ │
│  └────────────────────────────┘ │    │  │    │  VPS (Generic)   │   │ │
│                                 │    │  │    │  - SSH connect   │   │ │
│                                 │    │  │    │  - docker-compose│   │ │
│                                 │    │  │    └──────────────────┘   │ │
│                                 │    │  └────────────────────────────┘ │
│                                 │    │               ↓                  │
│                                 │    │  ┌────────────────────────────┐ │
│                                 │    │  │ 4. Notify Status           │ │
│                                 │    │  │    - GitHub summary        │ │
│                                 │    │  │    - Slack (optional)      │ │
│                                 │    │  └────────────────────────────┘ │
└─────────────────────────────────┘    └─────────────────────────────────┘
```

---

## 🏗️ Docker Multi-Stage Build Flow

### Frontend Build Process

```
┌───────────────────────────────────────────────────────────────┐
│                     FRONTEND DOCKERFILE                        │
└───────────────────────────────────────────────────────────────┘

Stage 1: Builder (node:20-alpine)
┌───────────────────────────────────────────────────────────────┐
│  FROM node:20-alpine AS builder                               │
│                                                                │
│  1. Copy package.json & package-lock.json                     │
│  2. npm ci (install dependencies)                             │
│  3. Copy source code                                          │
│  4. npm run build                                             │
│     ├── TypeScript compilation                                │
│     ├── Vite bundling                                         │
│     ├── CSS processing (Tailwind)                             │
│     └── Asset optimization                                    │
│                                                                │
│  Output: /app/dist/ (optimized static files)                 │
└───────────────────────────────────────────────────────────────┘
                            ↓
Stage 2: Production (nginx:alpine) - ~25MB
┌───────────────────────────────────────────────────────────────┐
│  FROM nginx:alpine AS production                              │
│                                                                │
│  1. Copy custom nginx.conf                                    │
│  2. COPY --from=builder /app/dist /usr/share/nginx/html      │
│  3. Setup non-root user                                       │
│  4. Configure health checks                                   │
│                                                                │
│  Result: Minimal production image                             │
│  - Only static files                                          │
│  - No source code                                             │
│  - No node_modules                                            │
│  - No build tools                                             │
└───────────────────────────────────────────────────────────────┘

Stage 3: Development (node:20-alpine) - For hot-reload
┌───────────────────────────────────────────────────────────────┐
│  FROM node:20-alpine AS development                           │
│                                                                │
│  1. Install all dependencies (including dev)                  │
│  2. Mount source code as volume                               │
│  3. Run Vite dev server                                       │
│                                                                │
│  Features:                                                     │
│  - Hot module replacement                                     │
│  - Fast refresh                                               │
│  - Source maps                                                │
└───────────────────────────────────────────────────────────────┘
```

### Backend Build Process

```
┌───────────────────────────────────────────────────────────────┐
│                     BACKEND DOCKERFILE                         │
└───────────────────────────────────────────────────────────────┘

Stage 1: Builder (node:20-alpine)
┌───────────────────────────────────────────────────────────────┐
│  FROM node:20-alpine AS builder                               │
│                                                                │
│  1. Copy package.json & package-lock.json                     │
│  2. npm ci (install all dependencies)                         │
│  3. Copy source code                                          │
│  4. npm run build                                             │
│     └── TypeScript → JavaScript compilation                   │
│                                                                │
│  Output: /app/dist/ (compiled JavaScript)                    │
└───────────────────────────────────────────────────────────────┘
                            ↓
Stage 2: Production (node:20-alpine) - ~150MB
┌───────────────────────────────────────────────────────────────┐
│  FROM node:20-alpine AS production                            │
│                                                                │
│  1. Install dumb-init (signal handling)                       │
│  2. Copy package.json                                         │
│  3. npm ci --only=production (no dev dependencies)           │
│  4. COPY --from=builder /app/dist ./dist                     │
│  5. Setup non-root user                                       │
│  6. Configure health checks                                   │
│                                                                │
│  Result: Optimized production image                           │
│  - Only compiled code                                         │
│  - Production dependencies only                               │
│  - No TypeScript files                                        │
│  - No dev dependencies                                        │
└───────────────────────────────────────────────────────────────┘

Stage 3: Development (node:20-alpine) - For hot-reload
┌───────────────────────────────────────────────────────────────┐
│  FROM node:20-alpine AS development                           │
│                                                                │
│  1. Install all dependencies                                  │
│  2. Mount source code as volume                               │
│  3. Run with ts-node (TypeScript execution)                   │
│                                                                │
│  Features:                                                     │
│  - Hot reload on file changes                                 │
│  - TypeScript support                                         │
│  - Debug capabilities                                         │
└───────────────────────────────────────────────────────────────┘
```

---

## 🌐 Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER MAKES REQUEST                              │
│                     https://resumenest.com/dashboard                     │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        1. NGINX (Frontend Container)                     │
│                                                                          │
│  ├─ Route: /dashboard                                                   │
│  │   ├─ Serve: /usr/share/nginx/html/index.html                        │
│  │   └─ Status: 200 OK                                                  │
│  │                                                                       │
│  ├─ Route: /api/*                                                       │
│  │   ├─ Proxy to: http://backend:3000                                  │
│  │   └─ Add headers: X-Real-IP, X-Forwarded-For                        │
│  │                                                                       │
│  └─ Static Assets: /assets/*                                            │
│      ├─ Cache: 1 year                                                   │
│      └─ Gzip: Enabled                                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                     (API Requests Only)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        2. BACKEND (Express.js)                           │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Middleware Chain                                                  │  │
│  │ ├─ 1. CORS validation                                            │  │
│  │ ├─ 2. JSON body parser                                           │  │
│  │ ├─ 3. JWT authentication (if required)                           │  │
│  │ └─ 4. Route handler                                              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                  │                                       │
│                                  ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Routes                                                            │  │
│  │ ├─ GET  /api/health           → Health check                     │  │
│  │ ├─ POST /api/auth/register    → User registration                │  │
│  │ ├─ POST /api/auth/login       → User login                       │  │
│  │ ├─ GET  /api/resumes          → List user resumes                │  │
│  │ ├─ POST /api/resumes          → Create new resume                │  │
│  │ ├─ GET  /api/resumes/:id      → Get resume details               │  │
│  │ ├─ PUT  /api/resumes/:id      → Update resume                    │  │
│  │ ├─ DELETE /api/resumes/:id    → Delete resume                    │  │
│  │ └─ POST /api/suggestions      → AI content suggestions           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                  (Database Operations)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        3. MONGODB (Database)                             │
│                                                                          │
│  Collections:                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ users                                                             │  │
│  │ ├─ _id: ObjectId                                                 │  │
│  │ ├─ email: String (unique)                                        │  │
│  │ ├─ password: String (hashed)                                     │  │
│  │ ├─ name: String                                                  │  │
│  │ └─ createdAt: Date                                               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ resumes                                                           │  │
│  │ ├─ _id: ObjectId                                                 │  │
│  │ ├─ userId: ObjectId (ref: User)                                  │  │
│  │ ├─ title: String                                                 │  │
│  │ ├─ template: String                                              │  │
│  │ ├─ content: Object { firstName, lastName, email, ... }          │  │
│  │ └─ createdAt: Date                                               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Volumes: mongodb_data:/data/db (Persistent)                            │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                    (Response Path - Reverse)
                                  ▼
                         User receives response
```

---

## 🔄 Development Workflow

```
┌───────────────────────────────────────────────────────────────────────┐
│                     DEVELOPER LOCAL MACHINE                            │
└───────────────────────────────────────────────────────────────────────┘
          │
          │ 1. Edit code in IDE
          │    (VSCode, IntelliJ, etc.)
          ▼
┌───────────────────────────────────────────────────────────────────────┐
│                     Source Code (Mounted Volume)                       │
│  ├── frontend/src/                                                    │
│  └── backend/src/                                                     │
└───────────────────────────────────────────────────────────────────────┘
          │
          │ 2. File watcher detects changes
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│              Docker Containers (Development Mode)                    │
│                                                                      │
│  ┌─────────────────────┐        ┌─────────────────────┐            │
│  │   Frontend          │        │   Backend           │            │
│  │                     │        │                     │            │
│  │  Vite Dev Server    │        │  ts-node + nodemon  │            │
│  │  ↓                  │        │  ↓                  │            │
│  │  Hot Module         │        │  Auto-restart       │            │
│  │  Replacement (HMR)  │        │  on file change     │            │
│  │  ↓                  │        │  ↓                  │            │
│  │  Browser            │        │  API available      │            │
│  │  auto-refreshes     │        │  immediately        │            │
│  └─────────────────────┘        └─────────────────────┘            │
└─────────────────────────────────────────────────────────────────────┘
          │
          │ 3. Test changes
          ▼
┌───────────────────────────────────────────────────────────────────────┐
│                      Browser / API Client                              │
│  - Changes visible immediately                                        │
│  - No rebuild required                                                │
│  - Fast feedback loop                                                 │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Production Deployment Flow

```
┌───────────────────────────────────────────────────────────────────────┐
│                     DEVELOPER PUSHES TO GITHUB                         │
│                     git push origin main                               │
└───────────────────────────────────────────────────────────────────────┘
          │
          │ Webhook triggers
          ▼
┌───────────────────────────────────────────────────────────────────────┐
│                     GITHUB ACTIONS (CD Pipeline)                       │
│                                                                        │
│  1. Checkout code                                                     │
│  2. Build Docker images (multi-stage, production target)             │
│  3. Tag images: latest, sha, version                                 │
│  4. Push to registries:                                              │
│     ├─ ghcr.io/lochan-01/resumenest-frontend:latest                 │
│     ├─ ghcr.io/lochan-01/resumenest-backend:latest                  │
│     └─ (optional) Docker Hub                                         │
└───────────────────────────────────────────────────────────────────────┘
          │
          │ Deployment phase
          ▼
┌───────────────────────────────────────────────────────────────────────┐
│                     PRODUCTION SERVER (Choose one)                     │
│                                                                        │
│  ┌──────────────────┐   ┌──────────────────┐   ┌─────────────────┐ │
│  │  AWS EC2         │   │  Render          │   │  VPS (Generic)  │ │
│  │                  │   │                  │   │                 │ │
│  │  1. SSH connect  │   │  1. Webhook      │   │  1. SSH connect │ │
│  │  2. Git pull     │   │     trigger      │   │  2. Docker      │ │
│  │  3. Docker pull  │   │  2. Auto deploy  │   │     login       │ │
│  │  4. Compose up   │   │  3. Done ✅      │   │  3. Pull images │ │
│  │  5. Health check │   │                  │   │  4. Compose up  │ │
│  │  6. Done ✅      │   │                  │   │  5. Done ✅     │ │
│  └──────────────────┘   └──────────────────┘   └─────────────────┘ │
└───────────────────────────────────────────────────────────────────────┘
          │
          │ Application running
          ▼
┌───────────────────────────────────────────────────────────────────────┐
│                     PRODUCTION CONTAINERS                              │
│                                                                        │
│  Frontend (Port 80) ◄── Nginx ◄── SSL ◄── Users                      │
│  Backend (Port 3000) ◄── API Calls                                    │
│  MongoDB (Port 27017) ◄── Backend only (internal)                     │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure Visualization

```
ResumeNest/
│
├── 🐳 DOCKER INFRASTRUCTURE
│   ├── docker-compose.yml              # Development orchestration
│   ├── docker-compose.prod.yml         # Production orchestration
│   ├── .dockerignore                   # Build context optimization
│   │
│   ├── frontend/
│   │   ├── Dockerfile                  # Multi-stage frontend build
│   │   ├── nginx.conf                  # Nginx configuration
│   │   └── .dockerignore              # Frontend-specific ignores
│   │
│   └── backend/
│       ├── Dockerfile                  # Multi-stage backend build
│       └── .dockerignore              # Backend-specific ignores
│
├── 🔄 CI/CD PIPELINES
│   └── .github/
│       └── workflows/
│           ├── ci.yml                  # Continuous Integration
│           └── cd.yml                  # Continuous Deployment
│
├── ⚙️ CONFIGURATION
│   ├── .env.sample                     # Docker Compose env template
│   ├── .env.production.sample          # Production env template
│   ├── backend/.env.sample             # Backend env template
│   └── frontend/.env.sample            # Frontend env template
│
├── 📚 DOCUMENTATION
│   ├── README.md                       # Main project README
│   ├── DEPLOYMENT.md                   # Deployment guide (13KB)
│   ├── DOCKER_GUIDE.md                 # Docker reference (10KB)
│   ├── DOCKER_CICD_README.md           # CI/CD quick reference (20KB)
│   ├── DOCKER_CICD_SUMMARY.md          # Implementation summary (12KB)
│   └── ARCHITECTURE.md                 # This file
│
├── 🚀 AUTOMATION SCRIPTS
│   ├── setup.sh                        # Unix/Linux/macOS setup
│   └── setup.bat                       # Windows setup
│
└── 📦 APPLICATION CODE
    ├── frontend/                       # React application
    ├── backend/                        # Express.js API
    └── shared/                         # Shared TypeScript types
```

---

## 🎯 Quick Reference

### Port Mapping

| Service | Development | Production | Purpose |
|---------|-------------|------------|---------|
| Frontend | 5173 | 80 | Web UI |
| Backend | 3000 | 3000 | REST API |
| MongoDB | 27017 | 27017 | Database |

### URLs

**Development:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health: http://localhost:3000/api/health

**Production:**
- Frontend: https://your-domain.com
- Backend: https://your-domain.com/api
- Health: https://your-domain.com/api/health

---

**For implementation details, see the respective documentation files.**
