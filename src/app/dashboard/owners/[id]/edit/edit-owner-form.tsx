'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea } from '@/components/ui/input'
import { updateOwner } from '@/lib/db/actions'

interface Props {
  owner: {
    id: string
    name: string
    phone: string | null
    email: string | null
    id_card_number: string | null
    address: string | null
    bank_name: string | null
    bank_account: string | null
    notes: string | null
  }
}

export default function EditOwnerForm({ owner }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await updateOwner(owner.id, formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push(`/dashboard/owners/${owner.id}`)
      router.refresh()
    }
  }

  return (
    <PageTemplate
      title={`Edit ${owner.name}`}
      breadcrumbs={[
        { label: 'Pemilik', href: '/dashboard/owners' },
        { label: owner.name },
        { label: 'Edit' },
      ]}
      actions={
        <Link href={`/dashboard/owners/${owner.id}`}>
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

          <Input name="name" label="Nama Lengkap" placeholder="Budi Santoso" required defaultValue={owner.name} />
          <Input name="phone" label="No. Telepon" placeholder="081234567890" defaultValue={owner.phone || ''} />
          <Input name="email" label="Email" type="email" placeholder="budi@email.com" defaultValue={owner.email || ''} />
          <Input name="id_card_number" label="No. KTP" placeholder="1234567890123456" defaultValue={owner.id_card_number || ''} />
          <Textarea name="address" label="Alamat" placeholder="Alamat lengkap" rows={2} defaultValue={owner.address || ''} />
          <Input name="bank_name" label="Nama Bank" placeholder="Bank BCA" defaultValue={owner.bank_name || ''} />
          <Input name="bank_account" label="No. Rekening" placeholder="1234567890" defaultValue={owner.bank_account || ''} />
          <Textarea name="notes" label="Catatan" rows={2} defaultValue={owner.notes || ''} />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Link href={`/dashboard/owners/${owner.id}`}>
              <Button type="button" variant="ghost">Batal</Button>
            </Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
