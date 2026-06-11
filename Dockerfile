# === STAGE 1: Build React Frontend ===
# Use Node.js image to compile the frontend assets
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copy all project files into the node container
COPY . .

# Install frontend packages and compile React assets into static files
RUN npm install --legacy-peer-deps && npm run build

# === STAGE 2: Setup PHP Laravel Backend ===
# Use the official serversideup PHP image with Nginx integrated
FROM serversideup/php:8.3-fpm-nginx
WORKDIR /var/www/html

# Copy all project files and set correct permissions for www-data user
COPY --chown=www-data:www-data . .

# Copy the compiled React assets from STAGE 1 into Laravel's public folder
COPY --from=frontend-builder /app/public/build ./public/build

# Install backend PHP packages securely for production environment
RUN composer install --no-dev --optimize-autoloader

# Expose port 8080 as required by Render.com
EXPOSE 8080
