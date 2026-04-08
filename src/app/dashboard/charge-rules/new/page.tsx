import { createClient } from '@/lib/supabase/server'
import NewChargeRuleForm from './new-charge-rule-form'

export default async function NewChargeRulePage() {
  const supabase = await createClient()

  const [{ data: locations }, { data: chargeTypes }] = await Promise.all([
    supabase.from('locations').select('id, name').eq('is_active', true).order('name'),
    supabase.from('charge_types').select('id, name').eq('is_active', true).order('name'),
  ])

  return (
    <NewChargeRuleForm
      locations={(locations || []).map((l) => ({ value: l.id, label: l.name }))}
      chargeTypes={(chargeTypes || []).map((c) => ({ value: c.id, label: c.name }))}
    />
  )
}
