# === STAGE 1: Build React Frontend ===
FROM node:20 AS frontend-builder
WORKDIR /app
COPY . .

# 👉 ADDED: Install explicit Linux bindings for Vite 8 / Rolldown compiler compatibility
RUN npm install @rolldown/binding-linux-x64-gnu --save-optional

# Install frontend packages and compile assets
RUN npm install --legacy-peer-deps && npm run build

# === STAGE 2: Setup PHP Laravel Backend ===
FROM serversideup/php:8.3-fpm-nginx
WORKDIR /var/www/html

# Copy project files and set permissions
COPY --chown=www-data:www-data . .

# Copy compiled frontend assets from STAGE 1
COPY --from=frontend-builder /app/public/build ./public/build

# Install backend PHP packages securely
RUN composer install --no-dev --optimize-autoloader

# Expose required web port
EXPOSE 8080
