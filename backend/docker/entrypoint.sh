#!/usr/bin/env sh
set -e

PORT="${PORT:-10000}"

sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
envsubst '${PORT}' < /etc/apache2/sites-available/000-default.conf > /tmp/000-default.conf
mv /tmp/000-default.conf /etc/apache2/sites-available/000-default.conf

php artisan config:clear --no-interaction || true
php artisan route:clear --no-interaction || true
php artisan view:clear --no-interaction || true
php artisan config:cache --no-interaction || true
php artisan route:cache --no-interaction || true
php artisan view:cache --no-interaction || true

exec "$@"
