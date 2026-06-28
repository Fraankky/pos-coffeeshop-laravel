<div align="center">

# ☕ POS Coffee Shop

**Point-of-Sale system for coffee shops & cafes**

[![Tests](https://github.com/Fraankky/pos-coffeeshop-laravel/actions/workflows/backend.yml/badge.svg)](https://github.com/Fraankky/pos-coffeeshop-laravel/actions/workflows/backend.yml)
[![Frontend](https://github.com/Fraankky/pos-coffeeshop-laravel/actions/workflows/frontend.yml/badge.svg)](https://github.com/Fraankky/pos-coffeeshop-laravel/actions/workflows/frontend.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A full-stack Point-of-Sale application built with **Laravel 12** and **React 19**. Order management, real-time queue, cash & QRIS payments, inventory tracking, and sales reporting — everything a modern coffee shop needs to run daily operations.

**[Report Bug](https://github.com/Fraankky/pos-coffeeshop-laravel/issues)** · **[Request Feature](https://github.com/Fraankky/pos-coffeeshop-laravel/issues)**

</div>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Architecture](#-architecture)
- [Testing](#-testing)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🧑‍💼 Staff Workflow (POS + Queue)

| Feature | Description |
|---------|-------------|
| **Menu Catalog** | Browse items by category with search |
| **Cart Management** | Add items, adjust quantities, set size & toppings, add notes |
| **Dine-in & Takeaway** | Assign tables for dine-in, name label for takeaway |
| **Cash Payment** | Enter amount received → auto calculate change |
| **QRIS Payment** | Simulated QR code generation for digital wallet payments |
| **Digital Receipt** | Order summary ready for print |
| **Real-time Queue** | 5-second polling, color-coded age indicators |
| **Order States** | Received → In Progress → Completed / Cancelled |
| **Stock Alerts** | Low stock warnings on menu items |

### 🛠️ Admin Dashboard

| Feature | Description |
|---------|-------------|
| **Sales Overview** | Revenue, order count, active orders summary cards |
| **Sales Chart** | 7-day revenue trend with area chart (Recharts) |
| **Top Items** | Best-selling items ranked by quantity & revenue |
| **Reports Export** | Download sales data as CSV |
| **Menu CRUD** | Add, edit, delete menu items with image URL & pricing |
| **User Management** | Create staff/admin accounts, toggle active status |
| **Table Management** | Add tables with capacity, manage availability |
| **Transaction History** | Filterable order log with detail view |

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | [Laravel 12](https://laravel.com) · PHP 8.2 |
| **Database** | MySQL 8.0 |
| **Auth** | [Laravel Sanctum](https://laravel.com/docs/sanctum) (token-based) |
| **Frontend** | [React 19](https://react.dev) · [TypeScript](https://www.typescriptlang.org) · [Vite](https://vitejs.dev) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) |
| **State** | [Zustand](https://zustand-demo.pmnd.rs) |
| **Charts** | [Recharts](https://recharts.org) |
| **QR Code** | [react-qr-code](https://github.com/rosskhanas/react-qr-code) |
| **HTTP Client** | [Axios](https://axios-http.com) |
| **Container** | [Docker Compose](https://docs.docker.com/compose/) |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions) |
| **Testing** | [PHPUnit 11](https://phpunit.de) · [Faker](https://fakerphp.org) |

---

## 🚀 Quick Start

### Prerequisites

- [Docker](https://www.docker.com/get-started/) & Docker Compose
- [Node.js](https://nodejs.org/) 18+ & npm
- [Composer](https://getcomposer.org/) (for local development)
- [Git](https://git-scm.com/)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Fraankky/pos-coffeeshop-laravel.git
cd pos-coffeeshop-laravel

# 2. Start Docker services (MySQL, PHP, Nginx, phpMyAdmin)
docker compose up -d

# 3. Install backend dependencies
docker compose exec php composer install

# 4. Generate application key
docker compose exec php php artisan key:generate

# 5. Run migrations and seed demo data
docker compose exec php php artisan migrate --seed

# 6. Install and start frontend
cd frontend
npm install
npm run dev
```

### Access the Application

| Service | URL |
|---------|-----|
| Frontend (Vite dev) | [http://localhost:5173](http://localhost:5173) |
| API | [http://localhost:8000](http://localhost:8000) |
| phpMyAdmin | [http://localhost:8080](http://localhost:8080) |

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@flocoffee.com | password |
| **Staff** | staff@flocoffee.com | password |

### Stopping the Application

```bash
docker compose down
```

---

## 🔧 Environment Variables

The backend requires a `.env` file. Copy the example and adjust:

```bash
cp backend/.env.example backend/.env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_URL` | `http://localhost:8000` | Backend API URL |
| `FRONTEND_URL` | `http://localhost:5173` | Frontend URL for CORS |
| `DB_DATABASE` | `pos_coffee` | Database name |
| `DB_USERNAME` | `pos_user` | Database user |
| `DB_PASSWORD` | `pos_password` | Database password |
| `APP_LOCALE` | `id` | Application locale (Indonesian) |

> When using Docker, the database variables in `.env` should match the `MYSQL_*` variables in `docker-compose.yml`.

---

## 📁 Project Structure

```
pos-coffeeshop-laravel/
├── backend/                    # Laravel 12 REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/V1/  # API controllers
│   │   │   ├── Middleware/          # Role-based auth middleware
│   │   │   └── Requests/            # Form validation
│   │   ├── Models/                  # Eloquent models (7)
│   │   ├── Services/                # Business logic layer
│   │   │   ├── OrderService.php
│   │   │   ├── PaymentService.php
│   │   │   └── ReportService.php
│   │   ├── Traits/
│   │   │   └── ApiResponse.php      # Standardized JSON responses
│   │   └── Providers/
│   ├── database/
│   │   ├── migrations/              # 7 migration files
│   │   └── seeders/
│   │       └── DatabaseSeeder.php   # Demo data (2 users, 45 items, 10 tables)
│   ├── routes/
│   │   └── api.php                  # 33 API endpoints
│   └── tests/
├── frontend/                   # React 19 SPA
│   ├── src/
│   │   ├── components/              # Shared UI & layout components
│   │   ├── hooks/                   # Custom hooks (usePolling)
│   │   ├── lib/                     # API client, utils, constants
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── cashier/             # POS-specific components
│   │   │   └── admin/              # Admin-specific components
│   │   ├── stores/                  # Zustand stores (auth, cart, cashier)
│   │   └── types/                   # TypeScript interfaces
│   └── vite.config.ts
├── docker/                     # Docker configuration
│   ├── nginx/default.conf
│   └── php/Dockerfile
├── docs/                       # Additional documentation
│   ├── api-overview.md         # Full API reference
│   ├── DB_DESIGN.md            # Database schema details
│   ├── DOCKER_GUIDE.md         # Docker setup guide
│   └── access-control.md       # Role & permission details
├── docker-compose.yml
└── README.md
```

---

## 📡 API Endpoints

All endpoints are prefixed with `/api/v1`. Authentication uses Bearer tokens via Laravel Sanctum.

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Authenticate & receive token |

### Authenticated

| Resource | Endpoints | Access |
|----------|-----------|--------|
| **Auth** | `POST /auth/logout`, `GET /auth/me` | Any |
| **Categories** | `GET` list/show, `POST/PUT/DELETE` | Read: Any · Write: Admin |
| **Menu Items** | `GET` list/show/filter, `POST/PUT/DELETE`, `PATCH stock` | Read: Any · Write: Admin · Stock: Staff |
| **Tables** | `GET` list/show, `POST/PUT/DELETE` | Read: Any · Write: Admin |
| **Orders** | `GET` list/filter/active/detail, `POST` create, `PATCH` status | Staff, Admin |
| **Payments** | `POST` process, `GET` show | Staff, Admin |
| **Reports** | `GET` sales, top-items, export CSV | Admin |
| **Users** | `GET` list, `POST/PUT` crud, `PATCH` toggle, `DELETE` | Admin |

> 📖 See [docs/api-overview.md](docs/api-overview.md) for full API documentation.

---

## 🏗️ Architecture

### Design Patterns

- **Controller-Service**: Controllers handle HTTP requests; services contain business logic
- **Form Requests**: All validation is extracted into dedicated request classes
- **Trait-based API Responses**: Consistent JSON response format via `ApiResponse` trait
- **Repository-free**: Eloquent models used directly; services orchestrate complex operations

### Business Logic

| Service | Responsibility |
|---------|---------------|
| `OrderService` | Creates orders with stock deduction, manages state machine (`received → in_progress → completed/cancelled`), auto-restores stock on cancel |
| `PaymentService` | Processes cash/QRIS payments, calculates change, updates order & table status |
| `ReportService` | Aggregates sales by period, ranks top items, exports CSV — MySQL & SQLite compatible |

### State Machine

```
Pending → Received → In Progress → Completed
                    ↘ Cancelled (stock restored)
```

### Key Decisions

- **Token auth over cookies**: Simpler for API consumers and mobile clients
- **Polling over WebSocket**: 5-second polling for the order queue — simpler infrastructure, sufficient for most use cases
- **Unified staff role**: No separate cashier/barista roles; one `staff` role handles both order-taking and queue management
- **Auto stock management**: Stock deducted on order creation, restored on cancellation
- **One payment per order**: Enforced by `unique` constraint on `payments.order_id`

---

## 🧪 Testing

The backend includes a comprehensive PHPUnit test suite:

```bash
# Run all tests
cd backend
php artisan test

# Run a specific test file
php artisan test --filter=OrderTest
```

Test files cover controllers, services, and API responses. SQLite is used as the testing database via `phpunit.xml`.

---

## 🗺️ Roadmap

- [ ] Split staff into cashier & barista roles
- [ ] WebSocket real-time queue
- [ ] Native QRIS integration (midtrans/xendit)
- [ ] Print receipt via ESC/POS thermal printer
- [ ] Daily closing report
- [ ] Multi-outlet support
- [ ] Mobile PWA for staff

---

## 🤝 Contributing

Contributions are what make the open-source community amazing. Any contributions you make are **greatly appreciated**.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — A new feature
- `fix:` — A bug fix
- `refactor:` — Code refactoring
- `docs:` — Documentation changes
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks

### Code Style

- Backend: `./vendor/bin/pint` (Laravel Pint)
- Frontend: ESLint + Prettier (configured in Vite)

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Made with ☕ by [Fraankky](https://github.com/Fraankky) & contributors

⭐ If this project helps you, please consider giving it a star!

</div>
