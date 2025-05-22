# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci --omit=dev

# Copy source files
COPY src ./src
COPY .env ./

# Build TypeScript
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app

# Install production dependencies only
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./

# Security hardening
RUN apk add --no-cache dumb-init && \
    chown -R node:node /app && \
    chmod -R 755 /app

USER node

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node dist/healthcheck.js

EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/app.js"]
