import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditChargeRuleForm from './edit-charge-rule-form'

type Props = { params: Promise<{ id: string }> }

export default async function EditChargeRulePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: rule }, { data: locations }, { data: chargeTypes }] = await Promise.all([
    supabase.from('charge_rules').select('*').eq('id', id).single(),
    supabase.from('locations').select('id, name').eq('is_active', true).order('name'),
    supabase.from('charge_types').select('id, name').eq('is_active', true).order('name'),
  ])

  if (!rule) notFound()

  return (
    <EditChargeRuleForm
      rule={rule as unknown as Parameters<typeof EditChargeRuleForm>[0]['rule']}
      locations={(locations || []).map((l) => ({ value: l.id, label: l.name }))}
      chargeTypes={(chargeTypes || []).map((c) => ({ value: c.id, label: c.name }))}
    />
  )
}
