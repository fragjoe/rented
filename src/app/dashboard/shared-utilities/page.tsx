import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { getSharedUtilities, getLocations } from '@/lib/db/actions'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { Plug } from 'lucide-react'

export const metadata: Metadata = { title: 'Utilitas Bersama' }

export default async function SharedUtilitiesPage() {
  const [utilities, locations] = await Promise.all([
    getSharedUtilities(),
    getLocations(),
  ])

  const columns = [
    {
      key: 'location',
      header: 'Lokasi',
      render: (row: typeof utilities[0]) => {
        const location = row.locations as unknown as { name: string }
        return <p className="font-medium text-gray-900">{location?.name}</p>
      },
    },
    {
      key: 'type',
      header: 'Jenis',
      render: (row: typeof utilities[0]) => (
        <span className="badge badge-gray capitalize">{row.type}</span>
      ),
    },
    {
      key: 'period',
      header: 'Periode',
      render: (row: typeof utilities[0]) => formatDate(row.period),
    },
    {
      key: 'total',
      header: 'Total',
      className: 'hidden sm:table-cell',
      render: (row: typeof utilities[0]) => formatCurrency(row.total_amount),
    },
    {
      key: 'per_unit',
      header: 'Per Unit',
      render: (row: typeof utilities[0]) => formatCurrency(row.per_unit_amount),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      render: (row: typeof utilities[0]) => (
        <Link
          href={`/dashboard/shared-utilities/${row.id}`}
          className="text-sm text-primary hover:text-primary-600 font-medium"
        >
          Detail
        </Link>
      ),
    },
  ]

  return (
    <PageTemplate
      title="Utilitas Bersama"
      description="Kelola biaya utilitas bersama per lokasi"
      breadcrumbs={[{ label: 'Utilitas' }]}
      actions={
        <Link href="/dashboard/shared-utilities/new">
          <Button><Plus className="w-4 h-4" />Tambah</Button>
        </Link>
      }
    >
      <Card noPadding>
        {utilities.length === 0 ? (
          <EmptyState
            icon={<Plug className="w-6 h-6" />}
            title="Belum ada utilitas"
            description="Catat utilitas bersama pertama"
            action={<Link href="/dashboard/shared-utilities/new"><Button size="sm"><Plus className="w-4 h-4" />Tambah</Button></Link>}
          />
        ) : (
          <DataTable data={utilities} columns={columns} />
        )}
      </Card>
    </PageTemplate>
  )
}
