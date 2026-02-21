# ==========================================
# FLORCA CLIENT - MULTI-STAGE DOCKERFILE
# ==========================================

# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

# ==========================================
# Stage 2: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env vars (API URL for rewrites)
ARG BACKEND_URL=http://server:8000
ENV BACKEND_URL=${BACKEND_URL}

RUN npm run build

# ==========================================
# Stage 3: Runner (Production)
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Standalone output is in .next/standalone/client/ due to monorepo workspace
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/client/server.js ./server.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/client/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Runtime env var for API rewrites
ENV BACKEND_URL=http://server:8000

CMD ["node", "server.js"]
