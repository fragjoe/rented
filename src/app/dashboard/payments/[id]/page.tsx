import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { getPayment } from '@/lib/db/actions'
import { formatCurrency, formatDate } from '@/lib/utils/format'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const payment = await getPayment(id)
  return { title: `Pembayaran ${payment?.id?.slice(0, 8) || ''}` }
}

export default async function PaymentDetailPage({ params }: Props) {
  const { id } = await params
  const payment = await getPayment(id)
  if (!payment) notFound()

  const invoice = payment.invoices as unknown as { invoice_number: string; total_amount: number; status: string }
  const user = payment.users as unknown as { full_name: string } | null

  return (
    <PageTemplate
      title={`Pembayaran`}
      breadcrumbs={[
        { label: 'Pembayaran', href: '/dashboard/payments' },
        { label: id.slice(0, 8) },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/payments/${id}/edit`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Link href="/dashboard/payments">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Informasi Pembayaran">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Tagihan</span>
              <span className="font-medium text-gray-900">{invoice?.invoice_number}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Jumlah</span>
              <span className="font-medium text-gray-900">{formatCurrency(payment.amount)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Metode</span>
              <span className="badge badge-gray capitalize">{payment.payment_method}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Tanggal Bayar</span>
              <span className="font-medium text-gray-900">{formatDate(payment.payment_date)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Status</span>
              <StatusBadge status={payment.status} />
            </div>
            {payment.reference_number && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">No. Referensi</span>
                <span className="font-medium text-gray-900">{payment.reference_number}</span>
              </div>
            )}
            {payment.sender_bank && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Bank Pengirim</span>
                <span className="font-medium text-gray-900">{payment.sender_bank}</span>
              </div>
            )}
            {payment.sender_account && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Akun Pengirim</span>
                <span className="font-medium text-gray-900">{payment.sender_account}</span>
              </div>
            )}
            {user && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Diproses Oleh</span>
                <span className="font-medium text-gray-900">{user.full_name}</span>
              </div>
            )}
            {payment.notes && (
              <div className="py-2">
                <span className="text-gray-500">Catatan</span>
                <p className="mt-1 text-gray-900">{payment.notes}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageTemplate>
  )
}
