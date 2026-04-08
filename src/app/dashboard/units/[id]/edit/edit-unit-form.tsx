'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'
import { updateUnit } from '@/lib/db/actions'

interface Props {
  unit: {
    id: string
    unit_number: string
    location_id: string
    owner_id: string | null
    floor: number
    unit_type: string
    monthly_rate: number
    deposit_amount: number
    capacity: number
    features: string[]
    notes: string | null
  }
  locations: { value: string; label: string }[]
  owners: { value: string; label: string }[]
}

export default function EditUnitForm({ unit, locations, owners }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await updateUnit(unit.id, formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push(`/dashboard/units/${unit.id}`)
      router.refresh()
    }
  }

  return (
    <PageTemplate
      title={`Edit Unit ${unit.unit_number}`}
      breadcrumbs={[
        { label: 'Unit', href: '/dashboard/units' },
        { label: unit.unit_number },
        { label: 'Edit' },
      ]}
      actions={
        <Link href={`/dashboard/units/${unit.id}`}>
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

          <Select name="location_id" label="Lokasi" placeholder="Pilih lokasi" required options={locations} defaultValue={unit.location_id} />
          <Input name="unit_number" label="Nomor Unit" placeholder="101" required defaultValue={unit.unit_number} />
          <div className="grid grid-cols-2 gap-4">
            <Input name="floor" label="Lantai" type="number" placeholder="1" defaultValue={unit.floor} />
            <Select
              name="unit_type"
              label="Tipe"
              options={[
                { value: 'room', label: 'Kamar' },
                { value: 'parking', label: 'Parkiran' },
              ]}
              defaultValue={unit.unit_type}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input name="monthly_rate" label="Tarif Bulanan (IDR)" type="number" placeholder="1500000" required defaultValue={unit.monthly_rate} />
            <Input name="deposit_amount" label="Deposit (IDR)" type="number" placeholder="3000000" defaultValue={unit.deposit_amount} />
          </div>
          <Input name="capacity" label="Kapasitas (orang)" type="number" placeholder="1" defaultValue={unit.capacity} />
          <Input
            name="features"
            label="Fasilitas"
            placeholder="AC, WiFi, Kamar Mandi Dalam"
            hint="Pisahkan dengan koma"
            defaultValue={(unit.features || []).join(', ')}
          />
          <Select name="owner_id" label="Pemilik" placeholder="Pilih pemilik (opsional)" options={owners} defaultValue={unit.owner_id || ''} />
          <Textarea name="notes" label="Catatan" rows={2} defaultValue={unit.notes || ''} />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Link href={`/dashboard/units/${unit.id}`}>
              <Button type="button" variant="ghost">Batal</Button>
            </Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
