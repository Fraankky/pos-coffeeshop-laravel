# PLAN.md — POS Coffee Shop Development Plan

## Master Development Plan — Laravel REST API + React SPA

**Total Duration**: 8 weeks (2 bulan)  
**Team**: 2 developers (Faris — Backend · Athar — Frontend)  
**Methodology**: Feature-branch Git workflow

---

## Phase Overview

| Phase | Week | Focus | Owner |
|-------|------|-------|-------|
| 0 | 1 | Project Scaffolding & Infrastructure | Faris + Athar |
| 1 | 1-2 | Database Design & Authentication | Faris |
| 2 | 2-3 | Menu & Category Management | Faris + Athar |
| 3 | 3-4 | Order & Payment System | Faris + Athar |
| 4 | 4-5 | Staff Queue & Real-time Polling | Faris + Athar |
| 5 | 5-6 | Reports, Analytics & CSV Export | Faris + Athar |
| 6 | 6-7 | Admin Dashboard & User Management | Faris + Athar |
| 7 | 7 | Integration Testing & Bug Fixing | Faris + Athar |
| 8 | 8 | Deployment, Documentation & Open Source Release | Faris + Athar |

---

## Phase 0: Project Scaffolding & Infrastructure (Week 1)

**Goal**: Working monorepo with Docker, CI, and code quality tooling.

### 0.1 Repository & Monorepo Setup
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| S-01 | Create GitHub repository `pos-laravel` | High | Faris | 30m | ⬜ |
| S-02 | Add `.gitignore` (Laravel + React + Docker) | High | Faris | 15m | ⬜ |
| S-03 | Create monorepo directory structure (`backend/`, `frontend/`, `docker/`) | High | Faris | 20m | ⬜ |
| S-04 | Add `README.md` with project overview | Medium | Faris | 30m | ⬜ |
| S-05 | Add `LICENSE` (MIT) | High | Faris | 5m | ⬜ |

### 0.2 Docker Infrastructure
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| D-01 | Write `docker-compose.yml` (PHP-FPM, Nginx, MySQL, phpMyAdmin) | High | Faris | 1h | ⬜ |
| D-02 | Write `docker/php/Dockerfile` with required extensions | High | Faris | 45m | ⬜ |
| D-03 | Write `docker/nginx/default.conf` | High | Faris | 30m | ⬜ |
| D-04 | Add `.dockerignore` | Medium | Faris | 10m | ⬜ |
| D-05 | Test `docker compose up` — all services healthy | High | Faris | 30m | ⬜ |

### 0.3 Backend Scaffolding (Laravel)
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| B-01 | Install Laravel 11 via Composer in `backend/` | High | Faris | 15m | ⬜ |
| B-02 | Configure `.env` for MySQL (docker service name as host) | High | Faris | 15m | ⬜ |
| B-03 | Install Laravel Sanctum | High | Faris | 15m | ⬜ |
| B-04 | Configure CORS (`config/cors.php`) for React SPA | High | Faris | 15m | ⬜ |
| B-05 | Install & configure Laravel Pint (code style) | Medium | Faris | 15m | ⬜ |
| B-06 | Install & configure PHPStan/Larastan (level 8) | Medium | Faris | 20m | ⬜ |
| B-07 | Set up `phpunit.xml` with SQLite for testing | High | Faris | 20m | ⬜ |
| B-08 | Create standard API response macro/trait | High | Faris | 30m | ⬜ |
| B-09 | Set up exception handler for consistent JSON error responses | High | Faris | 30m | ⬜ |
| B-10 | Add `php artisan make:service` custom command (if needed) | Low | Faris | 20m | ⬜ |

