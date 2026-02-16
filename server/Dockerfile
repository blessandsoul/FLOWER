# ==========================================
# FLOWER SERVER - MULTI-STAGE DOCKERFILE
# ==========================================

# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy prisma schema first (for generate)
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# ==========================================
# Stage 2: Runner (Production)
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 fastify

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy PM2 config
COPY ecosystem.config.cjs ./

# Create uploads directory
RUN mkdir -p uploads && chown -R fastify:nodejs uploads

# Switch to non-root user
USER fastify

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:8000/api/v1/health || exit 1

# Start with dumb-init for proper signal handling
# Runs migrations then starts PM2 in cluster mode
CMD ["dumb-init", "sh", "-c", "npx prisma migrate deploy && npx pm2-runtime ecosystem.config.cjs"]
