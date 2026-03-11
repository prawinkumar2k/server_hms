FROM node:20-alpine

# Install dependencies for Puppeteer (Chromium)
# Installs: chromium, nss, freetype, harfbuzz, ca-certificates, ttf-freefont, nodejs, yarn
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install
# Note: In a real CI, use npm ci, but without lockfile sync it might fail potentially. 
# Using npm install is safer if lockfile is out of date.

COPY . .

# Create logs directory and database storage directories if mapped
RUN mkdir -p logs

EXPOSE 3000

# Use array syntax for CMD to handle signals correctly
CMD ["node", "server.js"]
