'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'
import { createChargeRule } from '@/lib/db/actions'

interface Props {
  locations: { value: string; label: string }[]
  chargeTypes: { value: string; label: string }[]
}

export default function NewChargeRuleForm({ locations, chargeTypes }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await createChargeRule(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/dashboard/charge-rules')
      router.refresh()
    }
  }

  return (
    <PageTemplate
      title="Tambah Aturan Biaya"
      breadcrumbs={[{ label: 'Aturan Biaya', href: '/dashboard/charge-rules' }, { label: 'Tambah' }]}
      actions={<Link href="/dashboard/charge-rules"><Button variant="ghost"><ArrowLeft className="w-4 h-4" />Kembali</Button></Link>}
    >
      <Card className="max-w-2xl">
        <form action={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
          <Select name="location_id" label="Lokasi" placeholder="Pilih lokasi" required options={locations} />
          <Select name="charge_type_id" label="Jenis Biaya" placeholder="Pilih jenis biaya" required options={chargeTypes} />
          <Input name="amount" label="Jumlah (IDR)" type="number" placeholder="50000" required />
          <div className="grid grid-cols-2 gap-4">
            <Select name="period" label="Period" options={[{ value: 'monthly', label: 'Bulanan' }, { value: 'one_time', label: 'Sekali' }]} />
            <Select name="is_shared" label="Shared" options={[{ value: 'false', label: 'Tidak' }, { value: 'true', label: 'Ya' }]} />
          </div>
          <Textarea name="notes" label="Catatan" rows={2} />
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Link href="/dashboard/charge-rules"><Button type="button" variant="ghost">Batal</Button></Link>
          </div>
        </form>
      </Card>
    </PageTemplate>
  )
}
