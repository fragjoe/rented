import type { Metadata } from 'next'
import { createServerAdminClient } from '@/lib/supabase/server-admin'
import { PageTemplate } from '@/components/dashboard/page-template'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import {
  MapPin,
  Home,
  Users,
  Receipt,
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = createServerAdminClient()

  let totalLocations = 0
  let totalUnits = 0
  let occupiedUnits = 0
  let overdueInvoicesCount = 0
  let recentInvoices: { id: string; invoice_number: string; total_amount: number | string; status: string; due_date: string }[] = []
  try {
    const [locationsResult, unitsResult, occupiedUnitsResult, overdueResult, recentInvoicesResult] =
      await Promise.all([
        supabase
          .from('locations')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .is('deleted_at', null),
        supabase
          .from('units')
          .select('*', { count: 'exact', head: true })
          .is('deleted_at', null),
        supabase
          .from('units')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'occupied')
          .is('deleted_at', null),
        supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'overdue')
          .is('deleted_at', null),
        supabase
          .from('invoices')
          .select('id, invoice_number, total_amount, status, due_date, created_at')
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(5),
      ])

    for (const [name, result] of [
      ['locations', locationsResult],
      ['units', unitsResult],
      ['occupiedUnits', occupiedUnitsResult],
      ['overdue', overdueResult],
      ['recentInvoices', recentInvoicesResult],
    ] as const) {
      if (result.error) {
        console.error(`[Dashboard] query error [${name}]:`, result.error)
      }
    }

    totalLocations = locationsResult.count ?? 0
    totalUnits = unitsResult.count ?? 0
    occupiedUnits = occupiedUnitsResult.count ?? 0
    overdueInvoicesCount = overdueResult.count ?? 0
    recentInvoices = recentInvoicesResult.data ?? []
  } catch (err) {
    console.error('[Dashboard] data fetch failed:', err)
  }

  const availableUnits = totalUnits - occupiedUnits
  const occupancyRate =
    totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0

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
          value={occupiedUnits}
          subtitle={`${availableUnits} tersedia · ${occupancyRate}% okupansi`}
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
            {recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {invoice.invoice_number}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    —
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
            ))}
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