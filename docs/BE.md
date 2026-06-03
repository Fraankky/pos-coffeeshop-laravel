# BE.md — Backend Task List

## Laravel REST API — POS Coffee Shop

**Developer**: Muhammad Faris (2300018225)  
**Tech**: Laravel 11 + PHP 8.2+ + MySQL 8 + Sanctum + PHPUnit  
**Repo**: pos-laravel/backend/

---

## Phase 0: Infrastructure & Scaffolding (Week 1)

### Repository & Monorepo

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| S-01 | Buat GitHub repository `pos-laravel` | High | 30m | ⬜ |
| S-02 | Tambah `.gitignore` (Laravel + React + Docker) | High | 15m | ⬜ |
| S-03 | Buat struktur monorepo (`backend/`, `frontend/`, `docker/`) | High | 20m | ⬜ |
| S-04 | Tambah `README.md` awal | Medium | 30m | ⬜ |
| S-05 | Tambah `LICENSE` (MIT) | High | 5m | ⬜ |

### Docker

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| D-01 | Tulis `docker-compose.yml` (php-fpm, nginx, mysql, phpmyadmin) | High | 1h | ⬜ |
| D-02 | Tulis `docker/php/Dockerfile` — PHP 8.2 + ekstensi yang dibutuhkan | High | 45m | ⬜ |
| D-03 | Tulis `docker/nginx/default.conf` | High | 30m | ⬜ |
| D-04 | Tambah `.dockerignore` | Medium | 10m | ⬜ |
| D-05 | Test `docker compose up` — semua service healthy | High | 30m | ⬜ |

### Laravel Backend

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| B-01 | Install Laravel 11 via Composer di `backend/` | High | 15m | ⬜ |
| B-02 | Konfigurasi `.env` — MySQL (docker service name as host) | High | 15m | ⬜ |
| B-03 | Install Laravel Sanctum | High | 15m | ⬜ |
| B-04 | Konfigurasi CORS untuk React SPA origin | High | 15m | ⬜ |
| B-05 | Install & konfigurasi Laravel Pint (code style PSR-12) | Medium | 15m | ⬜ |
| B-06 | Install & konfigurasi PHPStan/Larastan level 8 | Medium | 20m | ⬜ |
| B-07 | Setup `phpunit.xml` — SQLite in-memory untuk testing | High | 20m | ⬜ |
| B-08 | Buat trait/macro untuk standar API response (`ApiResponse`) | High | 30m | ⬜ |
| B-09 | Setup exception handler — JSON response untuk semua error | High | 30m | ⬜ |

### CI/CD

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| CI-01 | Buat `.github/workflows/backend.yml` — lint + stan + test | Medium | 45m | ⬜ |

---

## Phase 1: Database & Authentication (Week 1-2)

### Migrations

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| DB-01 | Finalisasi ERD & schema (referensi `DB_DESIGN.md`) | High | 1h | ⬜ |
| DB-02 | `create_users_table` | High | 20m | ⬜ |
| DB-03 | `create_categories_table` | High | 15m | ⬜ |
| DB-04 | `create_tables_table` | High | 15m | ⬜ |
| DB-05 | `create_menu_items_table` (include stock_qty, stock_min_threshold, image) | High | 20m | ⬜ |
| DB-06 | `create_orders_table` | High | 20m | ⬜ |
| DB-07 | `create_order_items_table` | High | 15m | ⬜ |
| DB-08 | `create_payments_table` | High | 15m | ⬜ |
| DB-09 | Tambah semua foreign key constraints | High | 20m | ⬜ |
| DB-10 | Tambah indexes (orders.status, orders.created_at, dll) | Medium | 15m | ⬜ |

### Seeders & Factories

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| SD-01 | `UserFactory` — states: staff, admin | High | 20m | ⬜ |
| SD-02 | `CategoryFactory` | Medium | 15m | ⬜ |
| SD-03 | `MenuItemFactory` — data coffee shop realistis | Medium | 20m | ⬜ |
| SD-04 | `TableFactory` — 10 meja | Medium | 10m | ⬜ |
| SD-05 | `DatabaseSeeder` — orchestrator semua seeders | High | 20m | ⬜ |
| SD-06 | `DemoDataSeeder` — environment demo siap pakai | Medium | 30m | ⬜ |

### Auth System

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| A-01 | Buat role constants/enum (staff, admin) | High | 10m | ⬜ |
| A-02 | `AuthController` — login, logout, me | High | 45m | ⬜ |
| A-03 | `LoginRequest` — validasi email + password | High | 15m | ⬜ |
| A-04 | `AuthService` — login logic, token creation, logout | High | 30m | ⬜ |
| A-05 | `AuthenticatedUserResource` — response `/me` | Medium | 15m | ⬜ |
| A-06 | `RoleMiddleware` — validasi role per route | High | 20m | ⬜ |
| A-07 | Register auth routes di `routes/api.php` | High | 10m | ⬜ |
| A-08 | Feature tests: login sukses, login gagal, logout, 401 unauthenticated | High | 45m | ⬜ |

