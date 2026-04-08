import { createClient } from '@/lib/supabase/server'
import NewPaymentForm from './new-payment-form'

export default async function NewPaymentPage() {
  const supabase = await createClient()

  const { data: invoices } = await supabase
    .from('invoices')
    .select('id, invoice_number, contracts(customers(full_name)), total_amount, amount_paid')
    .in('status', ['unpaid', 'partial', 'overdue'])
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  const invoiceOptions = (invoices || []).map((inv: Record<string, unknown>) => {
    const contract = (inv.contracts as unknown as { customers: { full_name: string } })?.customers?.full_name || ''
    const remaining = ((inv as { total_amount: number }).total_amount - (inv as { amount_paid: number }).amount_paid)
    return {
      value: (inv as { id: string }).id,
      label: `${(inv as { invoice_number: string }).invoice_number} — ${contract} (sisa: Rp${remaining.toLocaleString('id')})`,
    }
  })

  return <NewPaymentForm invoices={invoiceOptions} />
}
