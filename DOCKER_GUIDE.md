# 🐳 Docker Setup Guide for ResumeNest

Complete Docker reference for development and production deployment.

---

## 📦 What's Included

- **Frontend Dockerfile** - Multi-stage build with Nginx
- **Backend Dockerfile** - Node.js with TypeScript compilation
- **docker-compose.yml** - Development environment with hot-reload
- **docker-compose.prod.yml** - Production-optimized setup
- **MongoDB** - Containerized database with persistence

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Network                       │
│                   (resumenest-network)                   │
│                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────┐ │
│  │   Frontend   │    │   Backend    │    │ MongoDB  │ │
│  │   (Nginx)    │◄───┤  (Node.js)   │◄───┤          │ │
│  │   Port 80    │    │   Port 3000  │    │ Port 27017│ │
│  └──────────────┘    └──────────────┘    └──────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Commands

### Development
```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Restart a service
docker compose restart backend

# Stop all services
docker compose down
```

### Production
```bash
# Build and start
docker compose -f docker-compose.prod.yml up -d --build

# Scale backend (multiple instances)
docker compose -f docker-compose.prod.yml up -d --scale backend=3

# Stop
docker compose -f docker-compose.prod.yml down
```

---

## 📝 Dockerfile Explanation

### Frontend Dockerfile

**Development Stage:**
- Uses Node 20 Alpine (lightweight)
- Installs all dependencies including dev tools
- Mounts source code for hot-reload
- Runs Vite dev server on port 5173

**Production Stage:**
- Multi-stage build reduces image size
- Compiles TypeScript + bundles assets
- Serves static files with Nginx
- Includes security headers
- Gzip compression enabled
- Health check endpoint

**Image Size Comparison:**
- Development: ~500MB (includes dev dependencies)
- Production: ~25MB (optimized with multi-stage build)

### Backend Dockerfile

**Development Stage:**
- Node 20 Alpine base
- Installs all dependencies
- Uses ts-node for runtime TypeScript execution
- Hot-reload with nodemon (via npm run dev)

**Production Stage:**
- Multi-stage build
- Compiles TypeScript to JavaScript
- Only production dependencies
- Non-root user for security
- dumb-init for proper signal handling
- Health check endpoint

**Image Size Comparison:**
- Development: ~400MB
- Production: ~150MB

---

## 🔧 Docker Compose Services

### MongoDB Service
```yaml
mongodb:
  image: mongo:7.0
  environment:
    - MONGO_INITDB_ROOT_USERNAME
    - MONGO_INITDB_ROOT_PASSWORD
  volumes:
    - mongodb_data:/data/db  # Persisted data
  healthcheck:
    test: mongosh ping
```

### Backend Service
```yaml
backend:
  build:
    context: ./backend
    target: development  # or production
  environment:
    - MONGODB_URI
    - JWT_SECRET
  volumes:
    - ./backend/src:/app/src  # Hot-reload in dev
  depends_on:
    - mongodb
```

### Frontend Service
```yaml
frontend:
  build:
    context: ./frontend
    target: development  # or production
  environment:
    - VITE_API_URL
  volumes:
    - ./frontend/src:/app/src  # Hot-reload in dev
  depends_on:
    - backend
```

---

## 📊 Volume Management

### Named Volumes
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect resumenest_mongodb_data

# Backup volume
docker run --rm -v resumenest_mongodb_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/mongodb-backup.tar.gz -C /data .

# Restore volume
docker run --rm -v resumenest_mongodb_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/mongodb-backup.tar.gz -C /data
```

---

## 🔍 Debugging

### Access Container Shell
```bash
# Backend
docker compose exec backend sh

# Frontend
docker compose exec frontend sh

# MongoDB
docker compose exec mongodb mongosh
```

### View Container Details
```bash
# Inspect container
docker compose exec backend env

# Check running processes
docker compose exec backend ps aux

# View filesystem
docker compose exec backend ls -la
```

### Network Debugging
```bash
# Test connectivity from backend to mongodb
docker compose exec backend ping mongodb

# Test API from frontend container
docker compose exec frontend wget -O- http://backend:3000/api/health
```

---

## 🛠️ Build Options

### Build with Custom Target
```bash
# Development build
docker compose build --build-arg BUILD_TARGET=development

