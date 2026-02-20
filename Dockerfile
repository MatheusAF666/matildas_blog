# syntax=docker/dockerfile:1

FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
COPY app app
COPY bootstrap bootstrap
COPY config config
COPY database database
COPY routes routes
COPY resources resources
COPY artisan artisan
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

FROM php:8.2-cli
WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip gd \
  && rm -rf /var/lib/apt/lists/*

COPY . .
COPY --from=vendor /app/vendor /var/www/html/vendor

RUN mkdir -p bootstrap/cache storage/logs storage/framework/{cache,sessions,views} \
  && chmod -R 775 bootstrap/cache storage \
  && chown -R www-data:www-data storage bootstrap

ENV APP_ENV=production
ENV APP_DEBUG=false
EXPOSE 8000

CMD ["sh", "-c", "mkdir -p bootstrap/cache storage/logs storage/framework/{cache,sessions,views}; chmod -R 775 bootstrap/cache storage; php artisan storage:link || true; php artisan migrate --force || true; php -S 0.0.0.0:${PORT:-8000} -t public"]
