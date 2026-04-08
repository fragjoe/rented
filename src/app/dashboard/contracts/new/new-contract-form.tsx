'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'
import { createContract } from '@/lib/db/actions'

interface Props {
  customers: { value: string; label: string }[]
  units: { value: string; label: string }[]
}

export default function NewContractForm({ customers, units }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await createContract(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/dashboard/contracts')
      router.refresh()
    }
  }

  return (
    <PageTemplate
      title="Tambah Kontrak"
      breadcrumbs={[{ label: 'Kontrak', href: '/dashboard/contracts' }, { label: 'Tambah' }]}
      actions={<Link href="/dashboard/contracts"><Button variant="ghost"><ArrowLeft className="w-4 h-4" />Kembali</Button></Link>}
    >
      <Card className="max-w-2xl">
        <form action={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
          <Select name="customer_id" label="Penyewa" placeholder="Pilih penyewa" required options={customers} />
          <Select name="unit_id" label="Unit" placeholder="Pilih unit" required options={units} />
          <div className="grid grid-cols-2 gap-4">
            <Input name="start_date" label="Tanggal Mulai" type="date" required />
            <Input name="end_date" label="Tanggal Selesai" type="date" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input name="monthly_rate" label="Tarif Bulanan (IDR)" type="number" placeholder="1500000" required />
            <Input name="deposit_amount" label="Deposit (IDR)" type="number" placeholder="3000000" />
          </div>
          <Textarea name="notes" label="Catatan" rows={2} />
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Link href="/dashboard/contracts"><Button type="button" variant="ghost">Batal</Button></Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
