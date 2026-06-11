# === STAGE 1: Build React Frontend ===
FROM node:20 AS frontend-builder
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps && npm run build

# === STAGE 2: Setup PHP Laravel Backend ===
FROM serversideup/php:8.3-fpm-nginx
WORKDIR /var/www/html
COPY --chown=www-data:www-data . .
COPY --from=frontend-builder /app/public/build ./public/build
RUN composer install --no-dev --optimize-autoloader
EXPOSE 8080
