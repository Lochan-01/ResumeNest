# ================================
# Backend Dockerfile
# Multi-stage build for production optimization
# ================================

# ========== Stage 1: Build Stage ==========
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# ========== Stage 2: Production Stage ==========
FROM node:20-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built JavaScript from builder
COPY --from=builder /app/dist ./dist

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]

# ========== Development Stage (for docker-compose) ==========
FROM node:20-alpine AS development

WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Use dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Start development server with hot reload
CMD ["npm", "run", "dev"]
