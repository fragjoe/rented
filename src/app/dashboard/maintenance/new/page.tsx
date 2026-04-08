import { createClient } from '@/lib/supabase/server'
import NewMaintenanceForm from './new-maintenance-form'

export default async function NewMaintenancePage() {
  const supabase = await createClient()

  const { data: units } = await supabase
    .from('units')
    .select('id, unit_number, locations(name)')
    .is('deleted_at', null)
    .order('unit_number')

  const unitOptions = (units || []).map((u) => {
    const loc = (u.locations as unknown as { name: string })?.name || ''
    return { value: u.id, label: `${u.unit_number} — ${loc}` }
  })

  return <NewMaintenanceForm units={unitOptions} />
}
