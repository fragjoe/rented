import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/ui/badge'
import { getUnits, getLocations } from '@/lib/db/actions'
import { formatCurrency } from '@/lib/utils/format'
import { Home } from 'lucide-react'

export const metadata: Metadata = { title: 'Unit' }

export default async function UnitsPage({
  searchParams,
}: {
  searchParams: Promise<{ location_id?: string }>
}) {
  const { location_id } = await searchParams
  const [units, locations] = await Promise.all([
    getUnits(location_id ? { location_id } : undefined),
    getLocations(),
  ])

  const columns = [
    {
      key: 'unit_number',
      header: 'Unit',
      render: (row: typeof units[0]) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.unit_number}
            {row.floor > 1 && (
              <span className="text-xs text-gray-500 ml-1">Lt. {row.floor}</span>
            )}
          </p>
          <p className="text-xs text-gray-500">
            {(row.locations as unknown as { name: string; city: string })?.name}
          </p>
        </div>
      ),
    },
    {
      key: 'unit_type',
      header: 'Tipe',
      className: 'hidden sm:table-cell',
      render: (row: typeof units[0]) => (
        <span className="badge badge-gray capitalize">{row.unit_type}</span>
      ),
    },
    {
      key: 'monthly_rate',
      header: 'Tarif Bulanan',
      className: 'hidden md:table-cell',
      render: (row: typeof units[0]) => formatCurrency(row.monthly_rate),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: typeof units[0]) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      render: (row: typeof units[0]) => (
        <Link
          href={`/dashboard/units/${row.id}`}
          className="text-sm text-primary hover:text-primary-600 font-medium"
        >
          Detail
        </Link>
      ),
    },
  ]

  return (
    <PageTemplate
      title="Unit"
      description="Kelola unit (kamar/parkiran)"
      breadcrumbs={[{ label: 'Unit' }]}
      actions={
        <Link href="/dashboard/units/new">
          <Button>
            <Plus className="w-4 h-4" />
            Tambah Unit
          </Button>
        </Link>
      }
    >
      {/* Filter by location */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-gray-500">Lokasi:</span>
        <Link
          href="/dashboard/units"
          className={`px-3 py-1 text-xs rounded-full ${
            !location_id
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Semua
        </Link>
        {locations.map((loc) => (
          <Link
            key={loc.id}
            href={`/dashboard/units?location_id=${loc.id}`}
            className={`px-3 py-1 text-xs rounded-full ${
              location_id === loc.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {loc.name}
          </Link>
        ))}
      </div>

      <Card noPadding className="mt-4">
        {units.length === 0 ? (
          <EmptyState
            icon={<Home className="w-6 h-6" />}
            title="Belum ada unit"
            description="Tambahkan unit pertama untuk lokasi Anda"
            action={
              <Link href="/dashboard/units/new">
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                  Tambah Unit
                </Button>
              </Link>
            }
          />
        ) : (
          <DataTable data={units} columns={columns} />
        )}
      </Card>
    </PageTemplate>
  )
}
