# Docker Setup Guide

> Panduan lengkap menjalankan POS Coffee Shop dengan Docker

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Linux / macOS / Windows)
- [Git](https://git-scm.com/)
- Port **8000**, **3307**, **8080** tidak digunakan (atau ganti di `docker-compose.yml`)

---

## 1. Clone & Masuk

```bash
git clone https://github.com/your-org/pos-laravel
cd pos-laravel
```

---

## 2. Start Services

```bash
docker compose up -d
```

Ini akan:
- Build image PHP 8.2-FPM dengan ekstensi yang diperlukan
- Pull image Nginx 1.25, MySQL 8.0, phpMyAdmin
- Buat network `pos-laravel_pos-network`
- Buat volume `mysql-data` untuk persistensi database

### Cek status

```bash
docker compose ps
```

Semua service harus `Up` (healthy):

```
NAME             SERVICE      STATUS          PORTS
pos-php          php          Up              ...
pos-nginx        nginx        Up              0.0.0.0:8000->80/tcp
pos-mysql        mysql        Up (healthy)    0.0.0.0:3307->3306/tcp
pos-phpmyadmin   phpmyadmin   Up              0.0.0.0:8080->80/tcp
```

---

## 3. Install Backend & Seed Data

```bash
# Install Composer dependencies (pertama kali saja)
docker compose exec php composer install

# Generate APP_KEY (pertama kali saja)
docker compose exec php php artisan key:generate

# Jalankan migrasi + seed demo data
docker compose exec php php artisan migrate --seed
```

### Cek database

```bash
docker compose exec php php artisan tinker
> \App\Models\User::count();     // = 3
> \App\Models\Category::count();  // = 5
> \App\Models\MenuItem::count();  // = 20
> \App\Models\Table::count();     // = 10
```

---

## 4. Jalankan Backend Tests

```bash
docker compose exec php php artisan test
# Output: 66 passed, 112 assertions
```

---

## 5. Akses Aplikasi

| Service | URL |
|---------|-----|
| Laravel API | http://localhost:8000 |
| phpMyAdmin | http://localhost:8080 |
| React Frontend | http://localhost:5173 (jalankan `cd frontend && npm run dev`) |

### phpMyAdmin Login

- Server: `mysql`
- Username: `root`
- Password: `root_password`

---

## 6. Service Details

### Port Mapping

| Service | Internal | External | Fungsi |
|---------|----------|----------|--------|
| Nginx | 80 | 8000 | Laravel API reverse proxy |
| MySQL | 3306 | 3307 | Database (internal tetap 3306) |
| phpMyAdmin | 80 | 8080 | Adminer database |

### Docker Network

Semua service berada di bridge network `pos-laravel_pos-network`.
Service dapat saling mengakses via **service name** (e.g., `mysql`, `php`, `nginx`).

---

## 7. Common Docker Commands

### Stop services (data tetap aman)

```bash
docker compose down
```

### Stop + hapus volume database

```bash
docker compose down -v
```

⚠️ **Hati-hati**: `-v` menghapus semua data MySQL.

### Lihat log

```bash
# Semua service
docker compose logs -f

# Service tertentu
docker compose logs -f php
docker compose logs -f mysql
docker compose logs -f nginx
```

### Masuk ke container

```bash
docker compose exec php bash
docker compose exec mysql bash
docker compose exec nginx sh
```

### Rebuild image (setelah ubah Dockerfile)

```bash
docker compose build php
docker compose up -d
```

### Restart service

```bash
docker compose restart php
docker compose restart nginx
```

---

## 8. Reset Database

```bash
# Hapus + buat ulang semua tabel + seed
docker compose exec php php artisan migrate:fresh --seed
```

---

## 9. Troubleshooting

### Port 3306 sudah dipakai

Error: `port is already allocated`

Solusi:
1. Hentikan MySQL lokal: `sudo systemctl stop mysql`
2. Atau ganti port MySQL eksternal di `docker-compose.yml`:

```yaml
ports:
  - "3308:3306"   # Ganti 3307 → 3308
```

### Permission denied saat composer

```bash
# Pastikan direktori backend writable
sudo chown -R 1000:1000 backend/
docker compose restart php
```

### Database connection refused

```bash
# Pastikan MySQL sudah healthy
docker compose ps

# Cek koneksi
docker compose exec php php artisan tinker
> DB::connection()->getPdo();
```

### Frontend tidak bisa connect ke API

```bash
# Pastikan API bisa diakses
curl http://localhost:8000/api/v1/categories

# Jika pakai proxy Vite, pastikan sudah benar di vite.config.ts
```

---

## 10. One-Command Setup

```bash
git clone https://github.com/your-org/pos-laravel
cd pos-laravel
docker compose up -d
docker compose exec php composer install
docker compose exec php php artisan key:generate
docker compose exec php php artisan migrate --seed
cd frontend && npm install && npm run dev
```

Selesai. Buka http://localhost:5173 dan login dengan:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@flocoffee.com | password |
| Staff | staff@flocoffee.com | password |
