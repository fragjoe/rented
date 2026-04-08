import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditMaintenanceForm from './edit-maintenance-form'

type Props = { params: Promise<{ id: string }> }

export default async function EditMaintenancePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: record }, { data: units }] = await Promise.all([
    supabase.from('maintenance').select('*').eq('id', id).single(),
    supabase
      .from('units')
      .select('id, unit_number, locations(name)')
      .is('deleted_at', null)
      .order('unit_number'),
  ])

  if (!record) notFound()

  const unitOptions = (units || []).map((u) => {
    const loc = (u.locations as unknown as { name: string })?.name || ''
    return { value: u.id, label: `${u.unit_number} — ${loc}` }
  })

  return (
    <EditMaintenanceForm
      record={record as unknown as Parameters<typeof EditMaintenanceForm>[0]['record']}
      units={unitOptions}
    />
  )
}
