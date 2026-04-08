'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'
import { createSharedUtility } from '@/lib/db/actions'

interface Props {
  locations: { value: string; label: string }[]
}

export default function NewSharedUtilityForm({ locations }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await createSharedUtility(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/dashboard/shared-utilities')
      router.refresh()
    }
  }

  const now = new Date()
  const periodDefault = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

  return (
    <PageTemplate
      title="Tambah Utilitas"
      breadcrumbs={[{ label: 'Utilitas', href: '/dashboard/shared-utilities' }, { label: 'Tambah' }]}
      actions={<Link href="/dashboard/shared-utilities"><Button variant="ghost"><ArrowLeft className="w-4 h-4" />Kembali</Button></Link>}
    >
      <Card className="max-w-2xl">
        <form action={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
          <Select name="location_id" label="Lokasi" placeholder="Pilih lokasi" required options={locations} />
          <Select name="type" label="Jenis" options={[{ value: 'electricity', label: 'Listrik' }, { value: 'water', label: 'Air' }, { value: 'gas', label: 'Gas' }, { value: 'internet', label: 'Internet' }, { value: 'other', label: 'Lainnya' }]} />
          <Input name="period" label="Periode" type="date" defaultValue={periodDefault} required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="total_amount" label="Total Biaya (IDR)" type="number" placeholder="500000" required />
            <Input name="divided_by" label="Dibagi (unit)" type="number" placeholder="5" defaultValue="1" required />
          </div>
          <Textarea name="notes" label="Catatan" rows={2} />
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Link href="/dashboard/shared-utilities"><Button type="button" variant="ghost">Batal</Button></Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
