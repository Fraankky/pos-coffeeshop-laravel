# FE.md — Frontend Task List

## React SPA — POS Coffee Shop

**Developer**: Athar Faqih (2300018219)  
**Tech**: React 18 + TypeScript + Vite + Tailwind CSS + Zustand + Recharts  
**Repo**: pos-laravel/frontend/

---

## Phase 0: Scaffolding (Week 1)

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| F-01 | Scaffold React + TypeScript + Vite di `frontend/` | High | 20m | ⬜ |
| F-02 | Install & konfigurasi Tailwind CSS | High | 20m | ⬜ |
| F-03 | Install Zustand (state management) | High | 10m | ⬜ |
| F-04 | Install react-router-dom v6 | High | 10m | ⬜ |
| F-05 | Install react-qr-code | Medium | 5m | ⬜ |
| F-06 | Install Recharts | Medium | 5m | ⬜ |
| F-07 | Install axios | High | 5m | ⬜ |
| F-08 | Setup ESLint + Prettier | Medium | 20m | ⬜ |
| F-09 | Setup path aliases `@/` → `src/` (tsconfig + vite) | Medium | 15m | ⬜ |
| F-10 | Buat base layout (sidebar, header, content slot) | High | 45m | ⬜ |
| F-11 | Setup React Router + halaman placeholder per role | High | 30m | ⬜ |
| F-12 | Buat API client wrapper (axios instance + interceptor) | High | 30m | ⬜ |

---

## Phase 1: Authentication UI (Week 1-2)

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| AU-01 | Buat `authStore` (Zustand) — token, user, login/logout actions | High | 30m | ⬜ |
| AU-02 | Buat `LoginPage` — form validation, error handling, loading state | High | 1h | ⬜ |
| AU-03 | Buat `ProtectedRoute` wrapper — redirect ke /login jika belum auth | High | 20m | ⬜ |
| AU-04 | Buat `RoleRoute` wrapper — restrict halaman berdasarkan role | Medium | 20m | ⬜ |
| AU-05 | Implement axios interceptor — attach Bearer token, auto-logout di 401 | High | 30m | ⬜ |
| AU-06 | Tambah tombol logout di header layout | Medium | 15m | ⬜ |

---

## Phase 2: Menu & Category (Week 2-3)

### Menu Catalog (Staff View)

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| MU-01 | Buat `menuStore` (Zustand) — categories, items, fetch, filter | High | 30m | ⬜ |
| MU-02 | Buat `MenuCatalog` component — tab kategori + grid item | High | 1.5h | ⬜ |
| MU-03 | Buat `MenuItemCard` — gambar, nama, harga, tombol tambah | High | 45m | ⬜ |
| MU-04 | Buat `ItemCustomizationModal` — pilih size, topping, catatan | High | 1h | ⬜ |
| MU-05 | Buat loading skeleton untuk menu items | Medium | 20m | ⬜ |
| MU-06 | Buat empty state (tidak ada item di kategori) | Low | 15m | ⬜ |

### Menu Management (Admin View)

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| AM-01 | Buat `AdminMenuPage` — tabel + tombol aksi | High | 1h | ⬜ |
| AM-02 | Buat `MenuFormModal` — form create/edit menu item (upload gambar) | High | 1h | ⬜ |
| AM-03 | Buat `CategoryManager` — inline CRUD kategori | Medium | 45m | ⬜ |
| AM-04 | Tambah image preview di form upload | Medium | 30m | ⬜ |
| AM-05 | Tambah toggle switch active/inactive per item | Medium | 15m | ⬜ |
| AM-06 | Tambah indikator stok menipis (warna merah) | Medium | 20m | ⬜ |

---

## Phase 3: Order & Payment (Week 3-4)

### Order Workflow (Staff)

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| OC-01 | Buat `cartStore` (Zustand) — items, add/remove/update qty, clear, subtotal/total | High | 45m | ⬜ |
| OC-02 | Buat `OrderPage` — layout utama workflow order staff | High | 1h | ⬜ |
| OC-03 | Buat `CartPanel` — daftar item, kontrol qty, total, tombol checkout | High | 1h | ⬜ |
| OC-04 | Buat `OrderTypeSelector` — Dine-In (pilih meja) / Takeaway | High | 30m | ⬜ |
| OC-05 | Buat `TableSelector` — grid meja available/occupied | High | 45m | ⬜ |
| OC-06 | Buat `PaymentModal` — pilih metode (Cash / QRIS) | High | 1h | ⬜ |
| OC-07 | Buat `CashPayment` — input nominal, kalkulasi kembalian otomatis | High | 45m | ⬜ |
| OC-08 | Buat `QRISPayment` — tampilkan QR code, tombol konfirmasi | High | 45m | ⬜ |
| OC-09 | Buat `ReceiptPreview` — struk digital setelah pembayaran sukses | Medium | 1h | ⬜ |
| OC-10 | Wire full flow: menu → cart → order type → payment → receipt | High | 1h | ⬜ |
| OC-11 | Tambah print struk via `window.print()` + CSS print-specific | Low | 30m | ⬜ |

