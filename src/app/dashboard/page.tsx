import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageTemplate } from '@/components/dashboard/page-template'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import {
  MapPin,
  Home,
  Users,
  DollarSign,
  Receipt,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch stats sequentially to avoid connection pool exhaustion on Vercel
  const [locationsResult, unitsResult, recentInvoicesResult, overdueResult] = await Promise.all([
    supabase
      .from('locations')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null),
    supabase
      .from('units')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null),
    supabase
      .from('invoices')
      .select(`
        id,
        invoice_number,
        total_amount,
        status,
        due_date,
        contracts!inner(
          customers!inner(full_name),
          units!inner(unit_number, locations!inner(name))
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'overdue')
      .is('deleted_at', null),
  ])

  const occupiedUnitsResult = await supabase
    .from('units')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'occupied')
    .is('deleted_at', null)

  const totalLocations = locationsResult.count || 0
  const totalUnits = unitsResult.count || 0
  const occupiedUnits = occupiedUnitsResult.count || 0
  const recentInvoices = recentInvoicesResult.data || []
  const overdueInvoicesCount = overdueResult.count || 0
  const availableUnits = totalUnits - occupiedUnits
  const occupancyRate =
    totalUnits && totalUnits > 0
      ? Math.round(((occupiedUnits || 0) / totalUnits) * 100)
      : 0

  return (
    <PageTemplate
      title="Dashboard"
      description={`Selamat datang di Kontrakan App — ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Total Lokasi"
          value={totalLocations || 0}
          icon={<MapPin className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Unit"
          value={totalUnits || 0}
          subtitle={`${availableUnits} tersedia`}
          icon={<Home className="w-5 h-5" />}
        />
        <StatsCard
          title="Terisi"
          value={`${occupiedUnits || 0} unit`}
          subtitle={`${occupancyRate}% okupansi`}
          icon={<Users className="w-5 h-5" />}
        />
        <StatsCard
          title="Tagihan Jatuh Tempo"
          value={overdueInvoicesCount}
          icon={<Receipt className="w-5 h-5" />}
          trend={
            overdueInvoicesCount > 0
              ? { value: 'Perlu perhatian', direction: 'up' }
              : undefined
          }
        />
      </div>

      {/* Recent Invoices */}
      <Card
        title="Tagihan Terbaru"
        subtitle="Tagihan bulan ini"
        actions={
          <Link
            href="/dashboard/invoices"
            className="text-sm text-primary hover:text-primary-600 font-medium"
          >
            Lihat Semua
          </Link>
        }
      >
        {recentInvoices && recentInvoices.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentInvoices.map((invoice) => {
              const contract = invoice.contracts as unknown as {
                customers: { full_name: string }
                units: { unit_number: string; locations: { name: string } }
              }
              return (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {invoice.invoice_number}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {contract?.customers?.full_name} —{' '}
                      {contract?.units?.locations?.name} / {contract?.units?.unit_number}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.total_amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(invoice.due_date)}
                      </p>
                    </div>
                    <StatusBadge status={invoice.status} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">
            Belum ada tagihan
          </p>
        )}
      </Card>
    </PageTemplate>
  )
}
