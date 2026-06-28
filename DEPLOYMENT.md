# Deployment Gratis: Cloudflare Pages + Render

Panduan ini untuk deploy aplikasi POS dengan frontend di Cloudflare Pages dan backend Laravel di Render.

## 1. Database

Gunakan database MySQL-compatible gratis seperti TiDB Cloud.

Catat credential berikut dari dashboard database:

```env
DB_HOST=
DB_PORT=4000
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
```

Jika provider database memberi port `3306`, gunakan `3306`. TiDB Cloud biasanya memakai `4000`.

## 2. Backend Laravel di Render

Buat service baru di Render:

```txt
Service type: Web Service
Runtime: Docker
Repository: repo project ini
Root directory: backend
Dockerfile path: Dockerfile
Health check path: /api/v1/health
```

Environment variables Render:

```env
APP_NAME=POS Coffee Shop
APP_ENV=production
APP_KEY=base64:ISI_DARI_php_artisan_key_generate_show
APP_DEBUG=false
APP_URL=https://NAMA-BACKEND.onrender.com

FRONTEND_URL=https://NAMA-FRONTEND.pages.dev

LOG_CHANNEL=stderr
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=ISI_DARI_DATABASE
DB_PORT=4000
DB_DATABASE=ISI_DARI_DATABASE
DB_USERNAME=ISI_DARI_DATABASE
DB_PASSWORD=ISI_DARI_DATABASE

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=local
```

Buat `APP_KEY` dari lokal:

```bash
cd backend
php artisan key:generate --show
```

Setelah backend berhasil deploy, jalankan migration di Render Shell:

```bash
php artisan migrate --force
```

Jika butuh data demo untuk dosen, jalankan seeder:

```bash
php artisan db:seed --force
```

Akun demo dari seeder:

```txt
Admin: admin@flocoffee.com / password
Staff: staff@flocoffee.com / password
```

## 3. Frontend React di Cloudflare Pages

Buat project baru di Cloudflare Pages:

```txt
Framework preset: Vite
Repository: repo project ini
Root directory: frontend
Build command: npm run build
Build output directory: dist
```

Environment variable Cloudflare Pages:

```env
VITE_API_URL=https://NAMA-BACKEND.onrender.com
```

File `frontend/public/_redirects` sudah disiapkan agar refresh halaman React Router tidak 404.

## 4. Urutan Deploy

1. Buat database dan simpan credential.
2. Buat Render backend service dari folder `backend`.
3. Isi environment variables Render.
4. Deploy backend.
5. Jalankan `php artisan migrate --force` di Render Shell.
6. Jalankan `php artisan db:seed --force` jika ingin data demo.
7. Buat Cloudflare Pages project dari folder `frontend`.
8. Isi `VITE_API_URL` dengan URL backend Render.
9. Deploy frontend.
10. Update `FRONTEND_URL` di Render dengan URL final Cloudflare Pages, lalu redeploy backend.

## 5. Checklist Test

```txt
Backend health: https://NAMA-BACKEND.onrender.com/api/v1/health
Frontend: https://NAMA-FRONTEND.pages.dev
API login: https://NAMA-BACKEND.onrender.com/api/v1/auth/login
```

Pastikan:

```txt
APP_DEBUG=false
Login berhasil
Dashboard terbuka
Refresh /login atau /dashboard tidak 404
CRUD utama berjalan
```
