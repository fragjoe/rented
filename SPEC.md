# MVP FINAL – Aplikasi Manajemen Kos / Kontrakan / Parkir

## Overview

Aplikasi manajemen properti multi-lokasi untuk kos, kontrakan, dan parkir. Dibangun dengan **Next.js 15** (App Router), **Tailwind CSS**, **Supabase**, dan di-deploy di **Vercel**.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 15 App Router, React 19, TypeScript, Tailwind CSS |
| Backend | Next.js Server Actions, Supabase Edge Functions |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deploy | Vercel |

## Struktur Data

```
Location
  └── Unit (kamar/parkiran) — milik satu Owner
       └── Contract (kontrak aktif) — satu penyewa
            └── Invoice (tagihan bulanan)
                 └── InvoiceItem (detail biaya)
                      └── Payment (pembayaran)
```

## Aturan Bisnis

- 1 unit = 1 owner (pemilik)
- 1 unit = maksimal 1 kontrak aktif
- Tagihan bersifat **immutable** setelah dibuat (tidak bisa diubah)
- Pembayaran fleksibel (tanpa flag cicilan, bisa bayar sebagian)
- Charge Rules berlaku per lokasi

## Modul

| # | Modul | Deskripsi |
|---|-------|----------|
| 1 | **Users** | Admin & Staff — role-based access |
| 2 | **Locations** | Lokasi properti (nama, alamat, kota) |
| 3 | **Owners** | Pemilik unit (nama, kontak, KTP) |
| 4 | **Units** | Unit (kamar/parkiran) — nomor, tipe, tarif, status |
| 5 | **Customers** | Penyewa (nama, kontak, KTP, kontak darurat) |
| 6 | **Contracts** | Kontrak (tanggal mulai/selesai, tarif bulanan, deposit) |
| 7 | **Charge Types** | Jenis biaya (sewa, air, listrik, maintenance, dll) |
| 8 | **Charge Rules** | Aturan biaya per lokasi (amount, period, shared) |
| 9 | **Invoices** | Tagihan (nomor, periode, due date, status) |
| 10 | **Invoice Items** | Detail tagihan per jenis biaya |
| 11 | **Payments** | Pembayaran (method, amount, date, reference) |
| 12 | **Shared Utilities** | Utilitas bersama per lokasi (listrik, air, gas) |
| 13 | **Maintenance** | Perbaikan unit (deskripsi, tanggal, biaya, vendor) |
| 14 | **Dashboard** | Overview stats |
| 15 | **Reports** | Laporan pendapatan, okupansi, per pemilik |

## Tabel Database

| Table | Path Migration |
|-------|---------------|
| `users` | `supabase/migrations/001_initial_schema.sql` |
| `locations` | `supabase/migrations/001_initial_schema.sql` |
| `owners` | `supabase/migrations/001_initial_schema.sql` |
| `units` | `supabase/migrations/001_initial_schema.sql` |
| `customers` | `supabase/migrations/001_initial_schema.sql` |
| `contracts` | `supabase/migrations/001_initial_schema.sql` |
| `charge_types` | `supabase/migrations/001_initial_schema.sql` |
| `charge_rules` | `supabase/migrations/001_initial_schema.sql` |
| `invoices` | `supabase/migrations/001_initial_schema.sql` |
| `invoice_items` | `supabase/migrations/001_initial_schema.sql` |
| `payments` | `supabase/migrations/001_initial_schema.sql` |
| `shared_utilities` | `supabase/migrations/001_initial_schema.sql` |
| `maintenance` | `supabase/migrations/001_initial_schema.sql` |

## Role & Permission

| Permission | Admin | Staff |
|------------|-------|-------|
| User management | ✅ | ❌ |
| All CRUD | ✅ | ✅ |
| Reports | ✅ | ✅ |

## Design System (Ant Design Pro Inspired)

### Colors
- **Primary**: `#1890ff` (daybreak blue)
- **Success**: `#52c41a`
- **Warning**: `#faad14`
- **Error**: `#ff4d4f`
- **Gray scale**: `#fafafa` → `#141414`

### Spacing
- Mobile content: `p-4`
- Desktop content: `p-6 lg:p-8`
- Card padding: `p-4 md:p-6`

### Components
- Border radius: `8px`
- Cards: `bg-white rounded-lg shadow-sm border`
- Tables: horizontal scroll on mobile

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Deployment

1. Buat project Supabase
2. Jalankan semua migration di `supabase/migrations/`
3. Set environment variables di Vercel dashboard
4. Deploy dari GitHub repository

## Di luar MVP

- Payment gateway
- WhatsApp otomatis
- Booking online
- Multi pemilik per unit
- Meter listrik detail
- Multi perusahaan
