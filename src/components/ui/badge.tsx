import { cn } from '@/lib/utils/cn'
import type { invoice_status, unit_status, contract_status, maintenance_status, payment_status } from '@/types/database'

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'gray' | 'info'

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
  error: 'bg-red-50 text-red-700',
  gray: 'bg-gray-100 text-gray-700',
  info: 'bg-blue-50 text-blue-700',
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ variant = 'gray', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// Status badge helper
export type StatusValue =
  | invoice_status
  | unit_status
  | contract_status
  | maintenance_status
  | payment_status
  | string

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusValue
}

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  // Invoice status
  unpaid: { label: 'Belum Bayar', variant: 'error' },
  partial: { label: 'Sebagian', variant: 'warning' },
  paid: { label: 'Lunas', variant: 'success' },
  overdue: { label: 'Jatuh Tempo', variant: 'error' },
  cancelled: { label: 'Dibatalkan', variant: 'gray' },
  // Unit status
  available: { label: 'Tersedia', variant: 'success' },
  occupied: { label: 'Terisi', variant: 'primary' },
  maintenance: { label: 'Maintenance', variant: 'warning' },
  reserved: { label: 'Dipesan', variant: 'info' },
  // Contract status
  active: { label: 'Aktif', variant: 'success' },
  ended: { label: 'Selesai', variant: 'gray' },
  terminated: { label: 'Dihentikan', variant: 'error' },
  // Maintenance status
  reported: { label: 'Dilaporkan', variant: 'warning' },
  in_progress: { label: 'Sedang Diperbaiki', variant: 'info' },
  completed: { label: 'Selesai', variant: 'success' },
  // Payment status
  pending: { label: 'Menunggu', variant: 'warning' },
  failed: { label: 'Gagal', variant: 'error' },
  refunded: { label: 'Dikembalikan', variant: 'gray' },
  // Generic
  blacklisted: { label: 'Diblokir', variant: 'error' },
  inactive: { label: 'Nonaktif', variant: 'gray' },
  archived: { label: 'Arsip', variant: 'gray' },
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'gray' as BadgeVariant }

  return (
    <Badge variant={config.variant} className={className} {...props}>
      {config.label}
    </Badge>
  )
}
