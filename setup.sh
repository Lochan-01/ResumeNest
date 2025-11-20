#!/bin/bash

# ================================
# ResumeNest Quick Setup Script
# ================================

set -e

echo "🚀 ResumeNest Docker Setup"
echo "=========================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose is not installed!"
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker found: $(docker --version)"
echo "✅ Docker Compose found: $(docker compose version)"
echo ""

# Ask for environment
echo "Select environment:"
echo "1) Development (with hot-reload)"
echo "2) Production"
read -p "Enter choice [1-2]: " env_choice

if [ "$env_choice" == "2" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    ENV_FILE=".env.production"
    ENV_SAMPLE=".env.production.sample"
    echo "📦 Production mode selected"
else
    COMPOSE_FILE="docker-compose.yml"
    ENV_FILE=".env"
    ENV_SAMPLE=".env.sample"
    echo "🔧 Development mode selected"
fi

echo ""

# Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️  Environment file not found!"
    if [ -f "$ENV_SAMPLE" ]; then
        echo "Creating $ENV_FILE from $ENV_SAMPLE..."
        cp "$ENV_SAMPLE" "$ENV_FILE"
        echo "✅ Created $ENV_FILE"
        echo ""
        echo "⚠️  IMPORTANT: Please edit $ENV_FILE with your settings!"
        echo "Required changes:"
        echo "  - MONGO_ROOT_PASSWORD (change from default)"
        echo "  - JWT_SECRET (use strong random string)"
        echo "  - OPENAI_API_KEY (if using AI features)"
        echo ""
        read -p "Press Enter after you've edited $ENV_FILE, or press Ctrl+C to exit and edit later..."
    else
        echo "❌ $ENV_SAMPLE not found!"
        exit 1
    fi
fi

echo ""
echo "🏗️  Building Docker images..."
docker compose -f "$COMPOSE_FILE" build

echo ""
echo "🚀 Starting services..."
docker compose -f "$COMPOSE_FILE" up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

echo ""
echo "📊 Service Status:"
docker compose -f "$COMPOSE_FILE" ps

echo ""
echo "✅ Setup Complete!"
echo ""

if [ "$env_choice" == "2" ]; then
    echo "🌐 Frontend: http://localhost"
    echo "🔌 Backend API: http://localhost:3000/api/health"
else
    echo "🌐 Frontend: http://localhost:5173"
    echo "🔌 Backend API: http://localhost:3000/api/health"
fi

echo "🗄️  MongoDB: localhost:27017"
echo ""
echo "📝 Useful commands:"
echo "  View logs:       docker compose -f $COMPOSE_FILE logs -f"
echo "  Stop services:   docker compose -f $COMPOSE_FILE down"
echo "  Restart:         docker compose -f $COMPOSE_FILE restart"
echo "  Shell access:    docker compose -f $COMPOSE_FILE exec backend sh"
echo ""
echo "📚 For more information, see:"
echo "  - DEPLOYMENT.md (deployment guide)"
echo "  - DOCKER_GUIDE.md (Docker reference)"
echo "  - DOCKER_CICD_README.md (quick reference)"
echo ""
echo "🎉 Happy coding!"
