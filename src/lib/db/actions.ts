'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// ================================
// -- Locations
// ================================

export async function getLocations() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .is('deleted_at', null)
    .order('name')
  if (error) throw error
  return data
}

export async function getLocation(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createLocation(formData: FormData) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Unauthorized')

  const { error } = await supabase.from('locations').insert({
    name: formData.get('name') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    postal_code: (formData.get('postal_code') as string) || null,
    description: (formData.get('description') as string) || null,
    created_by: session.user.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/locations')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateLocation(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('locations')
    .update({
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      postal_code: (formData.get('postal_code') as string) || null,
      description: (formData.get('description') as string) || null,
    })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/locations')
  revalidatePath(`/dashboard/locations/${id}`)
  return { success: true }
}

export async function deleteLocation(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('locations')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/locations')
  return { success: true }
}

// ================================
// -- Owners
// ================================

export async function getOwners() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('owners')
    .select('*')
    .is('deleted_at', null)
    .order('name')
  if (error) throw error
  return data
}

export async function getOwner(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('owners')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createOwner(formData: FormData) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Unauthorized')

  const { error } = await supabase.from('owners').insert({
    name: formData.get('name') as string,
    phone: (formData.get('phone') as string) || null,
    email: (formData.get('email') as string) || null,
    id_card_number: (formData.get('id_card_number') as string) || null,
    address: (formData.get('address') as string) || null,
    bank_account: (formData.get('bank_account') as string) || null,
    bank_name: (formData.get('bank_name') as string) || null,
    notes: (formData.get('notes') as string) || null,
    created_by: session.user.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/owners')
  return { success: true }
}

export async function updateOwner(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('owners')
    .update({
      name: formData.get('name') as string,
      phone: (formData.get('phone') as string) || null,
      email: (formData.get('email') as string) || null,
      id_card_number: (formData.get('id_card_number') as string) || null,
      address: (formData.get('address') as string) || null,
      bank_account: (formData.get('bank_account') as string) || null,
      bank_name: (formData.get('bank_name') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/owners')
  revalidatePath(`/dashboard/owners/${id}`)
  return { success: true }
}

export async function deleteOwner(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('owners')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/owners')
  return { success: true }
}

// ================================
// -- Units
// ================================

export async function getUnits(filters?: { location_id?: string; status?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('units')
    .select(`
      *,
      locations(name, city),
      owners(name)
    `)
    .is('deleted_at', null)
    .order('unit_number')

  if (filters?.location_id) {
    query = query.eq('location_id', filters.location_id)
  }
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getUnit(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('units')
    .select(`
      *,
      locations(name, city),
      owners(name)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createUnit(formData: FormData) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Unauthorized')

  const features = (formData.get('features') as string) || ''
  const featuresArray = features
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean)

  const { error } = await supabase.from('units').insert({
    location_id: formData.get('location_id') as string,
    owner_id: (formData.get('owner_id') as string) || null,
    unit_number: formData.get('unit_number') as string,
    floor: parseInt(formData.get('floor') as string) || 1,
    unit_type: (formData.get('unit_type') as 'room' | 'parking') || 'room',
    monthly_rate: parseFloat(formData.get('monthly_rate') as string) || 0,
    deposit_amount: parseFloat(formData.get('deposit_amount') as string) || 0,
    capacity: parseInt(formData.get('capacity') as string) || 1,
    features: featuresArray,
    notes: (formData.get('notes') as string) || null,
    created_by: session.user.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/units')
  return { success: true }
}

export async function updateUnit(id: string, formData: FormData) {
  const supabase = await createClient()

  const features = (formData.get('features') as string) || ''
  const featuresArray = features
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean)

  const { error } = await supabase
    .from('units')
    .update({
      location_id: formData.get('location_id') as string,
      owner_id: (formData.get('owner_id') as string) || null,
      unit_number: formData.get('unit_number') as string,
      floor: parseInt(formData.get('floor') as string) || 1,
      unit_type: (formData.get('unit_type') as 'room' | 'parking') || 'room',
      monthly_rate: parseFloat(formData.get('monthly_rate') as string) || 0,
      deposit_amount: parseFloat(formData.get('deposit_amount') as string) || 0,
      capacity: parseInt(formData.get('capacity') as string) || 1,
      features: featuresArray,
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/units')
  revalidatePath(`/dashboard/units/${id}`)
  return { success: true }
}

export async function deleteUnit(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('units')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/units')
  return { success: true }
}

// ================================
// -- Customers
// ================================

export async function getCustomers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .is('deleted_at', null)
    .order('full_name')
  if (error) throw error
  return data
}

export async function getCustomer(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createCustomer(formData: FormData) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Unauthorized')

  const { error } = await supabase.from('customers').insert({
    full_name: formData.get('full_name') as string,
    phone: (formData.get('phone') as string) || null,
    email: (formData.get('email') as string) || null,
    id_card_number: (formData.get('id_card_number') as string) || null,
    emergency_contact_name: (formData.get('emergency_contact_name') as string) || null,
    emergency_contact_phone: (formData.get('emergency_contact_phone') as string) || null,
    occupation: (formData.get('occupation') as string) || null,
    address: (formData.get('address') as string) || null,
    notes: (formData.get('notes') as string) || null,
    created_by: session.user.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/customers')
  return { success: true }
}

export async function updateCustomer(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('customers')
    .update({
      full_name: formData.get('full_name') as string,
      phone: (formData.get('phone') as string) || null,
      email: (formData.get('email') as string) || null,
      id_card_number: (formData.get('id_card_number') as string) || null,
      emergency_contact_name: (formData.get('emergency_contact_name') as string) || null,
      emergency_contact_phone: (formData.get('emergency_contact_phone') as string) || null,
      occupation: (formData.get('occupation') as string) || null,
      address: (formData.get('address') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/customers')
  revalidatePath(`/dashboard/customers/${id}`)
  return { success: true }
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('customers')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/customers')
  return { success: true }
}

// ================================
// -- Contracts
// ================================

export async function getContracts(filters?: { unit_id?: string; customer_id?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('contracts')
    .select(`
      *,
      customers(full_name, phone),
      units(unit_number, locations(name, city))
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (filters?.unit_id) {
    query = query.eq('unit_id', filters.unit_id)
  }
  if (filters?.customer_id) {
    query = query.eq('customer_id', filters.customer_id)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getContract(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contracts')
    .select(`
      *,
      customers(*),
      units(*, locations(name, city), owners(name))
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createContract(formData: FormData) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Unauthorized')

  const { error } = await supabase.from('contracts').insert({
    customer_id: formData.get('customer_id') as string,
    unit_id: formData.get('unit_id') as string,
    start_date: formData.get('start_date') as string,
    end_date: (formData.get('end_date') as string) || null,
    monthly_rate: parseFloat(formData.get('monthly_rate') as string) || 0,
    deposit_amount: parseFloat(formData.get('deposit_amount') as string) || 0,
    status: 'active',
    notes: (formData.get('notes') as string) || null,
    created_by: session.user.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/contracts')
  revalidatePath('/dashboard/units')
  return { success: true }
}

export async function updateContract(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contracts')
    .update({
      customer_id: formData.get('customer_id') as string,
      unit_id: formData.get('unit_id') as string,
      start_date: formData.get('start_date') as string,
      end_date: (formData.get('end_date') as string) || null,
      monthly_rate: parseFloat(formData.get('monthly_rate') as string) || 0,
      deposit_amount: parseFloat(formData.get('deposit_amount') as string) || 0,
      status: (formData.get('status') as 'active' | 'ended' | 'terminated') || 'active',
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/contracts')
  revalidatePath(`/dashboard/contracts/${id}`)
  revalidatePath('/dashboard/units')
  return { success: true }
}

export async function deleteContract(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contracts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/contracts')
  return { success: true }
}

// ================================
// Charge Types
// ================================

export async function getChargeTypes() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('charge_types')
    .select('*')
    .eq('is_active', true)
    .order('name')
  if (error) throw error
  return data
}

export async function getChargeType(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('charge_types')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createChargeType(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('charge_types').insert({
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    is_recurring: formData.get('is_recurring') === 'true',
    is_per_unit: formData.get('is_per_unit') === 'true',
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/charge-types')
  return { success: true }
}

export async function updateChargeType(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('charge_types')
    .update({
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || null,
      is_recurring: formData.get('is_recurring') === 'true',
      is_per_unit: formData.get('is_per_unit') === 'true',
    })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/charge-types')
  revalidatePath(`/dashboard/charge-types/${id}`)
  return { success: true }
}

export async function deleteChargeType(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('charge_types')
    .update({ is_active: false })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/charge-types')
  return { success: true }
}

// ================================
// -- Charge Rules
// ================================

export async function getChargeRules(filters?: { location_id?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('charge_rules')
    .select(`
      *,
      locations(name),
      charge_types(name, description)
    `)
    .order('created_at', { ascending: false })

  if (filters?.location_id) {
    query = query.eq('location_id', filters.location_id)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getChargeRule(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('charge_rules')
    .select(`
      *,
      locations(name),
      charge_types(name, description)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createChargeRule(formData: FormData) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Unauthorized')

  const { error } = await supabase.from('charge_rules').insert({
    location_id: formData.get('location_id') as string,
    charge_type_id: formData.get('charge_type_id') as string,
    amount: parseFloat(formData.get('amount') as string) || 0,
    period: (formData.get('period') as 'monthly' | 'one_time') || 'monthly',
    is_shared: formData.get('is_shared') === 'true',
    notes: (formData.get('notes') as string) || null,
    created_by: session.user.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/charge-rules')
  return { success: true }
}

export async function updateChargeRule(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('charge_rules')
    .update({
      location_id: formData.get('location_id') as string,
      charge_type_id: formData.get('charge_type_id') as string,
      amount: parseFloat(formData.get('amount') as string) || 0,
      period: (formData.get('period') as 'monthly' | 'one_time') || 'monthly',
      is_shared: formData.get('is_shared') === 'true',
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/charge-rules')
  revalidatePath(`/dashboard/charge-rules/${id}`)
  return { success: true }
}

export async function deleteChargeRule(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('charge_rules').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/charge-rules')
  return { success: true }
}

// ================================
// -- Invoices
// ================================

export async function getInvoices(filters?: { status?: string; contract_id?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('invoices')
    .select(`
      *,
      contracts(
        customers(full_name),
        units(unit_number, locations(name, city))
      )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  if (filters?.contract_id) {
    query = query.eq('contract_id', filters.contract_id)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getInvoice(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      contracts(
        customers(*),
        units(*, locations(name, city), owners(name))
      ),
      invoice_items(
        *,
        charge_types(name)
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createInvoice(formData: FormData) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Unauthorized')

  const contractId = formData.get('contract_id') as string
  const periodStart = formData.get('period_start') as string
  const periodEnd = formData.get('period_end') as string
  const dueDate = formData.get('due_date') as string
  const notes = (formData.get('notes') as string) || null

  // Get contract info
  const { data: contract } = await supabase
    .from('contracts')
    .select('id')
    .eq('id', contractId)
    .single()

  if (!contract) return { error: 'Kontrak tidak ditemukan' }

  // Generate invoice number
  const { count } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })

  const now = new Date()
  const invoiceNumber = `INV/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}/${String((count || 0) + 1).padStart(4, '0')}`

  // Create invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      contract_id: contractId,
      invoice_number: invoiceNumber,
      period_start: periodStart,
      period_end: periodEnd,
      due_date: dueDate,
      subtotal: 0,
      total_amount: 0,
      notes,
      created_by: session.user.id,
    })
    .select()
    .single()

  if (invoiceError) return { error: invoiceError.message }

  revalidatePath('/dashboard/invoices')
  revalidatePath(`/dashboard/invoices/${invoice.id}`)
  return { success: true, id: invoice.id }
}

export async function addInvoiceItem(
  invoiceId: string,
  data: {
    charge_type_id?: string
    description: string
    quantity: number
    unit_price: number
  }
) {
  const supabase = await createClient()

  const amount = data.quantity * data.unit_price

  const { error } = await supabase.from('invoice_items').insert({
    invoice_id: invoiceId,
    charge_type_id: data.charge_type_id || null,
    description: data.description,
    quantity: data.quantity,
    unit_price: data.unit_price,
    amount,
  })

  if (error) return { error: error.message }

  // Recalculate invoice totals
  await recalculateInvoiceTotal(invoiceId)

  revalidatePath(`/dashboard/invoices/${invoiceId}`)
  return { success: true }
}

export async function removeInvoiceItem(itemId: string, invoiceId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('invoice_items').delete().eq('id', itemId)
  if (error) return { error: error.message }

  await recalculateInvoiceTotal(invoiceId)

  revalidatePath(`/dashboard/invoices/${invoiceId}`)
  return { success: true }
}

async function recalculateInvoiceTotal(invoiceId: string) {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('invoice_items')
    .select('amount')
    .eq('invoice_id', invoiceId)

  const subtotal = (items || []).reduce((sum, item) => sum + Number(item.amount), 0)

  await supabase
    .from('invoices')
    .update({ subtotal, total_amount: subtotal })
    .eq('id', invoiceId)
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('invoices')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/invoices')
  return { success: true }
}

// ================================
// -- Payments
// ================================

export async function getPayments(filters?: { invoice_id?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('payments')
    .select(`
      *,
      invoices(invoice_number, total_amount, status)
    `)
    .is('deleted_at', null)
    .order('payment_date', { ascending: false })

  if (filters?.invoice_id) {
    query = query.eq('invoice_id', filters.invoice_id)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getPayment(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('payments')
    .select('*, invoices(*), users!processed_by(full_name)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createPayment(formData: FormData) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Unauthorized')

  const { error } = await supabase.from('payments').insert({
    invoice_id: formData.get('invoice_id') as string,
    amount: parseFloat(formData.get('amount') as string) || 0,
    payment_method: (formData.get('payment_method') as 'cash' | 'transfer' | 'ewallet' | 'qris') || 'cash',
    payment_date: (formData.get('payment_date') as string) || new Date().toISOString(),
    reference_number: (formData.get('reference_number') as string) || null,
    sender_account: (formData.get('sender_account') as string) || null,
    sender_bank: (formData.get('sender_bank') as string) || null,
    notes: (formData.get('notes') as string) || null,
    status: 'completed',
    processed_by: session.user.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/payments')
  revalidatePath('/dashboard/invoices')
  return { success: true }
}

export async function deletePayment(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('payments')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/payments')
  return { success: true }
}

// ================================
// -- Shared Utilities
// ================================

export async function getSharedUtilities(filters?: { location_id?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('shared_utilities')
    .select(`
      *,
      locations(name)
    `)
    .order('period', { ascending: false })

  if (filters?.location_id) {
    query = query.eq('location_id', filters.location_id)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createSharedUtility(formData: FormData) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Unauthorized')

  const totalAmount = parseFloat(formData.get('total_amount') as string) || 0
  const dividedBy = parseInt(formData.get('divided_by') as string) || 1
  const perUnitAmount = totalAmount / dividedBy

  const { error } = await supabase.from('shared_utilities').insert({
    location_id: formData.get('location_id') as string,
    type: (formData.get('type') as 'electricity' | 'water' | 'gas' | 'internet' | 'other') || 'electricity',
    period: formData.get('period') as string,
    total_amount: totalAmount,
    divided_by: dividedBy,
    per_unit_amount: perUnitAmount,
    notes: (formData.get('notes') as string) || null,
    created_by: session.user.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/shared-utilities')
  return { success: true }
}

// ================================
// -- Maintenance
// ================================

export async function getMaintenance(filters?: { unit_id?: string; status?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('maintenance')
    .select(`
      *,
      units(unit_number, locations(name, city)),
      users!reported_by(full_name)
    `)
    .order('reported_date', { ascending: false })

  if (filters?.unit_id) {
    query = query.eq('unit_id', filters.unit_id)
  }
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getMaintenanceRecord(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('maintenance')
    .select(`
      *,
      units(*, locations(name, city), owners(name)),
      users!reported_by(full_name)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createMaintenance(formData: FormData) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Unauthorized')

  const { error } = await supabase.from('maintenance').insert({
    unit_id: formData.get('unit_id') as string,
    description: formData.get('description') as string,
    reported_date: (formData.get('reported_date') as string) || new Date().toISOString(),
    cost: parseFloat(formData.get('cost') as string) || 0,
    vendor: (formData.get('vendor') as string) || null,
    notes: (formData.get('notes') as string) || null,
    reported_by: session.user.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/maintenance')
  return { success: true }
}

export async function updateMaintenance(id: string, formData: FormData) {
  const supabase = await createClient()

  const completedDate = formData.get('status') === 'completed'
    ? new Date().toISOString()
    : null

  const { error } = await supabase
    .from('maintenance')
    .update({
      description: formData.get('description') as string,
      cost: parseFloat(formData.get('cost') as string) || 0,
      vendor: (formData.get('vendor') as string) || null,
      status: (formData.get('status') as 'reported' | 'in_progress' | 'completed' | 'cancelled') || 'reported',
      notes: (formData.get('notes') as string) || null,
      completed_date: completedDate,
    })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/maintenance')
  revalidatePath(`/dashboard/maintenance/${id}`)
  return { success: true }
}