### 0.4 Frontend Scaffolding (React)
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| F-01 | Scaffold React + TypeScript + Vite in `frontend/` | High | Athar | 20m | ⬜ |
| F-02 | Install & configure Tailwind CSS | High | Athar | 20m | ⬜ |
| F-03 | Install Zustand (state management) | High | Athar | 10m | ⬜ |
| F-04 | Install react-router-dom (v6) | High | Athar | 10m | ⬜ |
| F-05 | Install react-qr-code | Medium | Athar | 5m | ⬜ |
| F-06 | Install Recharts (charts) | Medium | Athar | 5m | ⬜ |
| F-07 | Install axios for HTTP client | High | Athar | 5m | ⬜ |
| F-08 | Configure ESLint + Prettier | Medium | Athar | 20m | ⬜ |
| F-09 | Set up path aliases (`@/` → `src/`) in tsconfig & vite config | Medium | Athar | 15m | ⬜ |
| F-10 | Create base layout component (sidebar, header, content slot) | High | Athar | 45m | ⬜ |
| F-11 | Set up React Router with protected route wrapper | High | Athar | 30m | ⬜ |
| F-12 | Create API client wrapper (axios instance with interceptors) | High | Athar | 30m | ⬜ |

### 0.5 CI/CD Pipeline
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| CI-01 | Create `.github/workflows/backend.yml` (lint, stan, test) | Medium | Faris | 45m | ⬜ |
| CI-02 | Create `.github/workflows/frontend.yml` (lint, typecheck, build) | Medium | Athar | 30m | ⬜ |
| CI-03 | Add branch protection rules documentation | Low | Faris | 15m | ⬜ |

**Phase 0 Milestone**: `docker compose up` starts all services; `php artisan` works; `npm run dev` starts Vite.

---

## Phase 1: Database Design & Authentication (Week 1-2)

**Goal**: Complete DB schema migrations + seeders. Auth system working end-to-end.

### 1.1 Database Design & Migrations
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| DB-01 | Finalize ERD and schema design → reference `DB_DESIGN.md` | High | Faris | 1h | ⬜ |
| DB-02 | Create `users` migration (id, name, email, password, role enum, is_active, timestamps) | High | Faris | 20m | ⬜ |
| DB-03 | Create `categories` migration | High | Faris | 15m | ⬜ |
| DB-04 | Create `tables` migration | High | Faris | 15m | ⬜ |
| DB-05 | Create `menu_items` migration (incl. stock_qty, stock_min_threshold, image) | High | Faris | 20m | ⬜ |
| DB-06 | Create `orders` migration (user_id, table_id nullable, order_type, status, total_amount) | High | Faris | 20m | ⬜ |
| DB-07 | Create `order_items` migration | High | Faris | 15m | ⬜ |
| DB-08 | Create `payments` migration | High | Faris | 15m | ⬜ |
| DB-09 | Add foreign key constraints on all relevant tables | High | Faris | 20m | ⬜ |
| DB-10 | Add indexes on frequently queried columns (orders.status, orders.created_at, etc.) | Medium | Faris | 15m | ⬜ |

### 1.2 Seeders & Factories
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| SD-01 | Create `UserFactory` with role-based states (staff, admin) | High | Faris | 20m | ⬜ |
| SD-02 | Create `CategoryFactory` | Medium | Faris | 15m | ⬜ |
| SD-03 | Create `MenuItemFactory` with realistic coffee shop data | Medium | Faris | 20m | ⬜ |
| SD-04 | Create `TableFactory` (10 tables) | Medium | Faris | 10m | ⬜ |
| SD-05 | Create `DatabaseSeeder` orchestrating all seeders | High | Faris | 20m | ⬜ |
| SD-06 | Create `DemoDataSeeder` for realistic demo environment | Medium | Faris | 30m | ⬜ |

### 1.3 Auth System (Backend)
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| A-01 | Create role constants/enum (staff, admin) | High | Faris | 10m | ⬜ |
| A-02 | Create `AuthController` — login, logout, me | High | Faris | 45m | ⬜ |
| A-03 | Create `LoginRequest` form request (email + password validation) | High | Faris | 15m | ⬜ |
| A-04 | Create `AuthService` — login logic, token creation | High | Faris | 30m | ⬜ |
| A-05 | Create `AuthenticatedUserResource` for `/me` response | Medium | Faris | 15m | ⬜ |
| A-06 | Create `RoleMiddleware` — validate user role for protected routes | High | Faris | 20m | ⬜ |
| A-07 | Register auth routes in `routes/api.php` | High | Faris | 10m | ⬜ |
| A-08 | Write Feature tests: login success, login fail, logout, unauthenticated access | High | Faris | 45m | ⬜ |

