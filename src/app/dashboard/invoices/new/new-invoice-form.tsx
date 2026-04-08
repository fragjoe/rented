'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'
import { createInvoice } from '@/lib/db/actions'

interface Props {
  contracts: { value: string; label: string }[]
}

export default function NewInvoiceForm({ contracts }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await createInvoice(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.id) {
      router.push(`/dashboard/invoices/${result.id}`)
      router.refresh()
    }
  }

  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const periodStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const periodEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`
  const dueDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-05`

  return (
    <PageTemplate
      title="Buat Tagihan"
      breadcrumbs={[{ label: 'Tagihan', href: '/dashboard/invoices' }, { label: 'Buat' }]}
      actions={<Link href="/dashboard/invoices"><Button variant="ghost"><ArrowLeft className="w-4 h-4" />Kembali</Button></Link>}
    >
      <Card className="max-w-2xl">
        <form action={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
          <Select name="contract_id" label="Kontrak" placeholder="Pilih kontrak" required options={contracts} />
          <div className="grid grid-cols-2 gap-4">
            <Input name="period_start" label="Periode Mulai" type="date" defaultValue={periodStart} required />
            <Input name="period_end" label="Periode Selesai" type="date" defaultValue={periodEnd} required />
          </div>
          <Input name="due_date" label="Tanggal Jatuh Tempo" type="date" defaultValue={dueDate} required />
          <Textarea name="notes" label="Catatan" rows={2} />
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Buat Tagihan</Button>
            <Link href="/dashboard/invoices"><Button type="button" variant="ghost">Batal</Button></Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
