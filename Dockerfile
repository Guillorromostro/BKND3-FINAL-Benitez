# syntax=docker/dockerfile:1

# Debian-based image is more compatible with mongodb-memory-server binaries
FROM node:18-bullseye-slim

WORKDIR /app

# System deps required by mongodb-memory-server binaries
RUN apt-get update \
	&& apt-get install -y --no-install-recommends libcurl4 ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY src ./src
COPY public ./public
COPY README.md ./README.md
COPY .env.example ./.env.example

ENV NODE_ENV=production
ENV PORT=3000
# Pin MongoDB version for mongodb-memory-server compatibility inside container
ENV MONGOMS_VERSION=6.0.13
EXPOSE 3000

CMD ["node", "src/index.js"]