### 1.4 Auth UI (Frontend)
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| AU-01 | Create `authStore` (Zustand) — token, user, login/logout actions | High | Athar | 30m | ⬜ |
| AU-02 | Create `LoginPage` — form with validation, error display | High | Athar | 1h | ⬜ |
| AU-03 | Create `ProtectedRoute` — redirect to login if unauthenticated | High | Athar | 20m | ⬜ |
| AU-04 | Create `RoleRoute` — restrict pages by role | Medium | Athar | 20m | ⬜ |
| AU-05 | Implement axios interceptor — attach Bearer token, handle 401 | High | Athar | 30m | ⬜ |
| AU-06 | Add logout button in layout header | Medium | Athar | 15m | ⬜ |

**Phase 1 Milestone**: Login works; role-based redirect works; DB fully migrated with demo data.

---

## Phase 2: Menu & Category Management (Week 2-3)

**Goal**: CRUD menu & kategori. Menu catalog visible for Staff.

### 2.1 Backend — Category CRUD
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| MC-01 | Create `Category` model with relationships | High | Faris | 10m | ⬜ |
| MC-02 | Create `CategoryController` — index, store, show, update, destroy | High | Faris | 1h | ⬜ |
| MC-03 | Create `StoreCategoryRequest` & `UpdateCategoryRequest` | High | Faris | 20m | ⬜ |
| MC-04 | Create `CategoryResource` | Medium | Faris | 15m | ⬜ |
| MC-05 | Create `CategoryService` — business logic | Medium | Faris | 30m | ⬜ |
| MC-06 | Feature tests: CRUD categories, validation, unauthorized access | High | Faris | 1h | ⬜ |

### 2.2 Backend — Menu Item CRUD
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| MI-01 | Create `MenuItem` model with relationships (category) | High | Faris | 15m | ⬜ |
| MI-02 | Create `MenuItemController` — index (with filter/paginate), store, show, update, destroy | High | Faris | 1.5h | ⬜ |
| MI-03 | Create `StoreMenuItemRequest` & `UpdateMenuItemRequest` | High | Faris | 30m | ⬜ |
| MI-04 | Create `MenuItemResource` (include category name) | Medium | Faris | 20m | ⬜ |
| MI-05 | Create `MenuItemService` — CRUD + stock management | Medium | Faris | 45m | ⬜ |
| MI-06 | Add image upload handling (Laravel Filesystem, `public` disk) | Medium | Faris | 45m | ⬜ |
| MI-07 | Add image URL accessor on MenuItem model | Medium | Faris | 15m | ⬜ |
| MI-08 | Feature tests: CRUD menu items, image upload, stock update, validation | High | Faris | 1.5h | ⬜ |

### 2.3 Frontend — Menu Catalog (Staff View)
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| MU-01 | Create `menuStore` (Zustand) — categories, items, selected item | High | Athar | 30m | ⬜ |
| MU-02 | Create `MenuCatalog` component — category tabs + item grid | High | Athar | 1.5h | ⬜ |
| MU-03 | Create `MenuItemCard` component — image, name, price, add button | High | Athar | 45m | ⬜ |
| MU-04 | Create `ItemCustomizationModal` — size, toppings, notes | High | Athar | 1h | ⬜ |
| MU-05 | Create loading skeleton for menu items | Medium | Athar | 20m | ⬜ |
| MU-06 | Create empty state (no items in category) | Low | Athar | 15m | ⬜ |

### 2.4 Frontend — Menu Management (Admin View)
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| AM-01 | Create `AdminMenuPage` — table listing + action buttons | High | Athar | 1h | ⬜ |
| AM-02 | Create `MenuFormModal` — create/edit menu item form | High | Athar | 1h | ⬜ |
| AM-03 | Create `CategoryManager` — inline CRUD categories | Medium | Athar | 45m | ⬜ |
| AM-04 | Add image upload preview in form | Medium | Athar | 30m | ⬜ |
| AM-05 | Add toggle active/inactive switch | Medium | Athar | 15m | ⬜ |
| AM-06 | Add stock indicator (low stock warning) | Medium | Athar | 20m | ⬜ |

