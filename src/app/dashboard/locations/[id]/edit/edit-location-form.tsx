'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea } from '@/components/ui/input'
import { updateLocation } from '@/lib/db/actions'

interface Props {
  location: {
    id: string
    name: string
    address: string
    city: string
    postal_code: string | null
    description: string | null
  }
}

export default function EditLocationForm({ location }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await updateLocation(location.id, formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push(`/dashboard/locations/${location.id}`)
      router.refresh()
    }
  }

  return (
    <PageTemplate
      title={`Edit ${location.name}`}
      breadcrumbs={[
        { label: 'Lokasi', href: '/dashboard/locations' },
        { label: location.name },
        { label: 'Edit' },
      ]}
      actions={
        <Link href={`/dashboard/locations/${location.id}`}>
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

          <Input name="name" label="Nama Lokasi" placeholder="Kos Putri Melati" required defaultValue={location.name} />
          <Input name="city" label="Kota" placeholder="Jakarta Selatan" required defaultValue={location.city} />
          <Input name="address" label="Alamat" placeholder="Jl. Sudirman No. 123" required defaultValue={location.address} />
          <Input name="postal_code" label="Kode Pos" placeholder="12345" defaultValue={location.postal_code || ''} />
          <Textarea name="description" label="Deskripsi" placeholder="Deskripsi tambahan tentang lokasi..." rows={3} defaultValue={location.description || ''} />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Link href={`/dashboard/locations/${location.id}`}>
              <Button type="button" variant="ghost">Batal</Button>
            </Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
