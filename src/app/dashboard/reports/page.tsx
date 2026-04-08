import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Card } from '@/components/ui/card'
import { StatsCard } from '@/components/dashboard/stats-card'
import { StatusBadge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils/format'
import { DollarSign, TrendingUp, Home, Users } from 'lucide-react'

export const metadata: Metadata = { title: 'Laporan' }

export default async function ReportsPage() {
  const supabase = await createClient()

  const paymentsResult = await supabase
    .from('payments')
    .select('amount, payment_date', { count: 'exact', head: false })
    .eq('status', 'completed')

  const invoicesResult = await supabase
    .from('invoices')
    .select('total_amount, amount_paid')

  const [totalLocationsResult, totalUnitsResult] = await Promise.all([
    supabase
      .from('locations')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null),
    supabase
      .from('units')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null),
  ])

  const { data: occupancyData } = await supabase
    .from('units')
    .select('*', { count: 'exact', head: false })
    .eq('status', 'occupied')

  const totalRevenue = (paymentsResult.data || []).reduce((sum, p) => sum + Number(p.amount), 0)
  const totalOverdue = (invoicesResult.data || []).filter((i) => i.total_amount - i.amount_paid > 0).length
  const totalLocations = totalLocationsResult.count || 0
  const totalUnits = totalUnitsResult.count || 0

  return (
    <PageTemplate title="Laporan" description="Laporan keuangan dan operasional" breadcrumbs={[{ label: 'Laporan' }]}>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Total Pendapatan"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className="w-5 h-5" />}
          subtitle="Semua waktu"
        />
        <StatsCard
          title="Unit Terisi"
          value={`${(occupancyData || []).length} unit`}
          icon={<Home className="w-5 h-5" />}
          subtitle={`dari ${totalUnits} unit`}
        />
        <StatsCard
          title="Lokasi"
          value={totalLocations}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatsCard
          title="Tagihan Tertunggak"
          value={totalOverdue}
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      {/* Revenue breakdown by month */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card title="Ringkasan Pendapatan">
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Total Pendapatan</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalRevenue)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Tagihan Tertunggak</span>
              <span className="font-semibold text-red-600">{totalOverdue}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-500">Lokasi</span>
              <span className="font-semibold text-gray-900">{totalLocations || 0}</span>
            </div>
          </div>
        </Card>

        <Card title="Status Tagihan">
          <div className="space-y-3">
            {(invoicesResult.data || []).slice(0, 5).map((inv, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-sm text-gray-900">
                    {formatCurrency(inv.total_amount - inv.amount_paid)} belum lunas
                  </p>
                </div>
                <StatusBadge status="overdue" />
              </div>
            ))}
            {(!invoicesResult.data || invoicesResult.data.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">Tidak ada data</p>
            )}
          </div>
        </Card>
      </div>
    </PageTemplate>
  )
}
