# POS Coffee Shop Backend

Laravel 12 REST API for the POS Coffee Shop application.

## Main Stack

- Laravel 12
- Laravel Sanctum token authentication
- MySQL for application data
- PHPUnit for feature and API tests

## Useful Commands

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan test
```

API routes are registered under `/api/v1`. See `../docs/api-overview.md` for endpoint details.
