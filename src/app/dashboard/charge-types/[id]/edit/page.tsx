import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditChargeTypeForm from './edit-charge-type-form'

type Props = { params: Promise<{ id: string }> }

export default async function EditChargeTypePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: ct } = await supabase
    .from('charge_types')
    .select('*')
    .eq('id', id)
    .single()

  if (!ct) notFound()

  return (
    <EditChargeTypeForm
      chargeType={ct as unknown as Parameters<typeof EditChargeTypeForm>[0]['chargeType']}
    />
  )
}
