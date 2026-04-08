import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils/format'
import { Plug } from 'lucide-react'

export const metadata: Metadata = { title: 'Aturan Biaya' }

type ChargeRuleRow = {
  id: string
  amount: number
  period: string
  is_shared: boolean
  locations: { name: string } | null
  charge_types: { name: string } | null
}

export default async function ChargeRulesPage() {
  const supabase = await createClient()

  const { data: rules } = await supabase
    .from('charge_rules')
    .select('*, locations(name), charge_types(name, description)')
    .order('created_at', { ascending: false })

  const columns: { key: string; header: string; className?: string; render?: (row: ChargeRuleRow) => React.ReactNode }[] = [
    {
      key: 'location',
      header: 'Lokasi',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.locations?.name}</p>
          <p className="text-xs text-gray-500">{row.charge_types?.name}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Jumlah',
      className: 'hidden sm:table-cell',
      render: (row) => formatCurrency(row.amount),
    },
    {
      key: 'period',
      header: 'Period',
      className: 'hidden md:table-cell',
      render: (row) => (
        <span className="badge badge-gray capitalize">{row.period === 'monthly' ? 'Bulanan' : 'Sekali'}</span>
      ),
    },
    {
      key: 'is_shared',
      header: 'Shared',
      className: 'hidden sm:table-cell',
      render: (row) =>
        row.is_shared ? <Badge variant="warning">Ya</Badge> : <Badge variant="gray">Tidak</Badge>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      render: (row) => (
        <Link href={`/dashboard/charge-rules/${row.id}`} className="text-sm text-primary hover:text-primary-600 font-medium">Detail</Link>
      ),
    },
  ]

  return (
    <PageTemplate
      title="Aturan Biaya"
      description="Aturan biaya per lokasi"
      breadcrumbs={[{ label: 'Aturan Biaya' }]}
      actions={
        <Link href="/dashboard/charge-rules/new">
          <Button><Plus className="w-4 h-4" />Tambah Aturan</Button>
        </Link>
      }
    >
      <Card noPadding>
        {(!rules || rules.length === 0) ? (
          <EmptyState icon={<Plug className="w-6 h-6" />} title="Belum ada aturan biaya" description="Tambahkan aturan biaya untuk setiap lokasi" />
        ) : (
          <DataTable data={rules} columns={columns} />
        )}
      </Card>
    </PageTemplate>
  )
}
