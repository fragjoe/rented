'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'
import { updateCustomer } from '@/lib/db/actions'

interface Props {
  customer: {
    id: string
    full_name: string
    phone: string | null
    email: string | null
    id_card_number: string | null
    emergency_contact_name: string | null
    emergency_contact_phone: string | null
    occupation: string | null
    address: string | null
    notes: string | null
  }
}

export default function EditCustomerForm({ customer }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await updateCustomer(customer.id, formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push(`/dashboard/customers/${customer.id}`)
      router.refresh()
    }
  }

  return (
    <PageTemplate
      title="Edit Penyewa"
      breadcrumbs={[
        { label: 'Penyewa', href: '/dashboard/customers' },
        { label: customer.full_name },
        { label: 'Edit' },
      ]}
      actions={
        <Link href={`/dashboard/customers/${customer.id}`}>
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

          <Input name="full_name" label="Nama Lengkap" placeholder="Siti Aminah" required defaultValue={customer.full_name} />
          <div className="grid grid-cols-2 gap-4">
            <Input name="phone" label="No. Telepon" placeholder="081234567890" defaultValue={customer.phone || ''} />
            <Input name="email" label="Email" type="email" placeholder="siti@email.com" defaultValue={customer.email || ''} />
          </div>
          <Input name="id_card_number" label="No. KTP" placeholder="1234567890123456" defaultValue={customer.id_card_number || ''} />
          <Input name="occupation" label="Pekerjaan" placeholder="Pegawai Swasta" defaultValue={customer.occupation || ''} />
          <Textarea name="address" label="Alamat" rows={2} defaultValue={customer.address || ''} />
          <div className="grid grid-cols-2 gap-4">
            <Input name="emergency_contact_name" label="Kontak Darurat" placeholder="Nama" defaultValue={customer.emergency_contact_name || ''} />
            <Input name="emergency_contact_phone" label="Telp Darurat" placeholder="081234567890" defaultValue={customer.emergency_contact_phone || ''} />
          </div>
          <Textarea name="notes" label="Catatan" rows={2} defaultValue={customer.notes || ''} />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Link href={`/dashboard/customers/${customer.id}`}>
              <Button type="button" variant="ghost">Batal</Button>
            </Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
