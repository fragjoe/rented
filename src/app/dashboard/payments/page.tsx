import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/ui/badge'
import { getPayments } from '@/lib/db/actions'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { DollarSign } from 'lucide-react'

export const metadata: Metadata = { title: 'Pembayaran' }

export default async function PaymentsPage() {
  const payments = await getPayments()

  const columns = [
    {
      key: 'invoice',
      header: 'Tagihan',
      render: (row: typeof payments[0]) => {
        const invoice = row.invoices as unknown as { invoice_number: string }
        return (
          <div>
            <p className="font-medium text-gray-900">{invoice?.invoice_number}</p>
            <p className="text-xs text-gray-500">{formatDate(row.payment_date)}</p>
          </div>
        )
      },
    },
    {
      key: 'amount',
      header: 'Jumlah',
      className: 'hidden sm:table-cell',
      render: (row: typeof payments[0]) => (
        <span className="font-medium text-gray-900">{formatCurrency(row.amount)}</span>
      ),
    },
    {
      key: 'payment_method',
      header: 'Metode',
      className: 'hidden md:table-cell',
      render: (row: typeof payments[0]) => (
        <span className="badge badge-gray capitalize">{row.payment_method}</span>
      ),
    },
    {
      key: 'reference_number',
      header: 'Referensi',
      className: 'hidden lg:table-cell',
      render: (row: typeof payments[0]) => row.reference_number || '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: typeof payments[0]) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      render: (row: typeof payments[0]) => (
        <Link
          href={`/dashboard/payments/${row.id}`}
          className="text-sm text-primary hover:text-primary-600 font-medium"
        >
          Detail
        </Link>
      ),
    },
  ]

  return (
    <PageTemplate
      title="Pembayaran"
      description="Kelola pembayaran tagihan"
      breadcrumbs={[{ label: 'Pembayaran' }]}
      actions={
        <Link href="/dashboard/payments/new">
          <Button>
            <Plus className="w-4 h-4" />
            Catat Pembayaran
          </Button>
        </Link>
      }
    >
      <Card noPadding>
        {payments.length === 0 ? (
          <EmptyState
            icon={<DollarSign className="w-6 h-6" />}
            title="Belum ada pembayaran"
            description="Catat pembayaran pertama"
            action={
              <Link href="/dashboard/payments/new">
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                  Catat
                </Button>
              </Link>
            }
          />
        ) : (
          <DataTable data={payments} columns={columns} />
        )}
      </Card>
    </PageTemplate>
  )
}
