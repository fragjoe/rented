# Progress Tracker — Kontrakan App

---

## ✅ SEMUA PHASE SELESAI — BUILD BERHASIL

### Phase 1: Setup Project & Docs
- `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`
- `src/app/globals.css` — custom components (card, form-label, form-input, table, badge variants)
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/not-found.tsx`
- `src/lib/utils/cn.ts` — clsx + tailwind-merge
- `src/lib/utils/format.ts` — formatCurrency (IDR), formatDate, formatMonth, slugify, generateInvoiceNumber
- `SPEC.md`, `PROGRESS.md`, `.env.local.example`, `.gitignore`, `README.md`, `vercel.json`

### Phase 2: Database Schema (Supabase)
- `supabase/migrations/001_initial_schema.sql` — 13 tabel + indexes + default charge_types
- `supabase/migrations/002_rls_policies.sql` — RLS policies + is_admin/is_staff helpers
- `supabase/migrations/003_triggers.sql` — triggers (updated_at, auto profile, unit status, invoice status, audit log)
- `supabase/migrations/004_storage.sql` — storage buckets

### Phase 3: Auth Foundation
- `src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`
- `src/middleware.ts` — protect /dashboard routes
- `src/app/(auth)/actions.ts` — signIn, signUp, signOut
- `src/lib/auth/rbac.ts` — permissions map
- `src/types/auth.ts` — UserRole, SessionUser
- `src/app/(auth)/layout.tsx`, `login/page.tsx`, `login/loading.tsx`

### Phase 4: Dashboard Layout
- `src/components/layout/dashboard-shell.tsx` — mobile-first (overlay sidebar / fixed desktop sidebar)
- `src/components/layout/sidebar-nav.tsx` — collapsible group navigation
- `src/components/dashboard/page-template.tsx`, `stats-card.tsx`, `data-table.tsx`
- `src/app/(dashboard)/layout.tsx`, `error.tsx`, `loading.tsx`, `page.tsx`

### Phase 5: Core CRUD Pages
- Locations: list, new, [id] detail
- Owners: list, new, [id] detail
- Units: list (dengan filter lokasi), new, [id] detail (dengan kontrak preview)
- Customers: list, new, [id] detail (dengan kontrak preview)
- Contracts: list, new, [id] detail (dengan tagihan preview)

### Phase 6: Billing Modules
- Charge Types: list, new
- Charge Rules: list, new
- Invoices: list (dengan filter status), new, [id] detail (dengan items + payments)
- Payments: list, new
- `src/components/forms/invoice-item-form.tsx`

### Phase 7: Secondary Modules
- Shared Utilities: list, new
- Maintenance: list, new

### Phase 8: Dashboard & Reports
- `src/app/(dashboard)/reports/page.tsx` — revenue, occupancy, overdue
- `src/app/(dashboard)/settings/page.tsx` — profile settings

### Phase 9: UI Polish
- `src/components/ui/empty-state.tsx`, `skeleton.tsx`, `button.tsx`, `input.tsx`, `card.tsx`, `badge.tsx`, `dialog.tsx`
- `src/types/database.ts` — full Database types

### Phase 10: Deployment
- `vercel.json` — Vercel config

---

## Build Status
```
✓ Build successful — 29 routes compiled
✓ First Load JS: ~102-116 kB per page
✓ TypeScript: no errors
```

---

## Langkah Selanjutnya (User Action Required)

### 1. Setup Supabase
```bash
# 1. Buat project di https://supabase.com
# 2. Jalankan migration di SQL Editor:
#    - salin isi supabase/migrations/001_initial_schema.sql
#    - salin isi supabase/migrations/002_rls_policies.sql
#    - salin isi supabase/migrations/003_triggers.sql
#    - salin isi supabase/migrations/004_storage.sql
```

### 2. Environment Variables
```bash
cp .env.local.example .env.local
# Isi NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
```

### 3. Generate Types
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

### 4. Buat Admin User
```bash
# Di Supabase Dashboard → Authentication → Create user
# Set role = 'admin' di tabel public.users
```

### 5. Deploy Vercel
```bash
npm i -g vercel
vercel deploy
# Set environment variables di Vercel dashboard
```
