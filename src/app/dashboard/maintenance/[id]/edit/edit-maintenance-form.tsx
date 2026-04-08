'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'
import { updateMaintenance } from '@/lib/db/actions'

interface Props {
  record: {
    id: string
    unit_id: string
    description: string
    reported_date: string
    cost: number
    vendor: string | null
    status: string
    notes: string | null
  }
  units: { value: string; label: string }[]
}

export default function EditMaintenanceForm({ record, units }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await updateMaintenance(record.id, formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push(`/dashboard/maintenance/${record.id}`)
      router.refresh()
    }
  }

  const reportedDefault = record.reported_date
    ? `${record.reported_date.split('T')[0]}T${(record.reported_date.split('T')[1] || '00:00').slice(0, 5)}`
    : ''

  return (
    <PageTemplate
      title="Edit Maintenance"
      breadcrumbs={[
        { label: 'Maintenance', href: '/dashboard/maintenance' },
        { label: 'Edit' },
      ]}
      actions={
        <Link href={`/dashboard/maintenance/${record.id}`}>
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

          <Select name="unit_id" label="Unit" placeholder="Pilih unit" required options={units} defaultValue={record.unit_id} />
          <Textarea name="description" label="Deskripsi Masalah" placeholder="AC tidak dingin" rows={3} required defaultValue={record.description} />
          <div className="grid grid-cols-2 gap-4">
            <Input name="reported_date" label="Tanggal Laporan" type="datetime-local" defaultValue={reportedDefault} required />
            <Input name="cost" label="Estimasi Biaya (IDR)" type="number" placeholder="0" defaultValue={record.cost} />
          </div>
          <Input name="vendor" label="Vendor" placeholder="Nama vendor" defaultValue={record.vendor || ''} />
          <Select
            name="status"
            label="Status"
            options={[
              { value: 'reported', label: 'Dilaporkan' },
              { value: 'in_progress', label: 'Sedang Dikerjakan' },
              { value: 'completed', label: 'Selesai' },
              { value: 'cancelled', label: 'Dibatalkan' },
            ]}
            defaultValue={record.status}
          />
          <Textarea name="notes" label="Catatan" rows={2} defaultValue={record.notes || ''} />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Link href={`/dashboard/maintenance/${record.id}`}>
              <Button type="button" variant="ghost">Batal</Button>
            </Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
