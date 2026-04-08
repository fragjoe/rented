'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'
import { updateChargeType } from '@/lib/db/actions'

interface Props {
  chargeType: {
    id: string
    name: string
    description: string | null
    is_recurring: boolean
    is_per_unit: boolean
  }
}

export default function EditChargeTypeForm({ chargeType }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await updateChargeType(chargeType.id, formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push(`/dashboard/charge-types/${chargeType.id}`)
      router.refresh()
    }
  }

  return (
    <PageTemplate
      title={`Edit ${chargeType.name}`}
      breadcrumbs={[
        { label: 'Jenis Biaya', href: '/dashboard/charge-types' },
        { label: chargeType.name },
        { label: 'Edit' },
      ]}
      actions={
        <Link href={`/dashboard/charge-types/${chargeType.id}`}>
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

          <Input name="name" label="Nama" placeholder="Listrik" required defaultValue={chargeType.name} />
          <Textarea name="description" label="Deskripsi" placeholder="Biaya listrik bulanan" rows={2} defaultValue={chargeType.description || ''} />

          <div className="grid grid-cols-2 gap-4">
            <Select
              name="is_recurring"
              label="Berulang"
              options={[
                { value: 'true', label: 'Ya (bulanan)' },
                { value: 'false', label: 'Tidak (satu kali)' },
              ]}
              defaultValue={chargeType.is_recurring ? 'true' : 'false'}
            />
            <Select
              name="is_per_unit"
              label="Per Unit"
              options={[
                { value: 'true', label: 'Ya' },
                { value: 'false', label: 'Tidak' },
              ]}
              defaultValue={chargeType.is_per_unit ? 'true' : 'false'}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Link href={`/dashboard/charge-types/${chargeType.id}`}>
              <Button type="button" variant="ghost">Batal</Button>
            </Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
