import { cn } from '@/lib/utils/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  noPadding?: boolean
}

export function Card({
  title,
  subtitle,
  actions,
  noPadding,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn('card', className)} {...props}>
      {(title || actions) && (
        <div className="px-4 py-3.5 border-b flex items-center justify-between">
          <div>
            {title && <h3 className="font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-4 md:p-6'}>{children}</div>
    </div>
  )
}
