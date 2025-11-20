# 🚀 ResumeNest Deployment Guide

Complete guide for deploying ResumeNest with Docker + CI/CD to AWS EC2, Render, or Self-Hosted VPS.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start - Local Development](#quick-start---local-development)
3. [Docker Deployment Options](#docker-deployment-options)
4. [AWS EC2 Deployment](#aws-ec2-deployment)
5. [Render Deployment](#render-deployment)
6. [Self-Hosted VPS Deployment](#self-hosted-vps-deployment)
7. [GitHub Actions CI/CD Setup](#github-actions-cicd-setup)
8. [Environment Variables](#environment-variables)
9. [Troubleshooting](#troubleshooting)
10. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🔧 Prerequisites

### Required Software
- **Docker** (v24.0+) & **Docker Compose** (v2.0+)
- **Git**
- **Node.js** (v20+) - for local development only

### For Production Deployment
- **Domain name** (optional but recommended)
- **SSL certificate** (Let's Encrypt recommended)
- **Server** with minimum:
  - 2 CPU cores
  - 2GB RAM
  - 20GB storage
  - Ubuntu 22.04 LTS (recommended)

---

## 🏃 Quick Start - Local Development

### 1. Clone the Repository
```bash
git clone https://github.com/Lochan-01/ResumeNest.git
cd ResumeNest
```

### 2. Setup Environment Variables
```bash
# Copy sample environment file
cp .env.sample .env

# Edit .env file with your settings
nano .env
```

### 3. Start Development Environment
```bash
# Build and start all services
docker compose up -d

# View logs
docker compose logs -f

# Check service status
docker compose ps
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **MongoDB**: localhost:27017

### 5. Stop Services
```bash
# Stop all services
docker compose down

# Stop and remove volumes (⚠️ destroys data)
docker compose down -v
```

---

## 🐳 Docker Deployment Options

### Development Mode (Hot Reload Enabled)
```bash
docker compose up -d
```

### Production Mode
```bash
docker compose -f docker-compose.prod.yml up -d
```

### Rebuild After Code Changes
```bash
# Development
docker compose up -d --build

# Production
docker compose -f docker-compose.prod.yml up -d --build
```

---

## ☁️ AWS EC2 Deployment

### Step 1: Launch EC2 Instance

1. **Go to AWS Console** → EC2 → Launch Instance
2. **Choose AMI**: Ubuntu Server 22.04 LTS
3. **Instance Type**: t3.small or larger (recommended: t3.medium)
4. **Storage**: 20GB GP3
5. **Security Group Rules**:
   ```
   SSH       | TCP | 22    | Your IP
   HTTP      | TCP | 80    | 0.0.0.0/0
   HTTPS     | TCP | 443   | 0.0.0.0/0
   Custom    | TCP | 3000  | 0.0.0.0/0 (optional, for direct API access)
   ```

### Step 2: Connect to EC2
```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y
```

### Step 3: Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version

# Logout and login again
exit
```

### Step 4: Setup Application
```bash
# Clone repository
git clone https://github.com/Lochan-01/ResumeNest.git
cd ResumeNest

# Setup environment
cp .env.production.sample .env.production
nano .env.production
```

**Edit `.env.production` with:**
```env
NODE_ENV=production
BUILD_TARGET=production

# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=STRONG_PASSWORD_HERE
MONGO_DATABASE=resume-builder

# Backend
JWT_SECRET=GENERATE_RANDOM_32_CHAR_SECRET_HERE
OPENAI_API_KEY=your-openai-key

# Frontend
VITE_API_URL=/api
```

### Step 5: Deploy
```bash
# Build and start services
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

### Step 6: Setup Nginx Reverse Proxy (Optional)
```bash
# Install Nginx
sudo apt install nginx -y

# Create config
sudo nano /etc/nginx/sites-available/resumenest
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/resumenest /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Setup SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

### Step 8: Setup Auto-Start on Boot
```bash
# Create systemd service
sudo nano /etc/systemd/system/resumenest.service
```

**Service file:**
```ini
[Unit]
Description=ResumeNest Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/ResumeNest
ExecStart=/usr/bin/docker compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.prod.yml down

[Install]
WantedBy=multi-user.target
```

```bash
# Enable service
sudo systemctl enable resumenest
sudo systemctl start resumenest
sudo systemctl status resumenest
```

---

## 🎨 Render Deployment

### Option 1: Docker Deployment on Render

1. **Create `render.yaml`** (already exists in repo):
```yaml
services:
  - type: web
    name: resumenest-frontend
    runtime: docker
    dockerfilePath: ./frontend/Dockerfile
    dockerContext: ./frontend
    envVars:
      - key: VITE_API_URL
        value: /api

  - type: web
    name: resumenest-backend
    runtime: docker
    dockerfilePath: ./backend/Dockerfile
    dockerContext: ./backend
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        fromDatabase:
          name: resumenest-mongodb
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: OPENAI_API_KEY
        sync: false

databases:
  - name: resumenest-mongodb
    databaseName: resume-builder
    plan: starter
```

2. **Deploy to Render**:
   - Go to https://render.com
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml`
   - Click "Apply"

3. **Set Environment Variables**:
   - Go to each service → Environment
   - Add missing variables (OPENAI_API_KEY, etc.)

4. **Get Deploy Hook URL**:
   - Settings → Deploy Hook → Copy URL
   - Add to GitHub Secrets as `RENDER_DEPLOY_HOOK_URL`

---

## 🖥️ Self-Hosted VPS Deployment

Works for **DigitalOcean**, **Linode**, **Vultr**, **Hetzner**, etc.

### Step 1: Provision VPS
- **OS**: Ubuntu 22.04 LTS
- **RAM**: Minimum 2GB
- **Storage**: 20GB+

### Step 2: Initial Server Setup
```bash
# Connect to VPS
ssh root@your-vps-ip

# Create non-root user
adduser deploy
usermod -aG sudo deploy
su - deploy

# Setup SSH key (from your local machine)
ssh-copy-id deploy@your-vps-ip
```

### Step 3: Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker deploy
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify
docker --version
docker compose version
```

### Step 4: Setup Firewall
```bash
# Setup UFW
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

### Step 5: Deploy Application
```bash
# Clone repo
cd ~
git clone https://github.com/Lochan-01/ResumeNest.git
cd ResumeNest

# Setup environment
cp .env.production.sample .env
nano .env
```

### Step 6: Start Services
```bash
# Build and start
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose -f docker-compose.prod.yml ps
```

### Step 7: Setup Domain & SSL
Follow the same Nginx + Certbot steps from AWS EC2 section above.

---

## 🔄 GitHub Actions CI/CD Setup

### Step 1: Add GitHub Secrets

Go to: **Repository → Settings → Secrets and variables → Actions**

#### For Docker Hub Deployment:
```
DOCKERHUB_USERNAME=your-dockerhub-username
DOCKERHUB_TOKEN=your-dockerhub-access-token
```

#### For AWS EC2 Deployment:
```
EC2_HOST=your-ec2-public-ip
EC2_USER=ubuntu
EC2_SSH_KEY=<paste your private key>
EC2_APP_DIR=/home/ubuntu/ResumeNest
```

#### For VPS Deployment:
```
VPS_HOST=your-vps-ip
VPS_USER=deploy
VPS_SSH_KEY=<paste your private key>
VPS_APP_DIR=/home/deploy/ResumeNest
```

#### For Render Deployment:
```
RENDER_DEPLOY_HOOK_URL=https://api.render.com/deploy/srv-xxx
```

#### Optional - Slack Notifications:
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
```

### Step 2: Workflow Triggers

**CI Pipeline** (`.github/workflows/ci.yml`):
- Runs on Pull Requests
- Runs linting, type checking, builds
- Does NOT push Docker images

**CD Pipeline** (`.github/workflows/cd.yml`):
- Runs on push to `main` branch
- Builds & pushes Docker images
- Deploys to production

### Step 3: Manual Deployment Trigger
```bash
# From GitHub UI
Actions → CD Pipeline → Run workflow → Select branch → Run
```

---

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://user:pass@host:27017/db` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | Random string |
| `VITE_API_URL` | Frontend API URL | `/api` or `https://api.domain.com/api` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for suggestions | None |
| `PORT` | Backend port | `3000` |
| `FRONTEND_PORT` | Frontend port | `5173` (dev) / `80` (prod) |

### Generating Secure Secrets
```bash
# Generate random 32-character secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🐛 Troubleshooting

### Issue: Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :3000

# Stop the process
sudo kill -9 <PID>
```

### Issue: MongoDB Connection Failed
```bash
# Check MongoDB logs
docker compose logs mongodb

# Restart MongoDB
docker compose restart mongodb

# Check connection string in .env
```

### Issue: Frontend Can't Connect to Backend
```bash
# Check backend is running
curl http://localhost:3000/api/health

# Verify VITE_API_URL in frontend .env
# For production, use: VITE_API_URL=/api
```

### Issue: Docker Build Failed
```bash
# Clear Docker cache
docker builder prune -af

# Rebuild from scratch
docker compose build --no-cache
```

### Issue: Database Data Lost
```bash
# Use named volumes (already configured)
docker compose down  # Does NOT delete data
docker compose down -v  # DELETES data - be careful!
```

---

## 📊 Monitoring & Maintenance

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend

# Last 100 lines
docker compose logs --tail=100 backend
```

### Check Resource Usage
```bash
# Container stats
docker stats

# Disk usage
docker system df
```

### Backup Database
```bash
# Backup MongoDB
docker compose exec mongodb mongodump --archive=/data/backup.archive --db=resume-builder

# Copy backup to host
docker cp resumenest-mongodb:/data/backup.archive ./backup-$(date +%Y%m%d).archive
```

### Restore Database
```bash
# Copy backup to container
docker cp backup.archive resumenest-mongodb:/data/

# Restore
docker compose exec mongodb mongorestore --archive=/data/backup.archive
```

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build

# Check status
docker compose -f docker-compose.prod.yml ps
```

### Cleanup Old Images
```bash
# Remove unused images
docker image prune -af

# Remove unused volumes
docker volume prune -f

# Full cleanup
docker system prune -af --volumes
```

---

## 🎯 Health Checks

### Backend Health Check
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "Server is running ✅",
  "timestamp": "2025-11-20T..."
}
```

### Frontend Health Check
```bash
curl http://localhost/health
```

### MongoDB Health Check
```bash
docker compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

---

## 🆘 Need Help?

- **GitHub Issues**: https://github.com/Lochan-01/ResumeNest/issues
- **Email**: your-email@example.com

---

## 📝 License

MIT License - see LICENSE file for details
