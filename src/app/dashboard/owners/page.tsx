import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { getOwners } from '@/lib/db/actions'
import { Users, Phone, Mail } from 'lucide-react'

export const metadata: Metadata = { title: 'Pemilik' }

export default async function OwnersPage() {
  const owners = await getOwners()

  const columns = [
    {
      key: 'name',
      header: 'Nama',
      render: (row: typeof owners[0]) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          {row.id_card_number && (
            <p className="text-xs text-gray-500">KTP: {row.id_card_number}</p>
          )}
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Kontak',
      render: (row: typeof owners[0]) => (
        <div className="space-y-1">
          {row.phone && (
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {row.phone}
            </p>
          )}
          {row.email && (
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {row.email}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'bank',
      header: 'Rekening',
      className: 'hidden lg:table-cell',
      render: (row: typeof owners[0]) =>
        row.bank_name ? `${row.bank_name} — ${row.bank_account}` : '—',
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      render: (row: typeof owners[0]) => (
        <Link
          href={`/dashboard/owners/${row.id}`}
          className="text-sm text-primary hover:text-primary-600 font-medium"
        >
          Detail
        </Link>
      ),
    },
  ]

  return (
    <PageTemplate
      title="Pemilik"
      description="Kelola pemilik unit properti"
      breadcrumbs={[{ label: 'Pemilik' }]}
      actions={
        <Link href="/dashboard/owners/new">
          <Button>
            <Plus className="w-4 h-4" />
            Tambah Pemilik
          </Button>
        </Link>
      }
    >
      <Card noPadding>
        {owners.length === 0 ? (
          <EmptyState
            icon={<Users className="w-6 h-6" />}
            title="Belum ada pemilik"
            description="Tambahkan pemilik unit pertama"
            action={
              <Link href="/dashboard/owners/new">
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                  Tambah Pemilik
                </Button>
              </Link>
            }
          />
        ) : (
          <DataTable data={owners} columns={columns} />
        )}
      </Card>
    </PageTemplate>
  )
}