**Phase 2 Milestone**: Menu & category CRUD fully functional. Staff can browse menu catalog.

---

## Phase 3: Order & Payment System (Week 3-4)

**Goal**: Complete order flow: create order → add items → pay. Struk digital.

### 3.1 Backend — Order System
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| OR-01 | Create `Order` model with relationships (user, table, items, payment) | High | Faris | 20m | ⬜ |
| OR-02 | Create `OrderItem` model with relationships | High | Faris | 10m | ⬜ |
| OR-03 | Create `OrderStatus` enum (pending, received, in_progress, completed, cancelled) | High | Faris | 10m | ⬜ |
| OR-04 | Create `OrderType` enum (dine_in, takeaway) | High | Faris | 5m | ⬜ |
| OR-05 | Create `OrderController` — index, store, show, updateStatus | High | Faris | 1.5h | ⬜ |
| OR-06 | Create `StoreOrderRequest` — validate items, table, order_type | High | Faris | 30m | ⬜ |
| OR-07 | Create `OrderResource` (include items, payment, user, table — nested) | High | Faris | 30m | ⬜ |
| OR-08 | Create `OrderService` — create order with items, calculate totals, validate stock | High | Faris | 1h | ⬜ |
| OR-09 | Create `UpdateOrderStatusRequest` | Medium | Faris | 15m | ⬜ |
| OR-10 | Add order filter: by date range, by status, by order_type | Medium | Faris | 30m | ⬜ |
| OR-11 | Feature tests: create order, add items, stock deduction, invalid order, status update | High | Faris | 1.5h | ⬜ |

### 3.2 Backend — Payment System
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| PY-01 | Create `Payment` model with relationship to Order | High | Faris | 10m | ⬜ |
| PY-02 | Create `PaymentMethod` enum (cash, qris_simulated) | High | Faris | 5m | ⬜ |
| PY-03 | Create `PaymentStatus` enum (pending, confirmed, cancelled) | High | Faris | 5m | ⬜ |
| PY-04 | Create `PaymentController` — store (process payment), show | High | Faris | 1h | ⬜ |
| PY-05 | Create `ProcessPaymentRequest` — validate method, amount_paid, order_id | High | Faris | 20m | ⬜ |
| PY-06 | Create `PaymentResource` | Medium | Faris | 15m | ⬜ |
| PY-07 | Create `PaymentService` — cash (calculate change), QRIS (manual confirm), validate | High | Faris | 1h | ⬜ |
| PY-08 | Add balance validation: amount_paid >= total for cash payments | High | Faris | 15m | ⬜ |
| PY-09 | Feature tests: cash payment (exact, over, under), QRIS simulate, payment confirmed | High | Faris | 1.5h | ⬜ |

### 3.3 Frontend — Order Workflow (Staff)
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| OC-01 | Create `cartStore` (Zustand) — items, add/remove/update, clear, subtotal/total | High | Athar | 45m | ⬜ |
| OC-02 | Create `OrderPage` — main layout for staff order workflow | High | Athar | 1h | ⬜ |
| OC-03 | Create `CartPanel` — list items, qty controls, total, checkout button | High | Athar | 1h | ⬜ |
| OC-04 | Create `OrderTypeSelector` — Dine-In (table picker) / Takeaway | High | Athar | 30m | ⬜ |
| OC-05 | Create `TableSelector` component — grid of available tables | High | Athar | 45m | ⬜ |
| OC-06 | Create `PaymentModal` — method selection (Cash / QRIS) | High | Athar | 1h | ⬜ |
| OC-07 | Create `CashPayment` — input nominal, auto-calculate change | High | Athar | 45m | ⬜ |
| OC-08 | Create `QRISPayment` — show QR code (react-qr-code), confirm button | High | Athar | 45m | ⬜ |
| OC-09 | Create `ReceiptPreview` — digital receipt after successful payment | Medium | Athar | 1h | ⬜ |
| OC-10 | Wire all staff order flow end-to-end (menu → cart → order type → payment → receipt) | High | Athar | 1h | ⬜ |
| OC-11 | Add print receipt via `window.print()` with print-specific CSS | Low | Athar | 30m | ⬜ |

