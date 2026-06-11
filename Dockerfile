FROM serversideup/php:8.3-fpm-nginx

# Set working directory
WORKDIR /var/www/html

# Copy all project files
COPY --chown=www-data:www-data . .

# Install PHP and Node dependencies, then build React
RUN composer install --no-dev --optimize-autoloader && \
    npm install && \
    npm run build

# Expose port
EXPOSE 8080