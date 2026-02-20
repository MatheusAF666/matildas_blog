# syntax=docker/dockerfile:1

FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock .env.example ./
COPY app app
COPY bootstrap bootstrap
COPY config config
COPY database database
COPY routes routes
COPY resources resources
COPY artisan artisan
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

FROM php:8.2-cli AS node-builder
WORKDIR /app
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
  && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci
COPY resources resources
COPY public public
COPY vite.config.ts tsconfig.json ./
COPY --from=vendor /app/vendor /app/vendor
COPY --from=vendor /app/app /app/app
COPY --from=vendor /app/bootstrap /app/bootstrap
COPY --from=vendor /app/config /app/config
COPY --from=vendor /app/routes /app/routes
COPY --from=vendor /app/database /app/database
COPY --from=vendor /app/artisan /app/artisan
COPY --from=vendor /app/.env.example /app/.env
RUN php artisan key:generate
RUN npm run build

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
COPY --from=node-builder /app/public/build /var/www/html/public/build

RUN chown -R www-data:www-data storage bootstrap/cache

ENV APP_ENV=production
ENV APP_DEBUG=false
EXPOSE 8000

CMD ["sh", "-c", "php artisan storage:link || true; php artisan migrate --force || true; php -S 0.0.0.0:${PORT:-8000} -t public"]
