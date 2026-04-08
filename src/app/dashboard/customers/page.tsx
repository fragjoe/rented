import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { getCustomers } from '@/lib/db/actions'
import { Users, Phone } from 'lucide-react'

export const metadata: Metadata = { title: 'Penyewa' }

export default async function CustomersPage() {
  const customers = await getCustomers()

  const columns = [
    {
      key: 'full_name',
      header: 'Nama',
      render: (row: typeof customers[0]) => (
        <div>
          <p className="font-medium text-gray-900">{row.full_name}</p>
          {row.id_card_number && (
            <p className="text-xs text-gray-500">KTP: {row.id_card_number}</p>
          )}
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Kontak',
      className: 'hidden md:table-cell',
      render: (row: typeof customers[0]) =>
        row.phone ? (
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {row.phone}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'occupation',
      header: 'Pekerjaan',
      className: 'hidden lg:table-cell',
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      render: (row: typeof customers[0]) => (
        <Link
          href={`/dashboard/customers/${row.id}`}
          className="text-sm text-primary hover:text-primary-600 font-medium"
        >
          Detail
        </Link>
      ),
    },
  ]

  return (
    <PageTemplate
      title="Penyewa"
      description="Kelola data penyewa"
      breadcrumbs={[{ label: 'Penyewa' }]}
      actions={
        <Link href="/dashboard/customers/new">
          <Button>
            <Plus className="w-4 h-4" />
            Tambah Penyewa
          </Button>
        </Link>
      }
    >
      <Card noPadding>
        {customers.length === 0 ? (
          <EmptyState
            icon={<Users className="w-6 h-6" />}
            title="Belum ada penyewa"
            description="Tambahkan penyewa pertama"
            action={
              <Link href="/dashboard/customers/new">
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                  Tambah Penyewa
                </Button>
              </Link>
            }
          />
        ) : (
          <DataTable data={customers} columns={columns} />
        )}
      </Card>
    </PageTemplate>
  )
}
