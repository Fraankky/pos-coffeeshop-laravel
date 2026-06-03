# API Overview

Base URL API: `/api/v1`.

## Auth

| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| POST | `/auth/login` | Login dan mendapatkan Sanctum token. |
| POST | `/auth/logout` | Logout dan revoke token aktif. |
| GET | `/auth/me` | Mengambil data user aktif. |

## Staff Workflow

| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| GET | `/categories` | Daftar kategori aktif. |
| GET | `/menu-items` | Daftar menu untuk POS. |
| GET | `/tables` | Daftar meja. |
| POST | `/orders` | Membuat order baru. |
| GET | `/orders/active` | Mengambil antrian order aktif. |
| GET | `/orders` | Mengambil daftar order. |
| GET | `/orders/{order}` | Detail order. |
| PATCH | `/orders/{order}/status` | Mengubah status order. |
| POST | `/orders/{order}/payment` | Memproses pembayaran. |
| GET | `/orders/{order}/payment` | Melihat payment order. |
| PATCH | `/menu-items/{menuItem}/stock` | Mengubah stok menu. |

## Admin Management

| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| POST | `/categories` | Membuat kategori. |
| PUT | `/categories/{category}` | Mengubah kategori. |
| DELETE | `/categories/{category}` | Menghapus kategori. |
| POST | `/menu-items` | Membuat menu item. |
| PUT | `/menu-items/{menuItem}` | Mengubah menu item. |
| DELETE | `/menu-items/{menuItem}` | Menghapus menu item. |
| POST | `/tables` | Membuat meja. |
| PUT | `/tables/{table}` | Mengubah meja. |
| DELETE | `/tables/{table}` | Menghapus meja. |
| GET | `/users` | Daftar user. |
| POST | `/users` | Membuat user. |
| PUT | `/users/{user}` | Mengubah user. |
| PATCH | `/users/{user}/toggle` | Aktivasi/nonaktivasi user. |
| GET | `/reports/sales` | Laporan sales. |
| GET | `/reports/top-items` | Laporan menu terlaris. |
| GET | `/reports/export` | Export CSV laporan sales. |
