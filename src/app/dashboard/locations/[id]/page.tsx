import { notFound } from 'next/navigation'
import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getLocation } from '@/lib/db/actions'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const location = await getLocation(id)
  return { title: location?.name || 'Lokasi' }
}

export default async function LocationDetailPage({ params }: Props) {
  const { id } = await params
  const location = await getLocation(id)

  if (!location) notFound()

  return (
    <PageTemplate
      title={location.name}
      breadcrumbs={[
        { label: 'Lokasi', href: '/dashboard/locations' },
        { label: location.name },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/locations/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Link href="/dashboard/locations">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <Card className="lg:col-span-2" title="Informasi Lokasi">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Nama</span>
              <span className="font-medium text-gray-900">{location.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Kota</span>
              <span className="font-medium text-gray-900">{location.city}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Alamat</span>
              <span className="font-medium text-gray-900 text-right max-w-xs">
                {location.address}
              </span>
            </div>
            {location.postal_code && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Kode Pos</span>
                <span className="font-medium text-gray-900">{location.postal_code}</span>
              </div>
            )}
            {location.description && (
              <div className="py-2">
                <span className="text-gray-500">Deskripsi</span>
                <p className="mt-1 text-gray-900">{location.description}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Units Preview */}
        <Card title="Unit" actions={
          <Link href={`/dashboard/units?location_id=${location.id}`} className="text-sm text-primary hover:text-primary-600 font-medium">
            Lihat Semua
          </Link>
        }>
          <p className="text-sm text-gray-500 text-center py-4">
            Unit akan ditampilkan setelah lokasi dibuat
          </p>
        </Card>
      </div>
    </PageTemplate>
  )
}
