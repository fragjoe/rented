import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { getChargeTypes } from '@/lib/db/actions'
import { CreditCard } from 'lucide-react'

export const metadata: Metadata = { title: 'Jenis Biaya' }

export default async function ChargeTypesPage() {
  const chargeTypes = await getChargeTypes()

  const columns = [
    {
      key: 'name',
      header: 'Nama',
      render: (row: typeof chargeTypes[0]) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          {row.description && (
            <p className="text-xs text-gray-500">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'is_recurring',
      header: 'Periodik',
      className: 'hidden sm:table-cell',
      render: (row: typeof chargeTypes[0]) => (
        row.is_recurring ? (
          <Badge variant="success">Ya</Badge>
        ) : (
          <Badge variant="gray">Tidak</Badge>
        )
      ),
    },
    {
      key: 'is_per_unit',
      header: 'Per Unit',
      className: 'hidden sm:table-cell',
      render: (row: typeof chargeTypes[0]) => (
        row.is_per_unit ? (
          <Badge variant="info">Ya</Badge>
        ) : (
          <Badge variant="gray">Tidak</Badge>
        )
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      render: (row: typeof chargeTypes[0]) => (
        <Link
          href={`/dashboard/charge-types/${row.id}`}
          className="text-sm text-primary hover:text-primary-600 font-medium"
        >
          Detail
        </Link>
      ),
    },
  ]

  return (
    <PageTemplate
      title="Jenis Biaya"
      description="Kelola jenis biaya (sewa, air, listrik, dll)"
      breadcrumbs={[{ label: 'Jenis Biaya' }]}
      actions={
        <Link href="/dashboard/charge-types/new">
          <Button>
            <Plus className="w-4 h-4" />
            Tambah Jenis Biaya
          </Button>
        </Link>
      }
    >
      <Card noPadding>
        {chargeTypes.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="w-6 h-6" />}
            title="Belum ada jenis biaya"
            description="Tambahkan jenis biaya untuk digunakan dalam aturan biaya"
            action={
              <Link href="/dashboard/charge-types/new">
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                  Tambah
                </Button>
              </Link>
            }
          />
        ) : (
          <DataTable data={chargeTypes} columns={columns} />
        )}
      </Card>
    </PageTemplate>
  )
}
