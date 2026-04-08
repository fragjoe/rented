import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditUnitForm from './edit-unit-form'

type Props = { params: Promise<{ id: string }> }

export default async function EditUnitPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: unit }, { data: locations }, { data: owners }] = await Promise.all([
    supabase.from('units').select('*').eq('id', id).single(),
    supabase.from('locations').select('id, name').eq('is_active', true).is('deleted_at', null).order('name'),
    supabase.from('owners').select('id, name').is('deleted_at', null).order('name'),
  ])

  if (!unit) notFound()

  return (
    <EditUnitForm
      unit={unit as unknown as Parameters<typeof EditUnitForm>[0]['unit']}
      locations={(locations || []).map((l) => ({ value: l.id, label: l.name }))}
      owners={(owners || []).map((o) => ({ value: o.id, label: o.name }))}
    />
  )
}
