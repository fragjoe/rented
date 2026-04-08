import { notFound } from 'next/navigation'
import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { getUnit, getContracts } from '@/lib/db/actions'
import { formatCurrency } from '@/lib/utils/format'
import { formatDate } from '@/lib/utils/format'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const unit = await getUnit(id)
  return { title: unit?.unit_number || 'Unit' }
}

export default async function UnitDetailPage({ params }: Props) {
  const { id } = await params
  const [unit, contracts] = await Promise.all([
    getUnit(id),
    getContracts({ unit_id: id }),
  ])
  if (!unit) notFound()

  const location = unit.locations as unknown as { name: string; city: string }
  const owner = unit.owners as unknown as { name: string } | null

  return (
    <PageTemplate
      title={`Unit ${unit.unit_number}`}
      breadcrumbs={[
        { label: 'Unit', href: '/dashboard/units' },
        { label: unit.unit_number },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/units/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Link href="/dashboard/units">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Informasi Unit">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Unit</span>
              <span className="font-medium text-gray-900">{unit.unit_number}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Lokasi</span>
              <span className="font-medium text-gray-900">{location?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Lantai</span>
              <span className="font-medium text-gray-900">{unit.floor}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Tipe</span>
              <span className="font-medium text-gray-900 capitalize">{unit.unit_type}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Tarif</span>
              <span className="font-medium text-gray-900">{formatCurrency(unit.monthly_rate)}</span>
            </div>
            {owner && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Pemilik</span>
                <span className="font-medium text-gray-900">{owner.name}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Status</span>
              <StatusBadge status={unit.status} />
            </div>
            {unit.features && unit.features.length > 0 && (
              <div className="py-2">
                <span className="text-gray-500">Fasilitas</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {unit.features.map((f: string) => (
                    <span key={f} className="badge badge-gray">{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="Kontrak Aktif">
          {contracts.filter((c) => c.status === 'active').length > 0 ? (
            <div className="space-y-3">
              {contracts
                .filter((c) => c.status === 'active')
                .map((contract) => {
                  const customer = contract.customers as unknown as { full_name: string; phone: string }
                  return (
                    <Link
                      key={contract.id}
                      href={`/dashboard/contracts/${contract.id}`}
                      className="block p-3 rounded-lg border hover:bg-gray-50"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {customer.full_name}
                      </p>
                      <p className="text-xs text-gray-500">{customer.phone}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(contract.start_date)} — {contract.end_date ? formatDate(contract.end_date) : '—'}
                      </p>
                    </Link>
                  )
                })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Tidak ada kontrak aktif</p>
          )}
        </Card>
      </div>
    </PageTemplate>
  )
}
