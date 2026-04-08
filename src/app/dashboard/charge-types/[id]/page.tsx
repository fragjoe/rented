import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getChargeType } from '@/lib/db/actions'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const ct = await getChargeType(id)
  return { title: ct?.name || 'Jenis Biaya' }
}

export default async function ChargeTypeDetailPage({ params }: Props) {
  const { id } = await params
  const ct = await getChargeType(id)
  if (!ct) notFound()

  return (
    <PageTemplate
      title={ct.name}
      breadcrumbs={[
        { label: 'Jenis Biaya', href: '/dashboard/charge-types' },
        { label: ct.name },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/charge-types/${id}/edit`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Link href="/dashboard/charge-types">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Informasi Jenis Biaya">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Nama</span>
              <span className="font-medium text-gray-900">{ct.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Periodik</span>
              {ct.is_recurring ? <Badge variant="success">Ya</Badge> : <Badge variant="gray">Tidak</Badge>}
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Per Unit</span>
              {ct.is_per_unit ? <Badge variant="info">Ya</Badge> : <Badge variant="gray">Tidak</Badge>}
            </div>
            {ct.description && (
              <div className="py-2">
                <span className="text-gray-500">Deskripsi</span>
                <p className="mt-1 text-gray-900">{ct.description}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageTemplate>
  )
}
