'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'
import { createMaintenance } from '@/lib/db/actions'

interface Props {
  units: { value: string; label: string }[]
}

export default function NewMaintenanceForm({ units }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await createMaintenance(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/dashboard/maintenance')
      router.refresh()
    }
  }

  const now = new Date()
  const dateTimeDefault = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  return (
    <PageTemplate
      title="Laporkan Maintenance"
      breadcrumbs={[{ label: 'Maintenance', href: '/dashboard/maintenance' }, { label: 'Baru' }]}
      actions={<Link href="/dashboard/maintenance"><Button variant="ghost"><ArrowLeft className="w-4 h-4" />Kembali</Button></Link>}
    >
      <Card className="max-w-2xl">
        <form action={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
          <Select name="unit_id" label="Unit" placeholder="Pilih unit" required options={units} />
          <Textarea name="description" label="Deskripsi Masalah" placeholder="AC tidak dingin" rows={3} required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="reported_date" label="Tanggal Laporan" type="datetime-local" defaultValue={dateTimeDefault} required />
            <Input name="cost" label="Estimasi Biaya (IDR)" type="number" placeholder="0" />
          </div>
          <Input name="vendor" label="Vendor" placeholder="Nama vendor" />
          <Textarea name="notes" label="Catatan" rows={2} />
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Link href="/dashboard/maintenance"><Button type="button" variant="ghost">Batal</Button></Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
