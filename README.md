# POS Coffee Shop — Laravel + React

> Point-of-Sale system for campus coffee shop. Open-source, MIT licensed.

## Architecture

```
pos-laravel/
├── backend/     # Laravel 11 REST API (PHP 8.2+)
├── frontend/    # React 18 SPA (TypeScript + Vite)
└── docker/      # Docker Compose (PHP-FPM, Nginx, MySQL)
```

## Quick Start

```bash
# 1. Clone & enter
git clone https://github.com/your-org/pos-laravel
cd pos-laravel

# 2. Start Docker services
docker compose up -d

# 3. Install backend dependencies
docker compose exec php composer install

# 4. Run migrations & seeders
docker compose exec php php artisan migrate --seed

# 5. Start frontend
cd frontend && npm install && npm run dev
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 11 + PHP 8.2 |
| Database | MySQL 8 |
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Container | Docker Compose |

## License

MIT
