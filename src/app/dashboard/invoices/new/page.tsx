import { createClient } from '@/lib/supabase/server'
import NewInvoiceForm from './new-invoice-form'

export default async function NewInvoicePage() {
  const supabase = await createClient()

  const { data: contracts } = await supabase
    .from('contracts')
    .select('id, customers(full_name), units(unit_number, locations(name))')
    .eq('status', 'active')
    .is('deleted_at', null)

  const contractOptions = (contracts || []).map((c: Record<string, unknown>) => {
    const customer = (c.customers as unknown as { full_name: string })?.full_name || ''
    const unit = (c.units as unknown as { unit_number: string; locations: { name: string } })?.unit_number || ''
    const loc = (c.units as unknown as { unit_number: string; locations: { name: string } })?.locations?.name || ''
    return { value: (c as { id: string }).id, label: `${customer} — ${unit} (${loc})` }
  })

  return <NewInvoiceForm contracts={contractOptions} />
}