**Phase 3 Milestone**: Complete transaction flow works. Cash and QRIS payments process correctly.

---

## Phase 4: Staff Queue & Real-time Polling (Week 4-5)

**Goal**: Staff sees active orders with near-real-time updates.

### 4.1 Backend — Staff Queue Endpoints
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| BQ-01 | Add `OrderController::activeOrders` endpoint | High | Faris | 30m | ⬜ |
| BQ-02 | Optimize active orders query — only non-completed, eager load items + menu | High | Faris | 30m | ⬜ |
| BQ-03 | Add `updated_at` based delta detection (return only changed since timestamp) | Medium | Faris | 30m | ⬜ |
| BQ-04 | Create lightweight order resource for polling | High | Faris | 20m | ⬜ |
| BQ-05 | Add rate limiting for polling endpoint (mitigate abuse) | Medium | Faris | 15m | ⬜ |
| BQ-06 | Feature tests: active orders, status updates, polling with since param | High | Faris | 1h | ⬜ |

### 4.2 Frontend — Staff Queue
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| BD-01 | Create `QueuePage` — layout with order queue | High | Athar | 1h | ⬜ |
| BD-02 | Create `OrderQueueList` — grid/list of active orders | High | Athar | 1h | ⬜ |
| BD-03 | Create `OrderCard` — order details, items, notes, timer since order | High | Athar | 1h | ⬜ |
| BD-04 | Implement `usePolling` hook — fetch every 5 seconds, update state | High | Athar | 30m | ⬜ |
| BD-05 | Add status update buttons: Received → In Progress → Completed | High | Athar | 30m | ⬜ |
| BD-06 | Add audio notification for new orders (optional) | Low | Athar | 20m | ⬜ |
| BD-07 | Add order age indicator (color-coded: green <5m, yellow <10m, red >10m) | Medium | Athar | 30m | ⬜ |
| BD-08 | Add smooth transition/animation when orders appear/update | Low | Athar | 20m | ⬜ |

**Phase 4 Milestone**: Staff sees orders in near-real-time (≤5s). Status updates reflect immediately.

---

## Phase 5: Reports, Analytics & CSV Export (Week 5-6)

**Goal**: Admin dashboard with sales insights and CSV export.

### 5.1 Backend — Reports API
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| RP-01 | Create `ReportController` — sales, topItems, export | High | Faris | 1h | ⬜ |
| RP-02 | Create `SalesReportService` — aggregate queries per period | High | Faris | 1.5h | ⬜ |
| RP-03 | Implement daily/weekly/monthly aggregation logic | High | Faris | 1h | ⬜ |
| RP-04 | Implement top-selling items query (JOIN order_items, GROUP BY, ORDER BY count DESC) | High | Faris | 45m | ⬜ |
| RP-05 | Create `SalesReportResource` | Medium | Faris | 20m | ⬜ |
| RP-06 | Create `TopItemResource` | Medium | Faris | 15m | ⬜ |
| RP-07 | Feature tests: sales report by period, top items, empty data | High | Faris | 1h | ⬜ |

### 5.2 Backend — CSV Export
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| EX-01 | Install `openspout/openspout` (lightweight CSV/Excel) | High | Faris | 10m | ⬜ |
| EX-02 | Create `ExportService` — generate CSV from report data | High | Faris | 1h | ⬜ |
| EX-03 | Implement streaming CSV response (large datasets) | Medium | Faris | 45m | ⬜ |
| EX-04 | Create export endpoint with date filter params | High | Faris | 20m | ⬜ |
| EX-05 | Feature tests: CSV export with data, empty export, date filter | Medium | Faris | 45m | ⬜ |

