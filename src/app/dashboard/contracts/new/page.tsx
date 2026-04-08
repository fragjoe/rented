import { createClient } from '@/lib/supabase/server'
import NewContractForm from './new-contract-form'

export default async function NewContractPage() {
  const supabase = await createClient()

  const [{ data: customers }, { data: units }] = await Promise.all([
    supabase.from('customers').select('id, full_name').is('deleted_at', null).order('full_name'),
    supabase
      .from('units')
      .select('id, unit_number, locations(name)')
      .eq('status', 'available')
      .is('deleted_at', null)
      .order('unit_number'),
  ])

  const unitOptions = (units || []).map((u) => {
    const loc = (u.locations as unknown as { name: string })?.name || ''
    return { value: u.id, label: `${u.unit_number} — ${loc}` }
  })

  return (
    <NewContractForm
      customers={(customers || []).map((c) => ({ value: c.id, label: c.full_name }))}
      units={unitOptions}
    />
  )
}
