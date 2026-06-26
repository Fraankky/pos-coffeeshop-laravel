FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

COPY . .
RUN composer dump-autoload --optimize

FROM php:8.3-apache

WORKDIR /var/www/html

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gettext-base \
        libzip-dev \
        unzip \
    && docker-php-ext-install pdo_mysql zip \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*

COPY --from=vendor /app /var/www/html
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
COPY docker/entrypoint.sh /usr/local/bin/render-entrypoint

RUN chmod +x /usr/local/bin/render-entrypoint \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 10000

ENTRYPOINT ["render-entrypoint"]
CMD ["apache2-foreground"]