### 5.3 Frontend — Reports Dashboard
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| RD-01 | Create `AdminDashboardPage` — summary cards + charts | High | Athar | 1.5h | ⬜ |
| RD-02 | Create `SummaryCards` — today's revenue, orders count, avg order value | High | Athar | 45m | ⬜ |
| RD-03 | Create `SalesChart` — line/bar chart (Recharts) daily/weekly/monthly | High | Athar | 1h | ⬜ |
| RD-04 | Create `TopItemsChart` — horizontal bar chart of top sellers | Medium | Athar | 45m | ⬜ |
| RD-05 | Create period selector (daily/weekly/monthly toggle) | High | Athar | 30m | ⬜ |
| RD-06 | Create date range picker for custom ranges | Medium | Athar | 45m | ⬜ |
| RD-07 | Add CSV export button — download file from API | Medium | Athar | 30m | ⬜ |
| RD-08 | Add loading states and empty states for all charts | Medium | Athar | 30m | ⬜ |

**Phase 5 Milestone**: Admin dashboard displays sales data. CSV export works.

---

## Phase 6: Admin Dashboard & User Management (Week 6-7)

**Goal**: Complete admin features — user management, table management.

### 6.1 Backend — Table Management
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| TB-01 | Create `Table` model | High | Faris | 10m | ⬜ |
| TB-02 | Create `TableController` — index, store, update, destroy | High | Faris | 1h | ⬜ |
| TB-03 | Create `TableResource` | Medium | Faris | 15m | ⬜ |
| TB-04 | Add table status auto-update when order created/completed | Medium | Faris | 30m | ⬜ |
| TB-05 | Feature tests: CRUD tables, status auto-update | High | Faris | 45m | ⬜ |

### 6.2 Backend — User Management
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| UM-01 | Create `UserController` — index, store, update, toggleActive | High | Faris | 1h | ⬜ |
| UM-02 | Create `StoreUserRequest` & `UpdateUserRequest` | High | Faris | 20m | ⬜ |
| UM-03 | Create `UserResource` (exclude password) | Medium | Faris | 15m | ⬜ |
| UM-04 | Add validation: cannot deactivate self, cannot change own role | Medium | Faris | 20m | ⬜ |
| UM-05 | Feature tests: CRUD users, toggle active, self-protection rules | High | Faris | 1h | ⬜ |

### 6.3 Frontend — Admin Pages
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| AP-01 | Create `TransactionHistoryPage` — table with date filter | High | Athar | 1h | ⬜ |
| AP-02 | Create `TransactionDetailModal` — full order + payment info | Medium | Athar | 45m | ⬜ |
| AP-03 | Create `UserManagementPage` — users table, add/edit modal | High | Athar | 1h | ⬜ |
| AP-04 | Create `UserFormModal` — name, email, password, role select | High | Athar | 45m | ⬜ |
| AP-05 | Create `TableManagementPage` — table grid, add/edit | Medium | Athar | 45m | ⬜ |
| AP-06 | Add confirmation dialogs for destructive actions (delete user, delete menu) | Medium | Athar | 30m | ⬜ |
| AP-07 | Add toast notifications for success/error actions | Medium | Athar | 30m | ⬜ |

**Phase 6 Milestone**: All admin features complete. User, table, and transaction management working.

---

## Phase 7: Integration Testing & Bug Fixing (Week 7)

**Goal**: Stable, bug-free system. All features tested end-to-end.

| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| IT-01 | End-to-end testing: login → create order → pay → queue → complete | High | Both | 2h | ⬜ |
| IT-02 | Test all error states: invalid input, auth errors, 404, server errors | High | Both | 1.5h | ⬜ |
| IT-03 | Test responsive design on tablet viewport (768px and 1024px) | Medium | Athar | 1h | ⬜ |
| IT-04 | Test browser compatibility: Chrome, Firefox, Edge | Medium | Athar | 1h | ⬜ |
| IT-05 | Performance audit: API response times, page load, polling impact | Medium | Faris | 1h | ⬜ |
| IT-06 | Security audit: SQL injection, XSS, CSRF, auth bypass attempts | High | Faris | 1.5h | ⬜ |
| IT-07 | Fix all bugs found — prioritize by severity | High | Both | 4h | ⬜ |
| IT-08 | Ensure all backend tests pass (`php artisan test`) | High | Faris | 30m | ⬜ |
| IT-09 | Ensure frontend builds without errors (`npm run build`) | High | Athar | 15m | ⬜ |
| IT-10 | Code review session — review each other's code | Medium | Both | 2h | ⬜ |

