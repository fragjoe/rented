import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: string
    direction: 'up' | 'down'
  }
  icon?: React.ReactNode
  className?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  className,
}: StatsCardProps) {
  return (
    <div className={cn('card p-4 md:p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div
          className={cn(
            'mt-3 flex items-center gap-1 text-xs font-medium',
            trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
          )}
        >
          {trend.direction === 'up' ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>{trend.value}</span>
          <span className="text-gray-400">vs bulan lalu</span>
        </div>
      )}
    </div>
  )
}