---

## Phase 4: Staff Queue (Week 4-5)

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| BD-01 | Buat `QueuePage` — layout dengan queue pesanan | High | 1h | ⬜ |
| BD-02 | Buat `OrderQueueList` — grid/daftar pesanan aktif | High | 1h | ⬜ |
| BD-03 | Buat `OrderCard` — detail order, items, catatan, timer sejak dibuat | High | 1h | ⬜ |
| BD-04 | Implement `usePolling` hook — fetch setiap 5 detik, update state | High | 30m | ⬜ |
| BD-05 | Tambah tombol update status: Diterima → Diproses → Selesai | High | 30m | ⬜ |
| BD-06 | Tambah notifikasi audio untuk pesanan baru (opsional) | Low | 20m | ⬜ |
| BD-07 | Tambah indikator umur pesanan (hijau <5m, kuning <10m, merah >10m) | Medium | 30m | ⬜ |
| BD-08 | Tambah animasi transisi saat pesanan muncul/update | Low | 20m | ⬜ |

---

## Phase 5: Reports Dashboard (Week 5-6)

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| RD-01 | Buat `AdminDashboardPage` — summary cards + charts | High | 1.5h | ⬜ |
| RD-02 | Buat `SummaryCards` — pendapatan hari ini, jumlah order, avg order value | High | 45m | ⬜ |
| RD-03 | Buat `SalesChart` — line/bar chart (Recharts) harian/mingguan/bulanan | High | 1h | ⬜ |
| RD-04 | Buat `TopItemsChart` — horizontal bar chart item terlaris | Medium | 45m | ⬜ |
| RD-05 | Buat period selector (toggle: hari / minggu / bulan) | High | 30m | ⬜ |
| RD-06 | Buat date range picker untuk custom range | Medium | 45m | ⬜ |
| RD-07 | Tambah tombol export CSV — download file dari API | Medium | 30m | ⬜ |
| RD-08 | Tambah loading & empty state untuk semua chart | Medium | 30m | ⬜ |

---

## Phase 6: Admin Pages (Week 6-7)

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| AP-01 | Buat `TransactionHistoryPage` — tabel + filter tanggal | High | 1h | ⬜ |
| AP-02 | Buat `TransactionDetailModal` — info lengkap order + payment | Medium | 45m | ⬜ |
| AP-03 | Buat `UserManagementPage` — tabel user, modal tambah/edit | High | 1h | ⬜ |
| AP-04 | Buat `UserFormModal` — form name, email, password, role select | High | 45m | ⬜ |
| AP-05 | Buat `TableManagementPage` — grid meja, tambah/edit | Medium | 45m | ⬜ |
| AP-06 | Tambah confirmation dialog untuk aksi destruktif (delete user, delete menu) | Medium | 30m | ⬜ |
| AP-07 | Tambah toast notification untuk sukses/error | Medium | 30m | ⬜ |

---

## Phase 7: Testing & Polish (Week 7)

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| IT-01 | End-to-end test: login → order → bayar → antrian → selesai | High | 2h | ⬜ |
| IT-02 | Test semua error states (invalid input, auth error, 404, server error) | High | 1.5h | ⬜ |
| IT-03 | Responsive test di tablet viewport (768px & 1024px) | Medium | 1h | ⬜ |
| IT-04 | Browser compatibility: Chrome, Firefox, Edge | Medium | 1h | ⬜ |
| IT-09 | Pastikan `npm run build` sukses tanpa error | High | 15m | ⬜ |
| IT-10 | Code review session (review code BE, review FE by BE) | Medium | 2h | ⬜ |

---

## Phase 8: Deploy & Docs (Week 8)

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| DP-03 | Deploy frontend ke Vercel | High | 45m | ⬜ |
| DC-01 | Tulis README section frontend (fitur, screenshots) | High | 1h | ⬜ |
| DC-09 | Screenshot semua halaman untuk README | Medium | 30m | ⬜ |
| DC-10 | Rekam demo video / GIF | Low | 30m | ⬜ |
| OS-03 | Tulis release notes v1.0.0 | High | 15m | ⬜ |

---

## Shared Tasks (dengan Faris)

| ID | Task | Priority | Est. | Done |
|----|------|----------|------|------|
| SH-01 | Analisis & desain wireframe (Figma) | High | 4h | ⬜ |
| SH-02 | Finalisasi API contract (endpoint + request/response shape) | High | 2h | ⬜ |
| SH-03 | Integrasi FE-BE (Week 5) | High | 8h | ⬜ |
| SH-04 | Bug fixing (Week 7) | High | 4h | ⬜ |
| SH-05 | Final smoke test production | High | 30m | ⬜ |
