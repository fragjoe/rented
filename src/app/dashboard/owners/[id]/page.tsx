import { notFound } from 'next/navigation'
import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getOwner } from '@/lib/db/actions'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const owner = await getOwner(id)
  return { title: owner?.name || 'Pemilik' }
}

export default async function OwnerDetailPage({ params }: Props) {
  const { id } = await params
  const owner = await getOwner(id)
  if (!owner) notFound()

  return (
    <PageTemplate
      title={owner.name}
      breadcrumbs={[
        { label: 'Pemilik', href: '/dashboard/owners' },
        { label: owner.name },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/owners/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Link href="/dashboard/owners">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>
        </div>
      }
    >
      <Card className="max-w-2xl" title="Informasi Pemilik">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Nama</span>
            <span className="font-medium text-gray-900">{owner.name}</span>
          </div>
          {owner.phone && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Telepon</span>
              <span className="font-medium text-gray-900">{owner.phone}</span>
            </div>
          )}
          {owner.email && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-900">{owner.email}</span>
            </div>
          )}
          {owner.id_card_number && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">No. KTP</span>
              <span className="font-medium text-gray-900">{owner.id_card_number}</span>
            </div>
          )}
          {owner.bank_name && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Rekening</span>
              <span className="font-medium text-gray-900">
                {owner.bank_name} — {owner.bank_account}
              </span>
            </div>
          )}
          {owner.notes && (
            <div className="py-2">
              <span className="text-gray-500">Catatan</span>
              <p className="mt-1 text-gray-900">{owner.notes}</p>
            </div>
          )}
        </div>
      </Card>
    </PageTemplate>
  )
}
