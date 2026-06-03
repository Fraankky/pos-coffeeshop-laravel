# Access Control

## Role

Aplikasi hanya memakai dua role:

| Role | Deskripsi |
| --- | --- |
| `staff` | Operator harian POS. |
| `admin` | Pengelola sistem dan data. |

## Route Frontend

| Path | Role |
| --- | --- |
| `/login` | Publik |
| `/staff` | `staff`, `admin` |
| `/admin` | `admin` |
| `/admin/menu` | `admin` |
| `/admin/users` | `admin` |
| `/admin/tables` | `admin` |
| `/admin/transactions` | `admin` |

## Route API

Semua route selain login berada di bawah `auth:sanctum`.

| Resource | Method/Action | Role |
| --- | --- | --- |
| Auth | logout, me | `staff`, `admin` |
| Categories | list, show | `staff`, `admin` |
| Categories | create, update, delete | `admin` |
| Menu Items | list, show | `staff`, `admin` |
| Menu Items | stock update | `staff`, `admin` |
| Menu Items | create, update, delete | `admin` |
| Tables | list, show | `staff`, `admin` |
| Tables | create, update, delete | `admin` |
| Orders | active, list, show, create, update status | `staff`, `admin` |
| Payments | process, show | `staff`, `admin` |
| Reports | sales, top items, export | `admin` |
| Users | list, create, update, toggle active | `admin` |

## Catatan Implementasi

- Middleware backend memakai alias `role` dan menerima satu atau lebih role, misalnya `role:staff,admin`.
- Frontend memakai `ProtectedRoute` untuk membatasi halaman berdasarkan role user.
- Validasi role user memakai `App\Models\User::ROLES`, sehingga role yang valid hanya `staff` dan `admin`.
- Tidak ada backward compatibility untuk data lama `kasir`/`barista`; migrasi fresh memakai default `staff`.
