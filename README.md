# POS Coffee Shop — Laravel + React

![Tests](https://github.com/farisqi/pos-laravel/actions/workflows/backend.yml/badge.svg)
![Build](https://github.com/farisqi/pos-laravel/actions/workflows/frontend.yml/badge.svg)

> Point-of-Sale system for campus coffee shop. Open-source, MIT licensed.

## Architecture

```
pos-laravel/
├── backend/     # Laravel 12 REST API (PHP 8.2)
├── frontend/    # React 18 SPA (TypeScript + Vite)
└── docker/      # Docker Compose (PHP-FPM, Nginx, MySQL 8)
```

## Quick Start

```bash
# 1. Clone & enter
git clone https://github.com/your-org/pos-laravel
cd pos-laravel

# 2. Start Docker services
docker compose up -d

# 3. Install backend dependencies & run migrations
docker compose exec php composer install
docker compose exec php php artisan key:generate
docker compose exec php php artisan migrate --seed

# 4. Start frontend
cd frontend && npm install && npm run dev

# 5. Open in browser
# Frontend: http://localhost:5173
# API:      http://localhost:8000
# phpMyAdmin: http://localhost:8080
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@pos.coffee | password |
| Staff | staff@pos.coffee | password |

## Features

### Staff POS
- Menu catalog with category tabs
- Item customization (size, toppings, notes)
- Cart management with quantity controls
- Cash payment with auto change calculation
- QRIS simulation payment
- Digital receipt with print support
- Real-time order queue (5s polling)
- Order status management (Proses → Selesai → Batal)
- Age indicator (green/yellow/red)
- Low stock warnings

### Admin
- Dashboard with sales charts and summary cards
- Top selling items report
- CSV export
- Menu management (CRUD)
- User management (CRUD + activate/deactivate)
- Table management (CRUD + status)
- Transaction history with date filter

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 12 + PHP 8.2 |
| Database | MySQL 8 (or SQLite for testing) |
| Auth | Laravel Sanctum (token-based) |
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| State | Zustand |
| Charts | Recharts |
| QR Code | react-qr-code |
| Container | Docker Compose |
| CI/CD | GitHub Actions |
| Tests | PHPUnit (66 tests, all passing) |

## API Endpoints

33 endpoints under `/api/v1/`:

- **Auth**: login, logout, me
- **Categories**: CRUD
- **Menu Items**: CRUD + stock update
- **Tables**: CRUD
- **Orders**: create, list, show, update status, active orders
- **Payments**: process (cash/QRIS), show
- **Reports**: sales, top items, CSV export
- **Users**: list, create, update, toggle active

See `docs/` for full API documentation.

## Architecture Decisions

- **Service Layer**: Business logic separated into `OrderService`, `PaymentService`, `ReportService`
- **Form Requests**: All validation in dedicated request classes
- **Controller-Service pattern**: Controllers handle HTTP, Services handle logic
- **Stock management**: Auto-deduct on order, auto-restore on cancel
- **Table status**: Auto-update on payment (occupied) and completion (available)
- **Polling over WebSocket**: Simpler implementation for campus project scope
- **Staff workflow over kasir/barista roles**: Small coffee shop operations often combine cashier and barista work, so the app uses one `staff` role with order, payment, and queue access.

## Test Suite

```bash
cd backend && php artisan test
# 66 tests, 112 assertions, all passing
```

## License

MIT
