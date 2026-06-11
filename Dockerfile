# === STAGE 1: Build React Frontend ===
FROM node:20 AS frontend-builder
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps && npm run build

# === STAGE 2: Setup PHP Laravel Backend ===
FROM serversideup/php:8.4-fpm-nginx
WORKDIR /var/www/html

# Copy project files and set correct permissions
COPY --chown=www-data:www-data . .

# Copy compiled frontend assets from STAGE 1
COPY --from=frontend-builder /app/public/build ./public/build

# Install backend PHP packages securely
RUN composer install --no-dev --optimize-autoloader

# Expose required web port
EXPOSE 8080

# 👉 FIXED: Completely drop manual startup overrides. 
# The image handles Nginx and PHP natively.