# Production build
docker compose -f docker-compose.prod.yml build
```

### No Cache Build
```bash
docker compose build --no-cache
```

### Rebuild Single Service
```bash
docker compose up -d --build backend
```

---

## 🎯 Environment Variables

### Set at Runtime
```bash
# Override environment variables
BACKEND_PORT=4000 docker compose up -d
```

### Using .env File
```bash
# Docker Compose automatically reads .env file
# Create from sample:
cp .env.sample .env
nano .env
```

---

## 📈 Performance Optimization

### Multi-Stage Builds
- **Stage 1 (Builder)**: Install deps, compile code
- **Stage 2 (Production)**: Copy only needed artifacts
- Result: 50-80% smaller images

### Layer Caching
```dockerfile
# Copy package files first (changes less often)
COPY package*.json ./
RUN npm ci

# Copy source code (changes more often)
COPY . .
```

### BuildKit Features
```bash
# Enable BuildKit for better caching
DOCKER_BUILDKIT=1 docker compose build
```

---

## 🔐 Security Best Practices

### ✅ Implemented in Our Dockerfiles

1. **Non-root User**
   ```dockerfile
   RUN addgroup -g 1001 -S nodejs && \
       adduser -S nodejs -u 1001
   USER nodejs
   ```

2. **Minimal Base Images**
   - Using `alpine` (5MB vs 100MB+)

3. **No Secrets in Images**
   - All secrets via environment variables

4. **Read-only Volumes**
   ```yaml
   volumes:
     - ./src:/app/src:ro  # Read-only
   ```

5. **Health Checks**
   - Automatic container restart on failure

### Additional Security
```bash
# Scan images for vulnerabilities
docker scan resumenest-backend:latest

# Use Docker Content Trust
export DOCKER_CONTENT_TRUST=1
```

---

## 🐞 Common Issues & Solutions

### Issue: Container Keeps Restarting
```bash
# Check logs
docker compose logs backend

# Common causes:
# - Port already in use
# - Environment variable missing
# - MongoDB not ready (health check failing)
```

### Issue: Changes Not Reflecting
```bash
# Rebuild the service
docker compose up -d --build

# Clear all caches
docker compose down
docker builder prune -af
docker compose up -d --build
```

### Issue: MongoDB Connection Failed
```bash
# Check if MongoDB is healthy
docker compose ps

# Check connection string
docker compose exec backend env | grep MONGODB

# Verify MongoDB is accessible
docker compose exec backend ping mongodb
```

### Issue: Out of Disk Space
```bash
# Check usage
docker system df

# Clean up
docker system prune -af
docker volume prune -f
```

---

## 📊 Monitoring

### Container Stats
```bash
# Real-time stats
docker stats

# Specific container
docker stats resumenest-backend
```

### Health Status
```bash
# All services
docker compose ps

# Detailed inspection
docker inspect --format='{{json .State.Health}}' resumenest-backend | jq
```

### Resource Limits
Set in `docker-compose.prod.yml`:
```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

---

## 🔄 CI/CD Integration

### GitHub Actions
Our CI/CD automatically:
1. Builds Docker images
2. Runs tests inside containers
3. Pushes to GitHub Container Registry
4. Deploys to production servers

### Manual Registry Push
```bash
# Tag image
docker tag resumenest-backend:latest ghcr.io/lochan-01/resumenest-backend:latest

# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Push
docker push ghcr.io/lochan-01/resumenest-backend:latest
```

---

## 🎓 Advanced Usage

### Multi-Platform Builds
```bash
# Build for AMD64 and ARM64
docker buildx build --platform linux/amd64,linux/arm64 \
  -t resumenest-backend:latest \
  ./backend
```

### Custom Networks
```bash
# Create network
docker network create resumenest-custom

# Connect container
docker network connect resumenest-custom resumenest-backend
```

### Using Docker Secrets
```bash
# Create secret
echo "my-secret-password" | docker secret create db_password -

# Use in compose (requires swarm mode)
docker swarm init
docker stack deploy -c docker-compose.prod.yml resumenest
```

---

## 📚 Useful Commands Reference

```bash
# Build
docker compose build
docker compose build --no-cache

# Start
docker compose up -d
docker compose up -d --build

# Stop
docker compose down
docker compose down -v  # Remove volumes too

# Logs
docker compose logs -f
docker compose logs -f backend
docker compose logs --tail=100

# Shell access
docker compose exec backend sh
docker compose exec mongodb mongosh

# Stats
docker stats
docker compose ps

# Clean up
docker system prune -af
docker volume prune -f
docker builder prune -af
```

---

## 🆘 Getting Help

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Happy Dockerizing! 🐳**
