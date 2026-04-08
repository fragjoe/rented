import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditOwnerForm from './edit-owner-form'

type Props = { params: Promise<{ id: string }> }

export default async function EditOwnerPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: owner } = await supabase
    .from('owners')
    .select('*')
    .eq('id', id)
    .single()

  if (!owner) notFound()

  return (
    <EditOwnerForm
      owner={owner as unknown as Parameters<typeof EditOwnerForm>[0]['owner']}
    />
  )
}
