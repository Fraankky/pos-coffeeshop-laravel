# PRD — POS Coffee Shop (Laravel Edition)

## Product Requirements Document — v1.0

**Project**: POS Coffee Shop — Laravel REST API + React SPA  
**Team**: Muhammad Faris (2300018225) — Backend · Athar Faqih (2300018219) — Frontend  
**License**: MIT (Open Source)  
**Target**: Campus coffee shop single-outlet operations

---

## 1. Executive Summary

Sistem **Point-of-Sale (POS) Coffee Shop** adalah aplikasi web open-source yang
dirancang untuk mengelola transaksi penjualan di coffee shop kampus. Sistem ini
mencakup antarmuka untuk dua peran: **Staff** dan **Admin/Manajer**.

Proyek ini menggunakan arsitektur **decoupled**:  
- **Backend**: Laravel REST API (PHP 8.2+)  
- **Frontend**: React.js SPA (TypeScript, Vite, Tailwind CSS)  
- **Database**: MySQL 8  
- **Infra**: Docker Compose (dev) · Vercel + Railway (prod)

---

## 2. Goals & Non-Goals

### 2.1 Goals (v1.0)

| ID | Goal | Measure |
|----|------|---------|
| G1 | Proses transaksi cepat (<2 detik) | Page load & API response time |
| G2 | Zero human error dalam kalkulasi kembalian | Automasi kalkulasi |
| G3 | Staff dapat melihat antrian pesanan real-time | Polling ≤5 detik |
| G4 | Admin memiliki laporan penjualan akurat | Laporan harian/mingguan/bulanan |
| G5 | Open-source siap digunakan oleh coffee shop lain | README + Docker setup |
| G6 | Codebase bersih dan mudah dimaintain | PSR-12, PHPStan level 8, test coverage ≥70% |

### 2.2 Non-Goals (v1.0)

- Multi-outlet / multi-tenant support
- Integrasi payment gateway real (QRIS hanya simulasi)
- Integrasi hardware printer thermal / cash drawer
- Aplikasi mobile native
- Real-time WebSocket (diganti polling)

---

## 3. User Personas & Roles

| Role | Deskripsi | Hak Akses |
|------|-----------|-----------|
| **Staff** | Input pesanan, proses pembayaran, melihat antrian, update status | `staff` |
| **Admin** | Kelola menu, lihat laporan, manajemen pengguna | `admin` |

Autentikasi berbasis **Laravel Sanctum** (token-based SPA authentication).

---

## 4. Functional Requirements

### FR-01: Authentication & Authorization
- Login/logout menggunakan email + password
- Role-based access control minimal (`staff`, `admin`)
- Token SPA via Laravel Sanctum
- Session expiry setelah inactivity
- Password hashing dengan bcrypt

### FR-02: Order Input (Staff)
- Pilih tipe pesanan: Dine-In (pilih meja) atau Takeaway
- Tambah item menu ke keranjang
- Kustomisasi item: ukuran (Small/Regular/Large), topping, catatan khusus
- Hapus/edit item dari keranjang
- Lihat total pesanan secara real-time

### FR-03: Menu Management (Admin)
- CRUD kategori menu
- CRUD item menu (nama, harga, gambar, kategori)
- Toggle aktif/nonaktif item
- Manajemen stok: update qty, threshold stok menipis
- Upload gambar menu (storage: Laravel Filesystem)

### FR-04: Cash Payment
- Masukkan nominal pembayaran tunai
- Sistem menghitung kembalian otomatis
- Validasi nominal ≥ total belanja
- Tampilkan struk digital setelah pembayaran berhasil

### FR-05: QRIS Simulation
- Generate QR code berisi nominal transaksi (client-side: react-qr-code)
- Tidak ada koneksi ke payment gateway eksternal
- Staff mengonfirmasi pembayaran secara manual
- Status pembayaran: pending → confirmed / cancelled

### FR-06: Table Management
- Daftar meja dengan nomor dan kapasitas
- Status meja: available / occupied
- Meja otomatis di-assign saat pesanan Dine-In

### FR-07: Staff Queue (Real-time via Polling)
- Staff melihat daftar pesanan aktif (belum selesai)
- Polling endpoint setiap 5 detik untuk update
- Update status pesanan: Received → In Progress → Completed
- Tampilkan detail item dan catatan kustomisasi

### FR-08: Transaction History
- Admin melihat semua transaksi selesai
- Filter berdasarkan tanggal (range picker)
- Detail setiap transaksi: item, pembayaran, waktu, staff

### FR-09: Sales Reports (Admin)
- Dashboard dengan ringkasan: total penjualan hari ini, order hari ini
- Grafik penjualan harian/mingguan/bulanan (Recharts)
- Top-selling items
- Revenue summary

### FR-10: CSV Export
- Ekspor laporan penjualan ke CSV
- Filter berdasarkan rentang tanggal
- Library: Laravel Excel (maatwebsite) atau openspout

---

## 5. Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | API response < 200ms (local), page load < 2s |
| NFR-02 | Security | Sanctum auth, bcrypt hashing, input validation, CORS config |
| NFR-03 | Usability | UI intuitif; tanpa training >15 menit bisa transaksi penuh |
| NFR-04 | Compatibility | Chrome, Firefox, Edge modern; responsive ≥768px |
| NFR-05 | Scalability | Modular architecture; controller-service-repository pattern |
| NFR-06 | Maintainability | PSR-12 code style, PHPStan level 8, documented API |
| NFR-07 | Portability | Docker Compose untuk local dev; deploy ke Vercel + Railway |
| NFR-08 | Testability | PHPUnit test coverage ≥70%, Pest preferred |

