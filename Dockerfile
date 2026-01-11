# Multi-stage build for production

# ===== Backend Build =====
FROM node:18-alpine AS server-build

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./

# ===== Frontend Build =====
FROM node:18-alpine AS client-build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ===== Production Image =====
FROM node:18-alpine AS production

WORKDIR /app

# Copy backend
COPY --from=server-build /app/server ./server

# Copy frontend build
COPY --from=client-build /app/client/dist ./client/dist

# Install serve for static files
RUN npm install -g serve

# Create start script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'cd /app/server && node src/index.js &' >> /app/start.sh && \
    echo 'cd /app/client && serve -s dist -l 5173 &' >> /app/start.sh && \
    echo 'wait' >> /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 5000 5173

CMD ["/app/start.sh"]
