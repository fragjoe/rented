import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditContractForm from './edit-contract-form'

type Props = { params: Promise<{ id: string }> }

export default async function EditContractPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: contract }, { data: customers }, { data: units }] = await Promise.all([
    supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .single(),
    supabase.from('customers').select('id, full_name').is('deleted_at', null).order('full_name'),
    supabase
      .from('units')
      .select('id, unit_number, locations(name)')
      .is('deleted_at', null)
      .order('unit_number'),
  ])

  if (!contract) notFound()

  const customerOptions = (customers || []).map((c) => ({
    value: c.id,
    label: c.full_name,
  }))

  const unitOptions = (units || []).map((u) => ({
    value: u.id,
    label: `Unit ${u.unit_number} — ${(u.locations as unknown as { name: string })?.name || ''}`,
  }))

  return (
    <EditContractForm
      contract={contract as unknown as Parameters<typeof EditContractForm>[0]['contract']}
      customers={customerOptions}
      units={unitOptions}
    />
  )
}
