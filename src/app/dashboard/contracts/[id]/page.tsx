import { notFound } from 'next/navigation'
import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { DataTable } from '@/components/dashboard/data-table'
import { getContract, getInvoices } from '@/lib/db/actions'
import { formatCurrency, formatDate } from '@/lib/utils/format'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const contract = await getContract(id)
  const customer = contract?.customers as unknown as { full_name: string }
  return { title: `Kontrak ${customer?.full_name}` }
}

export default async function ContractDetailPage({ params }: Props) {
  const { id } = await params
  const [contract, invoices] = await Promise.all([
    getContract(id),
    getInvoices({ contract_id: id }),
  ])
  if (!contract) notFound()

  const customer = contract.customers as unknown as { full_name: string; phone: string }
  const unit = contract.units as unknown as {
    unit_number: string
    locations: { name: string; city: string }
    owners: { name: string } | null
  }

  return (
    <PageTemplate
      title={`Kontrak ${customer.full_name}`}
      breadcrumbs={[
        { label: 'Kontrak', href: '/dashboard/contracts' },
        { label: customer.full_name },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/contracts/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Link href="/dashboard/contracts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Informasi Kontrak">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Penyewa</span>
              <span className="font-medium text-gray-900">{customer.full_name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Unit</span>
              <span className="font-medium text-gray-900">
                {unit.unit_number} — {unit.locations?.name}
              </span>
            </div>
            {unit.owners && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Pemilik</span>
                <span className="font-medium text-gray-900">{unit.owners.name}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Tanggal Mulai</span>
              <span className="font-medium text-gray-900">{formatDate(contract.start_date)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Tanggal Selesai</span>
              <span className="font-medium text-gray-900">
                {contract.end_date ? formatDate(contract.end_date) : '—'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Tarif Bulanan</span>
              <span className="font-medium text-gray-900">{formatCurrency(contract.monthly_rate)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Deposit</span>
              <span className="font-medium text-gray-900">{formatCurrency(contract.deposit_amount)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Status</span>
              <StatusBadge status={contract.status} />
            </div>
          </div>
        </Card>

        <Card
          title={`Tagihan (${invoices.length})`}
          actions={
            <Link href={`/dashboard/invoices?contract_id=${id}`} className="text-sm text-primary hover:text-primary-600 font-medium">
              Lihat Semua
            </Link>
          }
        >
          {invoices.length > 0 ? (
            <div className="space-y-3">
              {invoices.slice(0, 5).map((inv) => (
                <Link
                  key={inv.id}
                  href={`/dashboard/invoices/${inv.id}`}
                  className="block p-3 rounded-lg border hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{inv.invoice_number}</p>
                    <StatusBadge status={inv.status} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatCurrency(inv.total_amount)}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Belum ada tagihan</p>
          )}
        </Card>
      </div>
    </PageTemplate>
  )
}
