'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'
import { updateContract } from '@/lib/db/actions'

interface Props {
  contract: {
    id: string
    customer_id: string
    unit_id: string
    start_date: string
    end_date: string | null
    monthly_rate: number
    deposit_amount: number
    status: string
    notes: string | null
  }
  customers: { value: string; label: string }[]
  units: { value: string; label: string }[]
}

export default function EditContractForm({ contract, customers, units }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await updateContract(contract.id, formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push(`/dashboard/contracts/${contract.id}`)
      router.refresh()
    }
  }

  return (
    <PageTemplate
      title="Edit Kontrak"
      breadcrumbs={[
        { label: 'Kontrak', href: '/dashboard/contracts' },
        { label: 'Edit' },
      ]}
      actions={
        <Link href={`/dashboard/contracts/${contract.id}`}>
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

          <Select
            name="customer_id"
            label="Penyewa"
            required
            options={customers}
            defaultValue={contract.customer_id}
          />
          <Select
            name="unit_id"
            label="Unit"
            required
            options={units}
            defaultValue={contract.unit_id}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="start_date"
              label="Tanggal Mulai"
              type="date"
              required
              defaultValue={contract.start_date?.split('T')[0]}
            />
            <Input
              name="end_date"
              label="Tanggal Selesai"
              type="date"
              defaultValue={contract.end_date?.split('T')[0] || ''}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="monthly_rate"
              label="Tarif Bulanan (IDR)"
              type="number"
              placeholder="1500000"
              required
              defaultValue={contract.monthly_rate}
            />
            <Input
              name="deposit_amount"
              label="Deposit (IDR)"
              type="number"
              placeholder="3000000"
              defaultValue={contract.deposit_amount}
            />
          </div>
          <Select
            name="status"
            label="Status"
            options={[
              { value: 'active', label: 'Aktif' },
              { value: 'ended', label: 'Selesai' },
              { value: 'terminated', label: 'Dihentikan' },
            ]}
            defaultValue={contract.status}
          />
          <Textarea name="notes" label="Catatan" rows={2} defaultValue={contract.notes || ''} />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>
              Simpan
            </Button>
            <Link href={`/dashboard/contracts/${contract.id}`}>
              <Button type="button" variant="ghost">
                Batal
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
