'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea } from '@/components/ui/input'
import { createCustomer } from '@/lib/db/actions'

export default function NewCustomerPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await createCustomer(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/dashboard/customers')
      router.refresh()
    }
  }

  return (
    <PageTemplate
      title="Tambah Penyewa"
      breadcrumbs={[
        { label: 'Penyewa', href: '/dashboard/customers' },
        { label: 'Tambah' },
      ]}
      actions={
        <Link href="/dashboard/customers">
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

          <Input name="full_name" label="Nama Lengkap" placeholder="Siti Aminah" required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="phone" label="No. Telepon" placeholder="081234567890" />
            <Input name="email" label="Email" type="email" placeholder="siti@email.com" />
          </div>
          <Input name="id_card_number" label="No. KTP" placeholder="1234567890123456" />
          <Input name="occupation" label="Pekerjaan" placeholder="Pegawai Swasta" />
          <Textarea name="address" label="Alamat" rows={2} />
          <div className="grid grid-cols-2 gap-4">
            <Input name="emergency_contact_name" label="Kontak Darurat" placeholder="Nama" />
            <Input name="emergency_contact_phone" label="Telp Darurat" placeholder="081234567890" />
          </div>
          <Textarea name="notes" label="Catatan" rows={2} />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Link href="/dashboard/customers">
              <Button type="button" variant="ghost">Batal</Button>
            </Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
