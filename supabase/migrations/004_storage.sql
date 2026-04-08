-- ================================================================
-- Kontrakan App — Migration 004: Storage Setup
-- Created: 2026-04-08
-- NOTE: Storage buckets harus dibuat MANUAL di Supabase Dashboard
--       karena permission untuk storage schema memerlukan role postgres.
-- ================================================================

-- ================================================================
-- CARA BUAT STORAGE BUCKET (Pilih salah satu):
--
-- OPSI 1: Via Supabase Dashboard
--   1. Buka https://supabase.com/dashboard → Project → Storage
--   2. Create bucket: tenant-documents (private)
--   3. Create bucket: payment-proofs (private)
--   4. Create bucket: unit-photos (public)
--
-- OPSI 2: Via Supabase CLI
--   npx supabase storage create tenant-documents --public
--   npx supabase storage create payment-proofs --public
--   npx supabase storage create unit-photos --public
--
-- OPSI 3: Via SQL dengan service_role (jalankan di SQL Editor
--          menggunakan connection string service_role)
-- ================================================================

-- Jika Anda menggunakan service_role, uncomment baris berikut:
-- insert into storage.buckets (id, name, public)
-- values ('tenant-documents', 'tenant-documents', false)
-- on conflict (id) do nothing;

-- insert into storage.buckets (id, name, public)
-- values ('payment-proofs', 'payment-proofs', false)
-- on conflict (id) do nothing;

-- insert into storage.buckets (id, name, public)
-- values ('unit-photos', 'unit-photos', true)
-- on conflict (id) do nothing;
