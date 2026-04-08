-- ================================================================
-- Kontrakan App — Migration 002: RLS Policies
-- Created: 2026-04-08
-- FIX: Remove with check from SELECT/DELETE policies (only INSERT/UPDATE)
-- ================================================================

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.locations enable row level security;
alter table public.owners enable row level security;
alter table public.units enable row level security;
alter table public.customers enable row level security;
alter table public.contracts enable row level security;
alter table public.charge_types enable row level security;
alter table public.charge_rules enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;
alter table public.shared_utilities enable row level security;
alter table public.maintenance enable row level security;

-- Force RLS for service role
alter table public.users force row level security;
alter table public.locations force row level security;
alter table public.owners force row level security;
alter table public.units force row level security;
alter table public.customers force row level security;
alter table public.contracts force row level security;
alter table public.charge_types force row level security;
alter table public.charge_rules force row level security;
alter table public.invoices force row level security;
alter table public.invoice_items force row level security;
alter table public.payments force row level security;
alter table public.shared_utilities force row level security;
alter table public.maintenance force row level security;

-- ================================================================
-- Helper: check if current user is admin
-- ================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
    select exists (
        select 1 from public.users
        where id = auth.uid()
          and role = 'admin'
          and is_active = true
          and deleted_at is null
    );
$$;

-- ================================================================
-- Helper: check if current user is staff or admin
-- ================================================================
create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
as $$
    select exists (
        select 1 from public.users
        where id = auth.uid()
          and is_active = true
          and deleted_at is null
    );
$$;

-- ================================================================
-- USERS policies
-- Note: Admin manages users through SQL Editor, not RLS
-- Staff can only view their own profile
-- ================================================================
create policy "Users can view their own profile"
    on public.users for select
    using (auth.uid() = id and deleted_at is null);

create policy "Admins can view all users"
    on public.users for select
    using (public.is_admin());

create policy "Admins can insert users"
    on public.users for insert
    with check (public.is_admin());

create policy "Admins can update users"
    on public.users for update
    using (public.is_admin())
    with check (public.is_admin());

-- ================================================================
-- LOCATIONS policies
-- All staff can manage locations
-- ================================================================
create policy "Staff can view locations"
    on public.locations for select
    using (is_active = true and deleted_at is null and public.is_staff());

create policy "Staff can insert locations"
    on public.locations for insert
    with check (public.is_staff());

create policy "Staff can update locations"
    on public.locations for update
    using (public.is_staff())
    with check (public.is_staff());

create policy "Staff can delete locations (soft)"
    on public.locations for delete
    using (public.is_staff());

-- ================================================================
-- OWNERS policies
-- All staff can manage owners
-- ================================================================
create policy "Staff can view owners"
    on public.owners for select
    using (public.is_staff());

create policy "Staff can insert owners"
    on public.owners for insert
    with check (public.is_staff());

create policy "Staff can update owners"
    on public.owners for update
    using (public.is_staff())
    with check (public.is_staff());

create policy "Staff can delete owners (soft)"
    on public.owners for delete
    using (public.is_staff());

-- ================================================================
-- UNITS policies
-- ================================================================
create policy "Staff can view units"
    on public.units for select
    using (public.is_staff());

create policy "Staff can insert units"
    on public.units for insert
    with check (public.is_staff());

create policy "Staff can update units"
    on public.units for update
    using (public.is_staff())
    with check (public.is_staff());

create policy "Staff can delete units (soft)"
    on public.units for delete
    using (public.is_staff());

-- ================================================================
-- CUSTOMERS policies
-- ================================================================
create policy "Staff can view customers"
    on public.customers for select
    using (public.is_staff());

create policy "Staff can insert customers"
    on public.customers for insert
    with check (public.is_staff());

create policy "Staff can update customers"
    on public.customers for update
    using (public.is_staff())
    with check (public.is_staff());

create policy "Staff can delete customers (soft)"
    on public.customers for delete
    using (public.is_staff());

