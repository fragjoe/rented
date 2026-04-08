'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'
import { createUnit } from '@/lib/db/actions'

interface Props {
  locations: { value: string; label: string }[]
  owners: { value: string; label: string }[]
}

export default function NewUnitForm({ locations, owners }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await createUnit(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/dashboard/units')
      router.refresh()
    }
  }

  return (
    <PageTemplate
      title="Tambah Unit"
      breadcrumbs={[{ label: 'Unit', href: '/dashboard/units' }, { label: 'Tambah' }]}
      actions={<Link href="/dashboard/units"><Button variant="ghost"><ArrowLeft className="w-4 h-4" />Kembali</Button></Link>}
    >
      <Card className="max-w-2xl">
        <form action={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
          <Select name="location_id" label="Lokasi" placeholder="Pilih lokasi" required options={locations} />
          <Input name="unit_number" label="Nomor Unit" placeholder="101" required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="floor" label="Lantai" type="number" placeholder="1" defaultValue="1" />
            <Select name="unit_type" label="Tipe" options={[{ value: 'room', label: 'Kamar' }, { value: 'parking', label: 'Parkiran' }]} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input name="monthly_rate" label="Tarif Bulanan (IDR)" type="number" placeholder="1500000" required />
            <Input name="deposit_amount" label="Deposit (IDR)" type="number" placeholder="3000000" />
          </div>
          <Input name="capacity" label="Kapasitas (orang)" type="number" placeholder="1" defaultValue="1" />
          <Input name="features" label="Fasilitas" placeholder="AC, WiFi, Kamar Mandi Dalam" hint="Pisahkan dengan koma" />
          <Select name="owner_id" label="Pemilik" placeholder="Pilih pemilik (opsional)" options={owners} />
          <Textarea name="notes" label="Catatan" rows={2} />
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Link href="/dashboard/units"><Button type="button" variant="ghost">Batal</Button></Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
