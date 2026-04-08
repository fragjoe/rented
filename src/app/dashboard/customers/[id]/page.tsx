import { notFound } from 'next/navigation'
import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getCustomer, getContracts } from '@/lib/db/actions'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const customer = await getCustomer(id)
  return { title: customer?.full_name || 'Penyewa' }
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params
  const [customer, contracts] = await Promise.all([
    getCustomer(id),
    getContracts({ customer_id: id }),
  ])
  if (!customer) notFound()

  return (
    <PageTemplate
      title={customer.full_name}
      breadcrumbs={[
        { label: 'Penyewa', href: '/dashboard/customers' },
        { label: customer.full_name },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/customers/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Link href="/dashboard/customers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Informasi Penyewa">
          <div className="space-y-3 text-sm">
            {customer.phone && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Telepon</span>
                <span className="font-medium text-gray-900">{customer.phone}</span>
              </div>
            )}
            {customer.email && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{customer.email}</span>
              </div>
            )}
            {customer.id_card_number && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">No. KTP</span>
                <span className="font-medium text-gray-900">{customer.id_card_number}</span>
              </div>
            )}
            {customer.occupation && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Pekerjaan</span>
                <span className="font-medium text-gray-900">{customer.occupation}</span>
              </div>
            )}
            {customer.emergency_contact_name && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Kontak Darurat</span>
                <span className="font-medium text-gray-900">
                  {customer.emergency_contact_name} — {customer.emergency_contact_phone}
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card title={`Kontrak (${contracts.length})`}>
          {contracts.length > 0 ? (
            <div className="space-y-3">
              {contracts.map((contract) => {
                const unit = contract.units as unknown as {
                  unit_number: string
                  locations: { name: string }
                }
                return (
                  <Link
                    key={contract.id}
                    href={`/dashboard/contracts/${contract.id}`}
                    className="block p-3 rounded-lg border hover:bg-gray-50"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      Unit {unit?.unit_number}
                    </p>
                    <p className="text-xs text-gray-500">{unit?.locations?.name}</p>
                    <p className="text-xs text-gray-400 capitalize mt-1">{contract.status}</p>
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Belum ada kontrak</p>
          )}
        </Card>
      </div>
    </PageTemplate>
  )
}
