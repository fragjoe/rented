import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditLocationForm from './edit-location-form'

type Props = { params: Promise<{ id: string }> }

export default async function EditLocationPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: location } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single()

  if (!location) notFound()

  return (
    <EditLocationForm
      location={location as unknown as Parameters<typeof EditLocationForm>[0]['location']}
    />
  )
}
