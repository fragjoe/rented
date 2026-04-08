-- ================================================================
-- Kontrakan App — Migration 001: Initial Schema
-- Created: 2026-04-08
-- ================================================================

-- Enable UUID
create extension if not exists "uuid-ossp";

-- ================================================================
-- USERS (extends Supabase auth.users)
-- ================================================================
create table if not exists public.users (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    full_name text not null default '',
    phone text,
    role text not null default 'staff' check (role in ('admin', 'staff')),
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

create index if not exists idx_users_role on public.users(role);
create index if not exists idx_users_is_active on public.users(is_active) where deleted_at is null;

-- ================================================================
-- LOCATIONS
-- ================================================================
create table if not exists public.locations (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    address text not null default '',
    city text not null default '',
    postal_code text,
    description text,
    is_active boolean not null default true,
    created_by uuid references public.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

create index if not exists idx_locations_is_active on public.locations(is_active) where deleted_at is null;

-- ================================================================
-- OWNERS
-- ================================================================
create table if not exists public.owners (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    phone text,
    email text,
    id_card_number text,
    address text,
    bank_account text,
    bank_name text,
    notes text,
    created_by uuid references public.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

create index if not exists idx_owners_name on public.owners(name);
create index if not exists idx_owners_deleted on public.owners(deleted_at) where deleted_at is null;

-- ================================================================
-- UNITS
-- ================================================================
create type unit_type as enum ('room', 'parking');
create type unit_status as enum ('available', 'occupied', 'maintenance', 'reserved');

create table if not exists public.units (
    id uuid primary key default uuid_generate_v4(),
    location_id uuid not null references public.locations(id) on delete restrict,
    owner_id uuid references public.owners(id) on delete set null,
    unit_number text not null,
    floor integer not null default 1,
    unit_type unit_type not null default 'room',
    monthly_rate decimal(12, 2) not null default 0,
    deposit_amount decimal(12, 2) not null default 0,
    capacity integer not null default 1,
    features text[] not null default '{}',
    status unit_status not null default 'available',
    notes text,
    created_by uuid references public.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz,
    unique (location_id, unit_number)
);

create index if not exists idx_units_location_id on public.units(location_id);
create index if not exists idx_units_owner_id on public.units(owner_id);
create index if not exists idx_units_status on public.units(status) where deleted_at is null;
create index if not exists idx_units_type on public.units(unit_type);

-- ================================================================
-- CUSTOMERS (penyewa)
-- ================================================================
create table if not exists public.customers (
    id uuid primary key default uuid_generate_v4(),
    full_name text not null,
    phone text,
    email text,
    id_card_number text,
    id_card_photo_url text,
    emergency_contact_name text,
    emergency_contact_phone text,
    occupation text,
    address text,
    notes text,
    created_by uuid references public.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

create index if not exists idx_customers_name on public.customers(full_name);
create index if not exists idx_customers_phone on public.customers(phone);
create index if not exists idx_customers_deleted on public.customers(deleted_at) where deleted_at is null;

-- ================================================================
-- CONTRACTS
-- ================================================================
create type contract_status as enum ('active', 'ended', 'terminated');

create table if not exists public.contracts (
    id uuid primary key default uuid_generate_v4(),
    customer_id uuid not null references public.customers(id) on delete restrict,
    unit_id uuid not null references public.units(id) on delete restrict,
    start_date date not null,
    end_date date,
    monthly_rate decimal(12, 2) not null,
    deposit_amount decimal(12, 2) not null default 0,
    status contract_status not null default 'active',
    notes text,
    created_by uuid references public.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

create index if not exists idx_contracts_customer_id on public.contracts(customer_id);
create index if not exists idx_contracts_unit_id on public.contracts(unit_id);
create index if not exists idx_contracts_status on public.contracts(status) where deleted_at is null;
create index if not exists idx_contracts_active on public.contracts(unit_id, status) where deleted_at is null and status = 'active';

-- ================================================================
-- CHARGE TYPES
-- ================================================================
create table if not exists public.charge_types (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    description text,
    is_recurring boolean not null default true,
    is_per_unit boolean not null default true,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Insert default charge types
insert into public.charge_types (name, description, is_recurring, is_per_unit) values
    ('Sewa', 'Biaya sewa kamar/bangunan', true, true),
    ('Listrik', 'Biaya listrik per kWh', true, false),
    ('Air', 'Biaya air bulanan', true, false),
    ('Gas', 'Biaya gas bulanan', true, false),
    ('Internet', 'Biaya internet bulanan', true, false),
    ('Maintenance', 'Biaya perawatan/perbaikan', true, false),
    ('Kebersihan', 'Biaya jasa kebersihan', true, false),
    ('Parkir', 'Biaya parkir', true, false),
    ('Lainnya', 'Biaya lainnya', false, true)
on conflict (name) do nothing;

-- ================================================================
-- CHARGE RULES (biaya per lokasi)
-- ================================================================
create type charge_period as enum ('monthly', 'one_time');

create table if not exists public.charge_rules (
    id uuid primary key default uuid_generate_v4(),
    location_id uuid not null references public.locations(id) on delete cascade,
    charge_type_id uuid not null references public.charge_types(id) on delete restrict,
    amount decimal(12, 2) not null default 0,
    period charge_period not null default 'monthly',
    is_shared boolean not null default false,
    notes text,
    created_by uuid references public.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (location_id, charge_type_id)
);

create index if not exists idx_charge_rules_location_id on public.charge_rules(location_id);
create index if not exists idx_charge_rules_type_id on public.charge_rules(charge_type_id);

-- ================================================================
-- INVOICES
-- ================================================================
create type invoice_status as enum ('unpaid', 'partial', 'paid', 'overdue', 'cancelled');

create table if not exists public.invoices (
    id uuid primary key default uuid_generate_v4(),
    contract_id uuid not null references public.contracts(id) on delete restrict,
    invoice_number text not null unique,
    period_start date not null,
    period_end date not null,
    due_date date not null,
    subtotal decimal(12, 2) not null default 0,
    total_amount decimal(12, 2) not null default 0,
    amount_paid decimal(12, 2) not null default 0,
    status invoice_status not null default 'unpaid',
    notes text,
    created_by uuid references public.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

create index if not exists idx_invoices_contract_id on public.invoices(contract_id);
create index if not exists idx_invoices_status on public.invoices(status) where deleted_at is null;
create index if not exists idx_invoices_due_date on public.invoices(due_date);
create index if not exists idx_invoices_period on public.invoices(period_start, period_end);
create index if not exists idx_invoices_number on public.invoices(invoice_number);

-- ================================================================
-- INVOICE ITEMS
-- ================================================================
create table if not exists public.invoice_items (
    id uuid primary key default uuid_generate_v4(),
    invoice_id uuid not null references public.invoices(id) on delete cascade,
    charge_type_id uuid references public.charge_types(id) on delete set null,
    description text not null,
    quantity decimal(12, 4) not null default 1,
    unit_price decimal(12, 2) not null default 0,
    amount decimal(12, 2) not null default 0,
    created_at timestamptz not null default now()
);

create index if not exists idx_invoice_items_invoice_id on public.invoice_items(invoice_id);

-- ================================================================
-- PAYMENTS
-- ================================================================
create type payment_method as enum ('cash', 'transfer', 'ewallet', 'qris');
create type payment_status as enum ('pending', 'completed', 'failed', 'refunded');

create table if not exists public.payments (
    id uuid primary key default uuid_generate_v4(),
    invoice_id uuid not null references public.invoices(id) on delete restrict,
    amount decimal(12, 2) not null,
    payment_method payment_method not null,
    payment_date timestamptz not null default now(),
    reference_number text,
    sender_account text,
    sender_bank text,
    proof_of_payment_url text,
    status payment_status not null default 'pending',
    notes text,
    processed_by uuid references public.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

create index if not exists idx_payments_invoice_id on public.payments(invoice_id);
create index if not exists idx_payments_status on public.payments(status) where deleted_at is null;
create index if not exists idx_payments_date on public.payments(payment_date);
create index if not exists idx_payments_reference on public.payments(reference_number);

-- ================================================================
-- SHARED UTILITIES
-- ================================================================
create type utility_type as enum ('electricity', 'water', 'gas', 'internet', 'other');

create table if not exists public.shared_utilities (
    id uuid primary key default uuid_generate_v4(),
    location_id uuid not null references public.locations(id) on delete cascade,
    type utility_type not null,
    period date not null,
    total_amount decimal(12, 2) not null,
    divided_by integer not null default 1,
    per_unit_amount decimal(12, 2) not null default 0,
    notes text,
    created_by uuid references public.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_shared_utilities_location_id on public.shared_utilities(location_id);
create index if not exists idx_shared_utilities_period on public.shared_utilities(period);

-- ================================================================
-- MAINTENANCE
-- ================================================================
create type maintenance_status as enum ('reported', 'in_progress', 'completed', 'cancelled');

create table if not exists public.maintenance (
    id uuid primary key default uuid_generate_v4(),
    unit_id uuid not null references public.units(id) on delete restrict,
    description text not null,
    reported_date timestamptz not null default now(),
    completed_date timestamptz,
    cost decimal(12, 2) not null default 0,
    vendor text,
    status maintenance_status not null default 'reported',
    notes text,
    reported_by uuid references public.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_maintenance_unit_id on public.maintenance(unit_id);
create index if not exists idx_maintenance_status on public.maintenance(status);
create index if not exists idx_maintenance_date on public.maintenance(reported_date);
