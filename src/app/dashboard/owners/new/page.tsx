'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'
import { createOwner } from '@/lib/db/actions'

export default function NewOwnerPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await createOwner(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/dashboard/owners')
      router.refresh()
    }
  }

  return (
    <PageTemplate
      title="Tambah Pemilik"
      breadcrumbs={[
        { label: 'Pemilik', href: '/dashboard/owners' },
        { label: 'Tambah' },
      ]}
      actions={
        <Link href="/dashboard/owners">
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

          <Input name="name" label="Nama Lengkap" placeholder="Budi Santoso" required />
          <Input name="phone" label="No. Telepon" placeholder="081234567890" />
          <Input name="email" label="Email" type="email" placeholder="budi@email.com" />
          <Input name="id_card_number" label="No. KTP" placeholder="1234567890123456" />
          <Textarea name="address" label="Alamat" placeholder="Alamat lengkap" rows={2} />
          <Input name="bank_name" label="Nama Bank" placeholder="Bank BCA" />
          <Input name="bank_account" label="No. Rekening" placeholder="1234567890" />
          <Textarea name="notes" label="Catatan" rows={2} />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Link href="/dashboard/owners">
              <Button type="button" variant="ghost">Batal</Button>
            </Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
