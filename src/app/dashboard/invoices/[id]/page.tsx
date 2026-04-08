import { notFound } from 'next/navigation'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { DataTable } from '@/components/dashboard/data-table'
import { getInvoice, getPayments } from '@/lib/db/actions'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { InvoiceItemForm } from '@/components/forms/invoice-item-form'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const invoice = await getInvoice(id)
  return { title: invoice?.invoice_number || 'Tagihan' }
}

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params
  const [invoice, payments] = await Promise.all([
    getInvoice(id),
    getPayments({ invoice_id: id }),
  ])
  if (!invoice) notFound()

  const contract = invoice.contracts as unknown as {
    customers: { full_name: string; phone: string }
    units: { unit_number: string; locations: { name: string } }
  }

  return (
    <PageTemplate
      title={invoice.invoice_number}
      breadcrumbs={[
        { label: 'Tagihan', href: '/dashboard/invoices' },
        { label: invoice.invoice_number },
      ]}
      actions={
        <Link href="/dashboard/invoices">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Info */}
        <Card className="lg:col-span-2" title="Informasi Tagihan">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">No. Tagihan</span>
              <span className="font-medium text-gray-900">{invoice.invoice_number}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Penyewa</span>
              <span className="font-medium text-gray-900">{contract?.customers?.full_name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Unit</span>
              <span className="font-medium text-gray-900">
                {contract?.units?.unit_number} — {contract?.units?.locations?.name}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Periode</span>
              <span className="font-medium text-gray-900">
                {formatDate(invoice.period_start)} — {formatDate(invoice.period_end)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Jatuh Tempo</span>
              <span className="font-medium text-gray-900">{formatDate(invoice.due_date)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Status</span>
              <StatusBadge status={invoice.status} />
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Detail Tagihan</h4>
            </div>
            {(invoice.invoice_items as unknown as Array<{
              id: string
              description: string
              quantity: number
              unit_price: number
              amount: number
              charge_types?: { name: string }
            }>)?.length > 0 ? (
              <div className="space-y-2">
                {(invoice.invoice_items as unknown as Array<{
                  id: string
                  description: string
                  quantity: number
                  unit_price: number
                  amount: number
                  charge_types?: { name: string }
                }>).map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-sm text-gray-900">{item.description}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-500">{item.quantity} x {formatCurrency(item.unit_price)}</p>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatCurrency(invoice.total_amount)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Belum ada detail tagihan</p>
            )}
          </div>
        </Card>

        {/* Payments */}
        <Card
          title="Pembayaran"
          actions={
            <Link href={`/dashboard/payments/new?invoice_id=${id}`} className="text-sm text-primary hover:text-primary-600 font-medium">
              <Plus className="w-4 h-4 inline mr-1" />
              Bayar
            </Link>
          }
        >
          {payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map((pay) => (
                <div key={pay.id} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(pay.amount)}</span>
                    <StatusBadge status={pay.status} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(pay.payment_date)} • {pay.payment_method}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Belum ada pembayaran</p>
          )}
        </Card>
      </div>
    </PageTemplate>
  )
}
