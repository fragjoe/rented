import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { getMaintenanceRecord } from '@/lib/db/actions'
import { formatCurrency, formatDate } from '@/lib/utils/format'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const record = await getMaintenanceRecord(id)
  return { title: `Maintenance ${record?.id?.slice(0, 8) || ''}` }
}

export default async function MaintenanceDetailPage({ params }: Props) {
  const { id } = await params
  const record = await getMaintenanceRecord(id)
  if (!record) notFound()

  const unit = record.units as unknown as { unit_number: string; locations: { name: string; city: string }; owners: { name: string } | null }
  const user = record.users as unknown as { full_name: string } | null

  return (
    <PageTemplate
      title={`Maintenance`}
      breadcrumbs={[
        { label: 'Maintenance', href: '/dashboard/maintenance' },
        { label: id.slice(0, 8) },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/maintenance/${id}/edit`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Link href="/dashboard/maintenance">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Informasi Maintenance">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Unit</span>
              <span className="font-medium text-gray-900">
                {unit?.unit_number} — {unit?.locations?.name}
              </span>
            </div>
            {unit?.owners && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Pemilik</span>
                <span className="font-medium text-gray-900">{unit.owners.name}</span>
              </div>
            )}
            <div className="py-2">
              <span className="text-gray-500">Deskripsi</span>
              <p className="mt-1 text-gray-900">{record.description}</p>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Dilaporkan</span>
              <span className="font-medium text-gray-900">{formatDate(record.reported_date)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Biaya</span>
              <span className="font-medium text-gray-900">
                {record.cost > 0 ? formatCurrency(record.cost) : '—'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Vendor</span>
              <span className="font-medium text-gray-900">{record.vendor || '—'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Status</span>
              <StatusBadge status={record.status} />
            </div>
            {record.completed_date && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Selesai</span>
                <span className="font-medium text-gray-900">{formatDate(record.completed_date)}</span>
              </div>
            )}
            {user && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Dilaporkan Oleh</span>
                <span className="font-medium text-gray-900">{user.full_name}</span>
              </div>
            )}
            {record.notes && (
              <div className="py-2">
                <span className="text-gray-500">Catatan</span>
                <p className="mt-1 text-gray-900">{record.notes}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageTemplate>
  )
}
