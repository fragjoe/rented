import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { getChargeRule } from '@/lib/db/actions'
import { formatCurrency } from '@/lib/utils/format'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const rule = await getChargeRule(id)
  return { title: rule?.charge_types?.name || 'Aturan Biaya' }
}

export default async function ChargeRuleDetailPage({ params }: Props) {
  const { id } = await params
  const rule = await getChargeRule(id)
  if (!rule) notFound()

  const location = rule.locations as unknown as { name: string }
  const chargeType = rule.charge_types as unknown as { name: string; description: string | null }

  return (
    <PageTemplate
      title={chargeType?.name || 'Aturan Biaya'}
      breadcrumbs={[
        { label: 'Aturan Biaya', href: '/dashboard/charge-rules' },
        { label: chargeType?.name },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/charge-rules/${id}/edit`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Link href="/dashboard/charge-rules">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Informasi Aturan Biaya">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Lokasi</span>
              <span className="font-medium text-gray-900">{location?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Jenis Biaya</span>
              <span className="font-medium text-gray-900">{chargeType?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Jumlah</span>
              <span className="font-medium text-gray-900">{formatCurrency(rule.amount)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Period</span>
              <span className="badge badge-gray capitalize">
                {rule.period === 'monthly' ? 'Bulanan' : 'Sekali'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Shared</span>
              <StatusBadge status={rule.is_shared ? 'active' : 'ended'} />
            </div>
            {chargeType?.description && (
              <div className="py-2">
                <span className="text-gray-500">Deskripsi</span>
                <p className="mt-1 text-gray-900">{chargeType.description}</p>
              </div>
            )}
            {rule.notes && (
              <div className="py-2">
                <span className="text-gray-500">Catatan</span>
                <p className="mt-1 text-gray-900">{rule.notes}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageTemplate>
  )
}
