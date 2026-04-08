import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/server'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('shared_utilities').select('*').eq('id', id).single()
  return { title: `Utilitas ${data?.type || ''}` }
}

export default async function SharedUtilityDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: util } = await supabase
    .from('shared_utilities')
    .select('*, locations(name)')
    .eq('id', id)
    .single()

  if (!util) notFound()

  const location = util.locations as unknown as { name: string }

  return (
    <PageTemplate
      title={`Utilitas ${util.type}`}
      breadcrumbs={[
        { label: 'Utilitas', href: '/dashboard/shared-utilities' },
        { label: formatDate(util.period) },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/shared-utilities/${id}/edit`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Link href="/dashboard/shared-utilities">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Informasi Utilitas">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Lokasi</span>
              <span className="font-medium text-gray-900">{location?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Jenis</span>
              <span className="badge badge-gray capitalize">{util.type}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Periode</span>
              <span className="font-medium text-gray-900">{formatDate(util.period)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Total</span>
              <span className="font-medium text-gray-900">{formatCurrency(util.total_amount)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Dibagi</span>
              <span className="font-medium text-gray-900">/{util.divided_by} unit</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Per Unit</span>
              <span className="font-medium text-gray-900">{formatCurrency(util.per_unit_amount)}</span>
            </div>
            {util.notes && (
              <div className="py-2">
                <span className="text-gray-500">Catatan</span>
                <p className="mt-1 text-gray-900">{util.notes}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageTemplate>
  )
}
