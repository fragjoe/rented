-- ================================================================
-- Kontrakan App — Migration 003: Triggers
-- Created: 2026-04-08
-- ================================================================

-- ================================================================
-- Helper: updated_at trigger
-- ================================================================
create or replace function public.update_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- Apply to all tables
create trigger t_users_updated_at
    before update on public.users
    for each row execute function public.update_updated_at();

create trigger t_locations_updated_at
    before update on public.locations
    for each row execute function public.update_updated_at();

create trigger t_owners_updated_at
    before update on public.owners
    for each row execute function public.update_updated_at();

create trigger t_units_updated_at
    before update on public.units
    for each row execute function public.update_updated_at();

create trigger t_customers_updated_at
    before update on public.customers
    for each row execute function public.update_updated_at();

create trigger t_contracts_updated_at
    before update on public.contracts
    for each row execute function public.update_updated_at();

create trigger t_charge_types_updated_at
    before update on public.charge_types
    for each row execute function public.update_updated_at();

create trigger t_charge_rules_updated_at
    before update on public.charge_rules
    for each row execute function public.update_updated_at();

create trigger t_invoices_updated_at
    before update on public.invoices
    for each row execute function public.update_updated_at();

create trigger t_payments_updated_at
    before update on public.payments
    for each row execute function public.update_updated_at();

create trigger t_shared_utilities_updated_at
    before update on public.shared_utilities
    for each row execute function public.update_updated_at();

create trigger t_maintenance_updated_at
    before update on public.maintenance
    for each row execute function public.update_updated_at();

-- ================================================================
-- Auto-create user profile on auth signup
-- ================================================================
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.users (id, email, full_name, role)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        coalesce(new.raw_user_meta_data->>'role', 'staff')
    );
    return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_auth_user();

-- ================================================================
-- Auto-update unit status when contract becomes active
-- ================================================================
create or replace function public.update_unit_status_on_contract()
returns trigger
language plpgsql
security definer
as $$
begin
    if new.status = 'active' and (old.status is null or old.status != 'active') then
        update public.units
        set status = 'occupied', updated_at = now()
        where id = new.unit_id and status = 'available';
    elsif new.status in ('ended', 'terminated') and old.status = 'active' then
        update public.units
        set status = 'available', updated_at = now()
        where id = new.unit_id and status = 'occupied';
    end if;
    return new;
end;
$$;

create trigger t_contract_updates_unit_status
    after update on public.contracts
    for each row execute function public.update_unit_status_on_contract();

-- ================================================================
-- Auto-update invoice status when payment completed
-- ================================================================
create or replace function public.update_invoice_on_payment()
returns trigger
language plpgsql
security definer
as $$
declare
    total_paid decimal(12, 2);
    bill_total decimal(12, 2);
begin
    if new.status = 'completed' and (old.status is null or old.status != 'completed') then
        select coalesce(sum(amount), 0) into total_paid
        from public.payments
        where invoice_id = new.invoice_id and status = 'completed';

        select total_amount into bill_total
        from public.invoices
        where id = new.invoice_id;

        if total_paid >= bill_total then
            update public.invoices
            set status = 'paid', amount_paid = total_paid, updated_at = now()
            where id = new.invoice_id;
        elsif total_paid > 0 then
            update public.invoices
            set status = 'partial', amount_paid = total_paid, updated_at = now()
            where id = new.invoice_id;
        end if;
    elsif new.status = 'refunded' then
        select coalesce(sum(amount), 0) into total_paid
        from public.payments
        where invoice_id = new.invoice_id and status = 'completed';

        select total_amount into bill_total
        from public.invoices
        where id = new.invoice_id;

        if total_paid >= bill_total then
            update public.invoices
            set status = 'paid', amount_paid = total_paid, updated_at = now()
            where id = new.invoice_id;
        elsif total_paid > 0 then
            update public.invoices
            set status = 'partial', amount_paid = total_paid, updated_at = now()
            where id = new.invoice_id;
        else
            update public.invoices
            set status = 'unpaid', amount_paid = 0, updated_at = now()
            where id = new.invoice_id;
        end if;
    end if;
    return new;
end;
$$;

create trigger t_payment_updates_invoice
    after update on public.payments
    for each row execute function public.update_invoice_on_payment();

-- ================================================================
-- Audit log trigger
-- ================================================================
create type audit_action as enum ('insert', 'update', 'delete');

create table if not exists public.audit_logs (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete set null,
    action audit_action not null,
    table_name text not null,
    record_id uuid,
    old_data jsonb,
    new_data jsonb,
    ip_address inet,
    created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_user_id on public.audit_logs(user_id);
create index if not exists idx_audit_logs_table_name on public.audit_logs(table_name);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at);

create or replace function public.audit_log_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.audit_logs (user_id, action, table_name, record_id, old_data, new_data)
    values (
        coalesce(auth.uid(), new.created_by),
        case TG_OP
            when 'INSERT' then 'insert'::audit_action
            when 'UPDATE' then 'update'::audit_action
            when 'DELETE' then 'delete'::audit_action
        end,
        TG_TABLE_NAME,
        coalesce(new.id, old.id),
        case when TG_OP in ('UPDATE', 'DELETE') then to_jsonb(old) end,
        case when TG_OP in ('INSERT', 'UPDATE') then to_jsonb(new) end
    );
    return coalesce(new, old);
end;
$$;

-- Audit triggers on sensitive tables
create trigger audit_contracts
    after insert or update or delete on public.contracts
    for each row execute function public.audit_log_change();

create trigger audit_invoices
    after insert or update or delete on public.invoices
    for each row execute function public.audit_log_change();

create trigger audit_payments
    after insert or update or delete on public.payments
    for each row execute function public.audit_log_change();

create trigger audit_units
    after insert or update or delete on public.units
    for each row execute function public.audit_log_change();
