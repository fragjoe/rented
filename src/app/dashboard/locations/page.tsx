import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { DataTable } from '@/components/dashboard/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { getLocations } from '@/lib/db/actions'
import { MapPin } from 'lucide-react'

export const metadata: Metadata = { title: 'Lokasi' }

export default async function LocationsPage() {
  const locations = await getLocations()

  const columns = [
    {
      key: 'name',
      header: 'Nama',
      render: (row: typeof locations[0]) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.city}</p>
        </div>
      ),
    },
    {
      key: 'address',
      header: 'Alamat',
      className: 'hidden md:table-cell',
    },
    {
      key: 'units',
      header: 'Unit',
      className: 'hidden lg:table-cell text-center',
      render: () => '—',
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      render: (row: typeof locations[0]) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/dashboard/locations/${row.id}`}
            className="text-sm text-primary hover:text-primary-600 font-medium"
          >
            Detail
          </Link>
        </div>
      ),
    },
  ]

  return (
    <PageTemplate
      title="Lokasi"
      description="Kelola lokasi properti Anda"
      breadcrumbs={[{ label: 'Lokasi' }]}
      actions={
        <Link href="/dashboard/locations/new">
          <Button>
            <Plus className="w-4 h-4" />
            Tambah Lokasi
          </Button>
        </Link>
      }
    >
      <Card noPadding>
        {locations.length === 0 ? (
          <EmptyState
            icon={<MapPin className="w-6 h-6" />}
            title="Belum ada lokasi"
            description="Tambahkan lokasi pertama untuk mulai mengelola properti Anda"
            action={
              <Link href="/dashboard/locations/new">
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                  Tambah Lokasi
                </Button>
              </Link>
            }
          />
        ) : (
          <DataTable
            data={locations}
            columns={columns}
            empty={
              <EmptyState
                icon={<MapPin className="w-6 h-6" />}
                title="Tidak ada data"
                description="Coba ubah filter atau tambah data baru"
              />
            }
          />
        )}
      </Card>
    </PageTemplate>
  )
}
