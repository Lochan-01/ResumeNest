# 📄 ResumeNest - Smart AI-Powered Resume Builder

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green?logo=github)](https://github.com/features/actions)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack AI-powered smart resume builder with professional templates, real-time editing, AI content suggestions, and PDF export functionality.

## ✨ Features

- 🎨 **Multiple Professional Templates** - Choose from modern, classic, and creative designs
- 🤖 **AI-Powered Suggestions** - Get intelligent content recommendations
- ✏️ **Real-time Editing** - See changes instantly with live preview
- 📄 **PDF Export** - Download professional PDFs of your resume
- 🔐 **Secure Authentication** - JWT-based user authentication
- 💾 **Cloud Storage** - Save and manage multiple resumes
- 🐳 **Docker Ready** - Easy deployment with Docker Compose
- 🚀 **CI/CD Pipeline** - Automated testing and deployment

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **Node.js & Express** - RESTful API server
- **TypeScript** - Type-safe backend
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **Mongoose** - MongoDB ODM

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipelines
- **Nginx** - Reverse proxy & static file serving

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

#### Prerequisites
- Docker (v24.0+)
- Docker Compose (v2.0+)

#### Setup
```bash
# Clone repository
git clone https://github.com/Lochan-01/ResumeNest.git
cd ResumeNest

# Run setup script
./setup.sh
# Or on Windows: setup.bat

# Or manually:
cp .env.sample .env
docker compose up -d
```

#### Access
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000
- **Health Check:** http://localhost:3000/api/health

### Option 2: Local Development (Without Docker)

#### Prerequisites
- Node.js (v20+)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

#### Installation
```bash
# Install all dependencies
npm run install-all

# Setup environment variables
cp backend/.env.sample backend/.env
cp frontend/.env.sample frontend/.env

# Start MongoDB (if local)
mongod

# Start development servers
npm run dev
```

## 📦 Docker Commands

### Development Mode
```bash
# Start all services with hot-reload
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Production Mode
```bash
# Build and start production services
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose -f docker-compose.prod.yml ps
```

## 🚢 Deployment

### Supported Platforms
- ☁️ **AWS EC2** - Full control deployment
- 🎨 **Render** - Zero-config deployment
- 🖥️ **VPS** - Self-hosted (DigitalOcean, Linode, Vultr, etc.)

### Quick Deploy to Production

1. **Setup environment:**
```bash
cp .env.production.sample .env.production
nano .env.production  # Edit with your secrets
```

2. **Choose deployment method:**
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides
   - AWS EC2: Complete step-by-step
   - Render: One-click deployment
   - VPS: Docker Compose setup

3. **Setup CI/CD:**
   - Add GitHub secrets (see [DOCKER_CICD_README.md](DOCKER_CICD_README.md))
   - Push to main → Auto-deploy! 🚀

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=your-secret-key-min-32-chars
OPENAI_API_KEY=sk-your-openai-key  # Optional
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

See `.env.sample` files for complete configurations.

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide (AWS, Render, VPS)
- **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** - Docker best practices & reference
- **[DOCKER_CICD_README.md](DOCKER_CICD_README.md)** - CI/CD setup & workflows
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development guidelines
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Codebase overview

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# E2E tests (Docker required)
docker compose up -d
npm run test:e2e
```

### CI Pipeline
Pull requests automatically run:
- ✅ Linting
- ✅ Type checking
- ✅ Build validation
- ✅ Docker image builds
- ✅ Security scans

## 🛠️ Development

### Project Structure
```
ResumeNest/
├── frontend/          # React + Vite frontend
├── backend/           # Express.js backend
├── shared/            # Shared types
├── .github/           # CI/CD workflows
├── docker-compose.yml # Development setup
└── docs/              # Documentation
```

### Available Scripts

#### Root Level
```bash
npm run install-all    # Install all dependencies
npm run dev           # Start dev servers
npm run build         # Build for production
```

#### Frontend
```bash
npm run dev           # Start Vite dev server
npm run build         # Build production bundle
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

#### Backend
```bash
npm run dev           # Start with hot-reload
npm run build         # Compile TypeScript
npm run start         # Start production server
npm run type-check    # TypeScript validation
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure CI pipeline passes

## 📊 CI/CD Pipeline

### CI (Pull Requests)
- Linting & type checking
- Build validation
- Docker image builds (no push)
- Security scanning

### CD (Main Branch)
- Build & push Docker images
- Deploy to production
- Automated testing
- Notifications

See [DOCKER_CICD_README.md](DOCKER_CICD_README.md) for setup instructions.

## 🔐 Security

- 🔒 JWT-based authentication
- 🛡️ Input validation & sanitization
- 🔑 Environment-based secrets
- 👤 Non-root Docker containers
- 🔐 HTTPS ready (with Nginx)
- 📊 Regular dependency audits

## 📈 Performance

- ⚡ Multi-stage Docker builds (95% size reduction)
- 🗜️ Gzip compression
- 💾 Efficient caching strategies
- 🚀 CDN-ready static assets
- 📦 Code splitting & lazy loading

## 🗺️ Roadmap

- [ ] AI-powered resume analysis
- [ ] More template designs
- [ ] LinkedIn import
- [ ] ATS score checker
- [ ] Cover letter generator
- [ ] Multi-language support
- [ ] Resume sharing links

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI suggestions
- MongoDB for database
- Docker for containerization
- GitHub Actions for CI/CD
- All open-source contributors

## 📧 Contact

- **GitHub:** [@Lochan-01](https://github.com/Lochan-01)
- **Issues:** [GitHub Issues](https://github.com/Lochan-01/ResumeNest/issues)

## ⭐ Star History

If you find this project helpful, please consider giving it a star! ⭐

---

**Made with ❤️ by Lochan**

[Report Bug](https://github.com/Lochan-01/ResumeNest/issues) · [Request Feature](https://github.com/Lochan-01/ResumeNest/issues)