---

## 6. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Backend | Laravel 11 (PHP 8.2+) | Mature ecosystem, Eloquent ORM, Artisan CLI |
| API Auth | Laravel Sanctum | SPA token auth, simple setup |
| Database | MySQL 8 | Widely available, great Laravel support |
| Frontend | React 18 + TypeScript + Vite | Type safety, fast DX |
| Styling | Tailwind CSS 3 | Utility-first, responsive |
| State Mgmt | Zustand | Lightweight, simple API |
| QR Code | react-qr-code | Client-side QR generation |
| Charts | Recharts | React-native charting |
| Container | Docker + Docker Compose | One-command setup |
| CI/CD | GitHub Actions | Automated linting, testing |
| Code Quality | Laravel Pint, PHPStan, ESLint | Consistent code style |
| Testing | PHPUnit/Pest + React Testing Library | Unit + Feature + E2E |
| Deployment | Vercel (FE) + Railway (BE) | Free tier friendly |

---

## 7. Project Structure (Monorepo)

```
pos-laravel/
├── backend/                  # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/V1/
│   │   │   ├── Middleware/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   ├── Services/
│   │   ├── Repositories/
│   │   └── Enums/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── routes/
│   │   └── api.php
│   ├── tests/
│   │   ├── Feature/
│   │   └── Unit/
│   ├── composer.json
│   ├── Dockerfile
│   └── phpunit.xml
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── lib/
│   │   └── types/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── docker/
│   ├── nginx/
│   └── php/
├── docker-compose.yml
├── .github/
│   └── workflows/
├── PLAN.md
├── DB_DESIGN.md
└── README.md
```

---

## 8. API Convention

| Aspect | Convention |
|--------|-----------|
| Base URL | `/api/v1/` |
| Auth Header | `Authorization: Bearer {token}` |
| Content-Type | `application/json` |
| Response Format | `{ "data": {...}, "message": "...", "errors": {...} }` |
| Pagination | `?page=1&per_page=15` |
| HTTP Verbs | GET (read), POST (create), PUT/PATCH (update), DELETE (delete) |
| Status Codes | 200, 201, 204, 400, 401, 403, 404, 422, 500 |

---

## 9. API Endpoints (v1)

### Auth
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/login` | Public | Login |
| POST | `/api/v1/auth/logout` | Authenticated | Logout |
| GET | `/api/v1/auth/me` | Authenticated | Current user |

### Categories
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/categories` | Authenticated | List categories |
| POST | `/api/v1/categories` | Admin | Create category |
| PUT | `/api/v1/categories/{id}` | Admin | Update category |
| DELETE | `/api/v1/categories/{id}` | Admin | Delete category |

### Menu Items
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/menu-items` | Authenticated | List menu items |
| GET | `/api/v1/menu-items/{id}` | Authenticated | Detail menu item |
| POST | `/api/v1/menu-items` | Admin | Create menu item |
| PUT | `/api/v1/menu-items/{id}` | Admin | Update menu item |
| DELETE | `/api/v1/menu-items/{id}` | Admin | Delete menu item |
| PATCH | `/api/v1/menu-items/{id}/stock` | Staff/Admin | Update stock |

### Tables
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/tables` | Authenticated | List tables |
| POST | `/api/v1/tables` | Admin | Create table |
| PUT | `/api/v1/tables/{id}` | Admin | Update table |
| DELETE | `/api/v1/tables/{id}` | Admin | Delete table |

### Orders
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/orders` | Authenticated | List orders (filterable) |
| GET | `/api/v1/orders/{id}` | Authenticated | Detail order |
| POST | `/api/v1/orders` | Staff/Admin | Create order |
| PATCH | `/api/v1/orders/{id}/status` | Staff/Admin | Update order status |
| GET | `/api/v1/orders/active` | Staff/Admin | Get active orders (polling) |

### Payments
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/orders/{id}/payment` | Staff/Admin | Process payment |
| GET | `/api/v1/orders/{id}/payment` | Authenticated | Get payment details |

### Reports
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/reports/sales` | Admin | Sales report (query params: period, from, to) |
| GET | `/api/v1/reports/top-items` | Admin | Top selling items |
| GET | `/api/v1/reports/export` | Admin | Export CSV |

### Users (Admin)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/users` | Admin | List users |
| POST | `/api/v1/users` | Admin | Create user |
| PUT | `/api/v1/users/{id}` | Admin | Update user |
| PATCH | `/api/v1/users/{id}/toggle` | Admin | Activate/deactivate user |

---

## 10. Open Source Checklist

- [x] MIT License
- [ ] Comprehensive README (setup, usage, contributing)
- [ ] Docker Compose one-command setup
- [ ] `.env.example` with all required variables
- [ ] Database seeders for demo data
- [ ] API documentation (Scribe/Scramble)
- [ ] Postman collection
- [ ] CHANGELOG.md
- [ ] CONTRIBUTING.md
- [ ] CODE_OF_CONDUCT.md
- [ ] GitHub issue templates
- [ ] GitHub PR template
- [ ] CI/CD pipeline (lint, test, build)
