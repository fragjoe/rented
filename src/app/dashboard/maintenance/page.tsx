import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/ui/badge'
import { getMaintenance } from '@/lib/db/actions'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { Wrench } from 'lucide-react'

export const metadata: Metadata = { title: 'Maintenance' }

export default async function MaintenancePage() {
  const records = await getMaintenance()

  const columns = [
    {
      key: 'unit',
      header: 'Unit',
      render: (row: typeof records[0]) => {
        const unit = row.units as unknown as { unit_number: string; locations: { name: string } }
        return (
          <div>
            <p className="font-medium text-gray-900">{unit?.unit_number}</p>
            <p className="text-xs text-gray-500">{unit?.locations?.name}</p>
          </div>
        )
      },
    },
    {
      key: 'description',
      header: 'Deskripsi',
      className: 'hidden md:table-cell',
    },
    {
      key: 'reported_date',
      header: 'Dilaporkan',
      className: 'hidden lg:table-cell',
      render: (row: typeof records[0]) => formatDate(row.reported_date),
    },
    {
      key: 'cost',
      header: 'Biaya',
      className: 'hidden sm:table-cell',
      render: (row: typeof records[0]) => row.cost > 0 ? formatCurrency(row.cost) : '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: typeof records[0]) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      render: (row: typeof records[0]) => (
        <Link href={`/dashboard/maintenance/${row.id}`} className="text-sm text-primary hover:text-primary-600 font-medium">Detail</Link>
      ),
    },
  ]

  return (
    <PageTemplate
      title="Maintenance"
      description="Tracking perbaikan unit"
      breadcrumbs={[{ label: 'Maintenance' }]}
      actions={<Link href="/dashboard/maintenance/new"><Button><Plus className="w-4 h-4" />Laporkan</Button></Link>}
    >
      <Card noPadding>
        {records.length === 0 ? (
          <EmptyState icon={<Wrench className="w-6 h-6" />} title="Belum ada laporan" description="Laporkan perbaikan pertama" action={<Link href="/dashboard/maintenance/new"><Button size="sm"><Plus className="w-4 h-4" />Laporkan</Button></Link>} />
        ) : (
          <DataTable data={records} columns={columns} />
        )}
      </Card>
    </PageTemplate>
  )
}
