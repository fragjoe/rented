import { createClient } from '@/lib/supabase/server'
import NewSharedUtilityForm from './new-shared-utility-form'

export default async function NewSharedUtilityPage() {
  const supabase = await createClient()

  const { data: locations } = await supabase
    .from('locations')
    .select('id, name')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name')

  return (
    <NewSharedUtilityForm
      locations={(locations || []).map((l) => ({ value: l.id, label: l.name }))}
    />
  )
}
