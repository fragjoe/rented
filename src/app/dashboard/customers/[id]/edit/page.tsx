import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditCustomerForm from './edit-customer-form'

type Props = { params: Promise<{ id: string }> }

export default async function EditCustomerPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (!customer) notFound()

  return (
    <EditCustomerForm
      customer={customer as unknown as Parameters<typeof EditCustomerForm>[0]['customer']}
    />
  )
}
