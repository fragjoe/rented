'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'
import { createPayment } from '@/lib/db/actions'

interface Props {
  invoices: { value: string; label: string }[]
}

export default function NewPaymentForm({ invoices }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await createPayment(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/dashboard/payments')
      router.refresh()
    }
  }

  const now = new Date()
  const dateTimeDefault = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  return (
    <PageTemplate
      title="Catat Pembayaran"
      breadcrumbs={[{ label: 'Pembayaran', href: '/dashboard/payments' }, { label: 'Baru' }]}
      actions={<Link href="/dashboard/payments"><Button variant="ghost"><ArrowLeft className="w-4 h-4" />Kembali</Button></Link>}
    >
      <Card className="max-w-2xl">
        <form action={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
          <Select name="invoice_id" label="Tagihan" placeholder="Pilih tagihan" required options={invoices} />
          <div className="grid grid-cols-2 gap-4">
            <Input name="amount" label="Jumlah (IDR)" type="number" placeholder="1500000" required />
            <Select name="payment_method" label="Metode" required options={[{ value: 'cash', label: 'Tunai' }, { value: 'transfer', label: 'Transfer Bank' }, { value: 'ewallet', label: 'E-Wallet' }, { value: 'qris', label: 'QRIS' }]} />
          </div>
          <Input name="payment_date" label="Tanggal Bayar" type="datetime-local" defaultValue={dateTimeDefault} required />
          <Input name="reference_number" label="No. Referensi" placeholder="TRX-123456" />
          <div className="grid grid-cols-2 gap-4">
            <Input name="sender_account" label="Rekening Pengirim" placeholder="a.n. Budi" />
            <Input name="sender_bank" label="Bank Pengirim" placeholder="Bank BCA" />
          </div>
          <Textarea name="notes" label="Catatan" rows={2} />
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Link href="/dashboard/payments"><Button type="button" variant="ghost">Batal</Button></Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
