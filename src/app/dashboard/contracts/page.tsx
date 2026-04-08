import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/ui/badge'
import { getContracts } from '@/lib/db/actions'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { FileText } from 'lucide-react'

export const metadata: Metadata = { title: 'Kontrak' }

export default async function ContractsPage() {
  const contracts = await getContracts()

  const columns = [
    {
      key: 'customer',
      header: 'Penyewa',
      render: (row: typeof contracts[0]) => {
        const customer = row.customers as unknown as { full_name: string }
        const unit = row.units as unknown as { unit_number: string; locations: { name: string } }
        return (
          <div>
            <p className="font-medium text-gray-900">{customer.full_name}</p>
            <p className="text-xs text-gray-500">
              {unit?.unit_number} — {unit?.locations?.name}
            </p>
          </div>
        )
      },
    },
    {
      key: 'start_date',
      header: 'Mulai',
      className: 'hidden md:table-cell',
      render: (row: typeof contracts[0]) => formatDate(row.start_date),
    },
    {
      key: 'end_date',
      header: 'Selesai',
      className: 'hidden lg:table-cell',
      render: (row: typeof contracts[0]) => row.end_date ? formatDate(row.end_date) : '—',
    },
    {
      key: 'monthly_rate',
      header: 'Tarif',
      className: 'hidden sm:table-cell',
      render: (row: typeof contracts[0]) => formatCurrency(row.monthly_rate),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: typeof contracts[0]) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      render: (row: typeof contracts[0]) => (
        <Link
          href={`/dashboard/contracts/${row.id}`}
          className="text-sm text-primary hover:text-primary-600 font-medium"
        >
          Detail
        </Link>
      ),
    },
  ]

  return (
    <PageTemplate
      title="Kontrak"
      description="Kelola kontrak penyewa"
      breadcrumbs={[{ label: 'Kontrak' }]}
      actions={
        <Link href="/dashboard/contracts/new">
          <Button>
            <Plus className="w-4 h-4" />
            Tambah Kontrak
          </Button>
        </Link>
      }
    >
      <Card noPadding>
        {contracts.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="Belum ada kontrak"
            description="Buat kontrak pertama untuk penyewa"
            action={
              <Link href="/dashboard/contracts/new">
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                  Tambah Kontrak
                </Button>
              </Link>
            }
          />
        ) : (
          <DataTable data={contracts} columns={columns} />
        )}
      </Card>
    </PageTemplate>
  )
}
