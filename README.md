# Kontrakan App

Aplikasi manajemen kos / kontrakan / parkir. Built with Next.js 15, Tailwind CSS, Supabase, deployed on Vercel.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deploy**: Vercel

## Features

- Multi-location property management
- Owner, unit, customer, contract management
- Dynamic billing (charge types + charge rules)
- Invoice & payment tracking
- Shared utilities per location
- Maintenance tracking
- Reports (revenue, occupancy, per-owner)
- Role-based access (Admin + Staff)
- Mobile-first responsive design

## Setup

### 1. Clone & Install

```bash
npm install
```

### 2. Supabase Setup

1. Buat project baru di [supabase.com](https://supabase.com)
2. Jalankan semua migration:

```bash
# Paste isi supabase/migrations/001_initial_schema.sql ke Supabase SQL Editor
# Paste isi supabase/migrations/002_rls_policies.sql ke Supabase SQL Editor
# Paste isi supabase/migrations/003_triggers.sql ke Supabase SQL Editor
# Paste isi supabase/migrations/004_storage.sql ke Supabase SQL Editor
```

3. Copy environment variables dari `.env.local.example` ke `.env.local`

### 3. Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Generate Supabase Types

```bash
npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
```

### 5. Run Dev Server

```bash
npm run dev
```

### 6. Create Admin User

1. Buka aplikasi di browser
2. Gunakan Supabase Dashboard → Authentication → Create user
3. Set role menjadi `admin` di tabel `users`

## Deployment

### Vercel

1. Push ke GitHub repository
2. Import project di [vercel.com](https://vercel.com)
3. Set environment variables di Vercel dashboard
4. Deploy

## Database Schema

```
locations → units → owners
              ↓
          contracts → customers
               ↓
            invoices → invoice_items → payments
               ↓
         shared_utilities
               ↓
           maintenance
```

## Dokumentasi

- [SPEC.md](SPEC.md) — Spesifikasi lengkap project
- [PROGRESS.md](PROGRESS.md) — Tracker progress development