---

## Phase 2: Menu & Category CRUD (Week 2-3)

### Categories

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| MC-01 | `Category` model + relationships | High | 10m | ⬜ |
| MC-02 | `CategoryController` — index, store, show, update, destroy | High | 1h | ⬜ |
| MC-03 | `StoreCategoryRequest` & `UpdateCategoryRequest` | High | 20m | ⬜ |
| MC-04 | `CategoryResource` | Medium | 15m | ⬜ |
| MC-05 | `CategoryService` — business logic | Medium | 30m | ⬜ |
| MC-06 | Feature tests: CRUD categories, validasi, unauthorized | High | 1h | ⬜ |

### Menu Items

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| MI-01 | `MenuItem` model + relationship ke category | High | 15m | ⬜ |
| MI-02 | `MenuItemController` — index (filter/paginate), store, show, update, destroy | High | 1.5h | ⬜ |
| MI-03 | `StoreMenuItemRequest` & `UpdateMenuItemRequest` | High | 30m | ⬜ |
| MI-04 | `MenuItemResource` (include category name) | Medium | 20m | ⬜ |
| MI-05 | `MenuItemService` — CRUD + stock management | Medium | 45m | ⬜ |
| MI-06 | Image upload handling — Laravel Filesystem `public` disk | Medium | 45m | ⬜ |
| MI-07 | Image URL accessor di model `MenuItem` | Medium | 15m | ⬜ |
| MI-08 | Feature tests: CRUD menu items, upload gambar, update stok, validasi | High | 1.5h | ⬜ |

---

## Phase 3: Order & Payment (Week 3-4)

### Order System

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| OR-01 | `Order` model + relationships (user, table, items, payment) | High | 20m | ⬜ |
| OR-02 | `OrderItem` model + relationships | High | 10m | ⬜ |
| OR-03 | `OrderStatus` enum | High | 10m | ⬜ |
| OR-04 | `OrderType` enum (dine_in, takeaway) | High | 5m | ⬜ |
| OR-05 | `OrderController` — index, store, show, updateStatus | High | 1.5h | ⬜ |
| OR-06 | `StoreOrderRequest` — validasi items, table_id, order_type | High | 30m | ⬜ |
| OR-07 | `OrderResource` — nested: items, payment, user, table | High | 30m | ⬜ |
| OR-08 | `OrderService` — create order, calculate total, validate stock | High | 1h | ⬜ |
| OR-09 | `UpdateOrderStatusRequest` | Medium | 15m | ⬜ |
| OR-10 | Filter order: by date range, by status, by order_type | Medium | 30m | ⬜ |
| OR-11 | Feature tests: create order, stock deduction, invalid order, status update | High | 1.5h | ⬜ |

### Payment System

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| PY-01 | `Payment` model + relationship ke Order | High | 10m | ⬜ |
| PY-02 | `PaymentMethod` enum (cash, qris_simulated) | High | 5m | ⬜ |
| PY-03 | `PaymentStatus` enum (pending, confirmed, cancelled) | High | 5m | ⬜ |
| PY-04 | `PaymentController` — store (process), show | High | 1h | ⬜ |
| PY-05 | `ProcessPaymentRequest` — validasi method, amount_paid | High | 20m | ⬜ |
| PY-06 | `PaymentResource` | Medium | 15m | ⬜ |
| PY-07 | `PaymentService` — cash (hitung kembalian), QRIS (manual confirm) | High | 1h | ⬜ |
| PY-08 | Validasi amount_paid >= total untuk cash payment | High | 15m | ⬜ |
| PY-09 | Feature tests: cash exact/over/under, QRIS simulate, confirm | High | 1.5h | ⬜ |

---

## Phase 4: Staff Queue Polling (Week 4-5)

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| BQ-01 | `OrderController::activeOrders` — endpoint active orders | High | 30m | ⬜ |
| BQ-02 | Optimasi query active orders — hanya non-completed, eager load items+menu | High | 30m | ⬜ |
| BQ-03 | Delta detection — `?since=` timestamp untuk return hanya yang berubah | Medium | 30m | ⬜ |
| BQ-04 | Lightweight order resource untuk polling | High | 20m | ⬜ |
| BQ-05 | Rate limiting untuk polling endpoint | Medium | 15m | ⬜ |
| BQ-06 | Feature tests: active orders, status update, polling with since param | High | 1h | ⬜ |

---

## Phase 5: Reports & CSV Export (Week 5-6)

