import { createClient } from '@/lib/supabase/server'
import NewUnitForm from './new-unit-form'

export default async function NewUnitPage() {
  const supabase = await createClient()

  const [{ data: locations }, { data: owners }] = await Promise.all([
    supabase.from('locations').select('id, name').eq('is_active', true).is('deleted_at', null).order('name'),
    supabase.from('owners').select('id, name').is('deleted_at', null).order('name'),
  ])

  return (
    <NewUnitForm
      locations={(locations || []).map((l) => ({ value: l.id, label: l.name }))}
      owners={(owners || []).map((o) => ({ value: o.id, label: o.name }))}
    />
  )
}