-- ================================================================
-- CONTRACTS policies
-- ================================================================
create policy "Staff can view contracts"
    on public.contracts for select
    using (public.is_staff());

create policy "Staff can insert contracts"
    on public.contracts for insert
    with check (public.is_staff());

create policy "Staff can update contracts"
    on public.contracts for update
    using (public.is_staff())
    with check (public.is_staff());

create policy "Staff can delete contracts (soft)"
    on public.contracts for delete
    using (public.is_staff());

-- ================================================================
-- CHARGE TYPES policies
-- Admin: full management | Staff: view only
-- ================================================================
create policy "Staff can view charge types"
    on public.charge_types for select
    using (public.is_staff());

create policy "Admins can insert charge types"
    on public.charge_types for insert
    with check (public.is_admin());

create policy "Admins can update charge types"
    on public.charge_types for update
    using (public.is_admin())
    with check (public.is_admin());

-- ================================================================
-- CHARGE RULES policies
-- All staff can manage
-- ================================================================
create policy "Staff can view charge rules"
    on public.charge_rules for select
    using (public.is_staff());

create policy "Staff can insert charge rules"
    on public.charge_rules for insert
    with check (public.is_staff());

create policy "Staff can update charge rules"
    on public.charge_rules for update
    using (public.is_staff())
    with check (public.is_staff());

create policy "Staff can delete charge rules"
    on public.charge_rules for delete
    using (public.is_staff());

-- ================================================================
-- INVOICES policies
-- ================================================================
create policy "Staff can view invoices"
    on public.invoices for select
    using (public.is_staff());

create policy "Staff can insert invoices"
    on public.invoices for insert
    with check (public.is_staff());

create policy "Staff can update invoices"
    on public.invoices for update
    using (public.is_staff())
    with check (public.is_staff());

create policy "Staff can delete invoices (soft)"
    on public.invoices for delete
    using (public.is_staff());

-- ================================================================
-- INVOICE ITEMS policies
-- ================================================================
create policy "Staff can view invoice items"
    on public.invoice_items for select
    using (public.is_staff());

create policy "Staff can insert invoice items"
    on public.invoice_items for insert
    with check (public.is_staff());

create policy "Staff can update invoice items"
    on public.invoice_items for update
    using (public.is_staff())
    with check (public.is_staff());

create policy "Staff can delete invoice items"
    on public.invoice_items for delete
    using (public.is_staff());

-- ================================================================
-- PAYMENTS policies
-- ================================================================
create policy "Staff can view payments"
    on public.payments for select
    using (public.is_staff());

create policy "Staff can insert payments"
    on public.payments for insert
    with check (public.is_staff());

create policy "Staff can update payments"
    on public.payments for update
    using (public.is_staff())
    with check (public.is_staff());

create policy "Staff can delete payments (soft)"
    on public.payments for delete
    using (public.is_staff());

-- ================================================================
-- SHARED UTILITIES policies
-- ================================================================
create policy "Staff can view shared utilities"
    on public.shared_utilities for select
    using (public.is_staff());

create policy "Staff can insert shared utilities"
    on public.shared_utilities for insert
    with check (public.is_staff());

create policy "Staff can update shared utilities"
    on public.shared_utilities for update
    using (public.is_staff())
    with check (public.is_staff());

create policy "Staff can delete shared utilities"
    on public.shared_utilities for delete
    using (public.is_staff());

-- ================================================================
-- MAINTENANCE policies
-- ================================================================
create policy "Staff can view maintenance"
    on public.maintenance for select
    using (public.is_staff());

create policy "Staff can insert maintenance"
    on public.maintenance for insert
    with check (public.is_staff());

create policy "Staff can update maintenance"
    on public.maintenance for update
    using (public.is_staff())
    with check (public.is_staff());

create policy "Staff can delete maintenance"
    on public.maintenance for delete
    using (public.is_staff());