### Reports API

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| RP-01 | `ReportController` — sales, topItems, export | High | 1h | ⬜ |
| RP-02 | `SalesReportService` — aggregate queries per periode | High | 1.5h | ⬜ |
| RP-03 | Logic agregasi harian/mingguan/bulanan | High | 1h | ⬜ |
| RP-04 | Query top-selling items (JOIN order_items, GROUP BY, ORDER BY count DESC) | High | 45m | ⬜ |
| RP-05 | `SalesReportResource` | Medium | 20m | ⬜ |
| RP-06 | `TopItemResource` | Medium | 15m | ⬜ |
| RP-07 | Feature tests: sales report by period, top items, empty data | High | 1h | ⬜ |

### CSV Export

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| EX-01 | Install `openspout/openspout` | High | 10m | ⬜ |
| EX-02 | `ExportService` — generate CSV dari report data | High | 1h | ⬜ |
| EX-03 | Implement streaming CSV response (large dataset) | Medium | 45m | ⬜ |
| EX-04 | Endpoint export dengan filter tanggal | High | 20m | ⬜ |
| EX-05 | Feature tests: CSV export with data, empty, date filter | Medium | 45m | ⬜ |

---

## Phase 6: Table & User Management (Week 6-7)

### Table Management

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| TB-01 | `Table` model | High | 10m | ⬜ |
| TB-02 | `TableController` — index, store, update, destroy | High | 1h | ⬜ |
| TB-03 | `TableResource` | Medium | 15m | ⬜ |
| TB-04 | Auto-update table status saat order dibuat/selesai | Medium | 30m | ⬜ |
| TB-05 | Feature tests: CRUD tables, status auto-update | High | 45m | ⬜ |

### User Management

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| UM-01 | `UserController` — index, store, update, toggleActive | High | 1h | ⬜ |
| UM-02 | `StoreUserRequest` & `UpdateUserRequest` | High | 20m | ⬜ |
| UM-03 | `UserResource` — exclude password | Medium | 15m | ⬜ |
| UM-04 | Validasi: tidak bisa nonaktifkan diri sendiri, tidak bisa ubah role sendiri | Medium | 20m | ⬜ |
| UM-05 | Feature tests: CRUD users, toggle active, self-protection rules | High | 1h | ⬜ |

---

## Phase 7: Testing & Hardening (Week 7)

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| IT-05 | Performance audit: API response times, query optimization | Medium | 1h | ⬜ |
| IT-06 | Security audit: SQL injection, XSS, auth bypass | High | 1.5h | ⬜ |
| IT-07 | Bug fixing (semua bug dari FE + BE) | High | 4h | ⬜ |
| IT-08 | Pastikan semua test backend pass (`php artisan test`) | High | 30m | ⬜ |
| IT-10 | Code review session | Medium | 2h | ⬜ |

---

## Phase 8: Deploy & Documentation (Week 8)

### Deployment

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| DP-01 | Siapkan production `.env` (app key, db creds, cors origins) | High | 30m | ⬜ |
| DP-02 | Deploy backend ke Railway | High | 1h | ⬜ |
| DP-04 | Setup production MySQL database | High | 30m | ⬜ |
| DP-05 | Jalankan migrations + seeders di production | High | 15m | ⬜ |

### Documentation

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| DC-02 | Generate API documentation (Scribe / Scramble) | High | 45m | ⬜ |
| DC-03 | Buat Postman collection — semua endpoint + contoh | Medium | 1h | ⬜ |
| DC-04 | Tulis `CONTRIBUTING.md` | Medium | 45m | ⬜ |
| DC-05 | Tulis `CHANGELOG.md` v1.0.0 | Medium | 30m | ⬜ |
| DC-06 | Tambah `CODE_OF_CONDUCT.md` | Low | 15m | ⬜ |
| DC-07 | Tambah GitHub issue templates | Low | 20m | ⬜ |
| DC-08 | Tambah GitHub PR template | Low | 10m | ⬜ |

### Open Source Release

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| OS-01 | Final repository cleanup | High | 30m | ⬜ |
| OS-02 | Tag release v1.0.0 | High | 5m | ⬜ |
| OS-04 | Make repository public | High | 5m | ⬜ |

---

## Shared Tasks (dengan Athar)

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| SH-01 | Analisis & desain wireframe (Figma) | High | 4h | ⬜ |
| SH-02 | Finalisasi API contract (endpoint + request/response shape) | High | 2h | ⬜ |
| SH-03 | Integrasi FE-BE (Week 5) | High | 8h | ⬜ |
| SH-04 | Bug fixing (Week 7) | High | 4h | ⬜ |
| SH-05 | Tulis README gabungan | High | 1h | ⬜ |
| SH-06 | Final smoke test production | High | 30m | ⬜ |
