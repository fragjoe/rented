'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'
import { updateChargeRule } from '@/lib/db/actions'

interface Props {
  rule: {
    id: string
    location_id: string
    charge_type_id: string
    amount: number
    period: string
    is_shared: boolean
    notes: string | null
  }
  locations: { value: string; label: string }[]
  chargeTypes: { value: string; label: string }[]
}

export default function EditChargeRuleForm({ rule, locations, chargeTypes }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await updateChargeRule(rule.id, formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push(`/dashboard/charge-rules/${rule.id}`)
      router.refresh()
    }
  }

  return (
    <PageTemplate
      title="Edit Aturan Biaya"
      breadcrumbs={[
        { label: 'Aturan Biaya', href: '/dashboard/charge-rules' },
        { label: 'Edit' },
      ]}
      actions={
        <Link href={`/dashboard/charge-rules/${rule.id}`}>
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </Link>
      }
    >
      <Card className="max-w-2xl">
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Select name="location_id" label="Lokasi" placeholder="Pilih lokasi" required options={locations} defaultValue={rule.location_id} />
          <Select name="charge_type_id" label="Jenis Biaya" placeholder="Pilih jenis biaya" required options={chargeTypes} defaultValue={rule.charge_type_id} />
          <Input name="amount" label="Jumlah (IDR)" type="number" placeholder="50000" required defaultValue={rule.amount} />
          <div className="grid grid-cols-2 gap-4">
            <Select
              name="period"
              label="Period"
              options={[{ value: 'monthly', label: 'Bulanan' }, { value: 'one_time', label: 'Sekali' }]}
              defaultValue={rule.period}
            />
            <Select
              name="is_shared"
              label="Shared"
              options={[{ value: 'false', label: 'Tidak' }, { value: 'true', label: 'Ya' }]}
              defaultValue={rule.is_shared ? 'true' : 'false'}
            />
          </div>
          <Textarea name="notes" label="Catatan" rows={2} defaultValue={rule.notes || ''} />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Link href={`/dashboard/charge-rules/${rule.id}`}>
              <Button type="button" variant="ghost">Batal</Button>
            </Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
