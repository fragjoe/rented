import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/ui/badge'
import { getInvoices } from '@/lib/db/actions'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { Receipt } from 'lucide-react'

export const metadata: Metadata = { title: 'Tagihan' }

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const invoices = await getInvoices(status ? { status } : undefined)

  const columns = [
    {
      key: 'invoice_number',
      header: 'No. Tagihan',
      render: (row: typeof invoices[0]) => (
        <div>
          <p className="font-medium text-gray-900">{row.invoice_number}</p>
          <p className="text-xs text-gray-500">{formatDate(row.period_start)} — {formatDate(row.period_end)}</p>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Penyewa',
      className: 'hidden md:table-cell',
      render: (row: typeof invoices[0]) => {
        const contract = row.contracts as unknown as {
          customers: { full_name: string }
          units: { unit_number: string; locations: { name: string } }
        }
        return (
          <div>
            <p className="text-sm text-gray-900">{contract?.customers?.full_name}</p>
            <p className="text-xs text-gray-500">{contract?.units?.unit_number} — {contract?.units?.locations?.name}</p>
          </div>
        )
      },
    },
    {
      key: 'total_amount',
      header: 'Jumlah',
      className: 'hidden sm:table-cell',
      render: (row: typeof invoices[0]) => formatCurrency(row.total_amount),
    },
    {
      key: 'due_date',
      header: 'Jatuh Tempo',
      className: 'hidden lg:table-cell',
      render: (row: typeof invoices[0]) => formatDate(row.due_date),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: typeof invoices[0]) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      render: (row: typeof invoices[0]) => (
        <Link
          href={`/dashboard/invoices/${row.id}`}
          className="text-sm text-primary hover:text-primary-600 font-medium"
        >
          Detail
        </Link>
      ),
    },
  ]

  return (
    <PageTemplate
      title="Tagihan"
      description="Kelola tagihan dan pembayaran"
      breadcrumbs={[{ label: 'Tagihan' }]}
      actions={
        <Link href="/dashboard/invoices/new">
          <Button>
            <Plus className="w-4 h-4" />
            Buat Tagihan
          </Button>
        </Link>
      }
    >
      {/* Status Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-gray-500">Status:</span>
        {['', 'unpaid', 'partial', 'paid', 'overdue'].map((s) => (
          <Link
            key={s || 'all'}
            href={s ? `/dashboard/invoices?status=${s}` : '/dashboard/invoices'}
            className={`px-3 py-1 text-xs rounded-full ${
              status === s || (!status && s === '')
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s === '' ? 'Semua' : s === 'unpaid' ? 'Belum Bayar' : s === 'partial' ? 'Sebagian' : s === 'paid' ? 'Lunas' : 'Jatuh Tempo'}
          </Link>
        ))}
      </div>

      <Card noPadding className="mt-4">
        {invoices.length === 0 ? (
          <EmptyState
            icon={<Receipt className="w-6 h-6" />}
            title="Belum ada tagihan"
            description="Buat tagihan baru dari halaman buat tagihan"
            action={
              <Link href="/dashboard/invoices/new">
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                  Buat Tagihan
                </Button>
              </Link>
            }
          />
        ) : (
          <DataTable data={invoices} columns={columns} />
        )}
      </Card>
    </PageTemplate>
  )
}
