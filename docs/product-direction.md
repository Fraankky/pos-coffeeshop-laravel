# Product Direction

## Ringkasan

POS Coffee Shop diarahkan sebagai aplikasi operasional untuk coffee shop kecil/kampus. Model akses tidak lagi memisahkan `kasir` dan `barista` sebagai role user karena dalam kasus operasional ini pekerjaan order, pembayaran, dan pembuatan pesanan sering dikerjakan oleh orang yang sama.

Role resmi aplikasi sekarang:

| Role | Fungsi |
| --- | --- |
| `staff` | Menjalankan workflow POS harian: input order, proses pembayaran, melihat antrian, dan update status pesanan. |
| `admin` | Mengelola konfigurasi, master data, user, laporan, dan tetap bisa mengakses workflow staff bila diperlukan. |

## Prinsip Desain

- Role mengikuti realitas operasional, bukan struktur organisasi yang terlalu formal.
- Fitur dipisahkan berdasarkan workflow, bukan berdasarkan jabatan kasir/barista.
- RBAC dibuat minimal agar mudah dipahami dan tidak menambah kompleksitas yang tidak perlu.
- Backend tetap menjadi sumber kebenaran akses, frontend hanya membantu navigasi dan UX.

## Workflow Staff

Staff bekerja dari halaman `/staff` dengan dua area utama:

| Area | Tujuan |
| --- | --- |
| Order | Pilih menu, atur meja/takeaway, tambah item, buat order, dan konfirmasi pembayaran. |
| Antrian | Melihat pesanan aktif dan mengubah status `received` -> `in_progress` -> `completed` atau `cancelled`. |

## Workflow Admin

Admin bekerja dari halaman `/admin` dan turunannya:

| Area | Tujuan |
| --- | --- |
| Dashboard | Ringkasan performa dan metrik penjualan. |
| Menu | Kelola item menu dan stok. |
| Users | Kelola akun `staff` dan `admin`. |
| Tables | Kelola meja. |
| Transactions | Riwayat transaksi dan order. |
| Reports | Laporan sales, top items, dan export CSV. |

## Keputusan Akses

Tidak dibuat permission matrix seperti `order.create`, `payment.create`, atau `queue.update` karena untuk scope project ini terlalu granular. Akses cukup dibagi menjadi dua kelompok:

| Endpoint/Fitur | `staff` | `admin` |
| --- | --- | --- |
| Login/logout/me | Ya | Ya |
| Lihat category/menu/table | Ya | Ya |
| Buat order | Ya | Ya |
| Proses payment | Ya | Ya |
| Lihat dan update antrian order | Ya | Ya |
| Update stok menu | Ya | Ya |
| CRUD category/menu/table | Tidak | Ya |
| User management | Tidak | Ya |
| Reports/export | Tidak | Ya |

## Dampak Perubahan

- Role `kasir` dan `barista` digabung menjadi `staff`.
- Demo credential staff menjadi `staff@pos.coffee`.
- Route frontend utama untuk operasional menjadi `/staff`.
- Admin user management hanya membuat role `staff` atau `admin`.
- Dokumen dan implementasi tidak lagi memperlakukan kasir/barista sebagai role terpisah.