**Phase 7 Milestone**: All tests green. No critical bugs. System stable and performant.

---

## Phase 8: Deployment, Documentation & Open Source Release (Week 8)

**Goal**: Deployed online. Complete documentation. Ready for open source.

### 8.1 Deployment
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| DP-01 | Prepare production `.env` (app key, db creds, cors origins) | High | Faris | 30m | ⬜ |
| DP-02 | Deploy backend to Railway (or similar) | High | Faris | 1h | ⬜ |
| DP-03 | Deploy frontend to Vercel (or similar) | High | Athar | 45m | ⬜ |
| DP-04 | Set up production MySQL database | High | Faris | 30m | ⬜ |
| DP-05 | Run migrations and seeders on production | High | Faris | 15m | ⬜ |
| DP-06 | Configure custom domain (if applicable) | Low | Both | 30m | ⬜ |
| DP-07 | Final smoke test on production environment | High | Both | 30m | ⬜ |

### 8.2 Documentation
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| DC-01 | Write comprehensive `README.md` (overview, features, screenshots, setup, API docs link) | High | Both | 2h | ⬜ |
| DC-02 | Generate API documentation (Scribe / Scramble) | High | Faris | 45m | ⬜ |
| DC-03 | Create Postman collection with all endpoints and examples | Medium | Faris | 1h | ⬜ |
| DC-04 | Write `CONTRIBUTING.md` — guide for open source contributors | Medium | Faris | 45m | ⬜ |
| DC-05 | Write `CHANGELOG.md` for v1.0.0 | Medium | Faris | 30m | ⬜ |
| DC-06 | Add `CODE_OF_CONDUCT.md` | Low | Faris | 15m | ⬜ |
| DC-07 | Add GitHub issue templates (bug report, feature request) | Low | Faris | 20m | ⬜ |
| DC-08 | Add GitHub PR template | Low | Faris | 10m | ⬜ |
| DC-09 | Take screenshots of all pages for README | Medium | Athar | 30m | ⬜ |
| DC-10 | Record demo video / GIF for README | Low | Athar | 30m | ⬜ |

### 8.3 Open Source Release
| Task ID | Task | Priority | Owner | Est. | Status |
|---------|------|----------|-------|------|--------|
| OS-01 | Final repository cleanup (remove unused files, check `.gitignore`) | High | Faris | 30m | ⬜ |
| OS-02 | Tag release v1.0.0 (`git tag v1.0.0`) | High | Faris | 5m | ⬜ |
| OS-03 | Write release notes on GitHub | High | Both | 30m | ⬜ |
| OS-04 | Make repository public | High | Faris | 5m | ⬜ |

**Phase 8 Milestone**: System live online. Documentation complete. GitHub repo public with v1.0.0.

---

## Branch Strategy

```
main              # Production-ready code
├── develop       # Integration branch
│   ├── feat/*    # Feature branches (feat/auth, feat/menu, etc.)
│   ├── fix/*     # Bug fix branches
│   └── chore/*   # Tooling, docs, CI
└── release/*     # Release preparation branches
```

**Rules**:
- `main` is protected — PR required, all CI checks must pass
- `develop` is the default branch for daily work
- Feature branches are short-lived (merge within 1-3 days)
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Integration delays (FE ↔ BE) | Medium | High | Define API contract early; mock API for FE dev |
| Scope creep | Medium | Medium | Strict adherence to PRD v1.0; new features → v2.0 |
| Docker issues on different OS | Low | Medium | Test on Linux, macOS, Windows early |
| Performance with polling | Low | Medium | Optimize queries; add indexes; consider pagination |
| Missing campus deadline | Low | High | Weekly progress check; buffer in Week 7 |

---

## Weekly Progress Check Template

Setiap akhir minggu, cek hal berikut:

```markdown
### Week X Progress Report
- Completed tasks: [list]
- Blocked tasks: [list + reason]
- Next week focus: [summary]
- Risks / Concerns: [any]
```
