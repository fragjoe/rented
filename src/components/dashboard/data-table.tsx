'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'

interface Column<T> {
  key: string
  header: string
  className?: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T extends { id: string }> {
  data: T[]
  columns: Column<T>[]
  currentPage?: number
  totalPages?: number
  totalItems?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  loading?: boolean
  empty?: React.ReactNode
  className?: string
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize = 10,
  onPageChange,
  loading,
  empty,
  className,
}: DataTableProps<T>) {
  const showPagination = totalPages > 1

  if (!loading && data.length === 0) {
    return (
      <div className={className}>
        <div className="table-container">
          <table className="table">{renderHeader()}</table>
        </div>
        {empty || (
          <div className="py-12 text-center text-sm text-gray-500">
            Data tidak ditemukan
          </div>
        )}
      </div>
    )
  }

  function renderHeader() {
    return (
      <thead className="bg-gray-50">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className={cn('table-header', col.className)}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="table-container">
        <table className="table">
          {renderHeader()}
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className={cn('table-cell', col.className)}>
                    {col.render
                      ? col.render(row)
                      : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {totalItems !== undefined && (
            <p className="text-sm text-gray-500">
              Menampilkan {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, totalItems)} dari {totalItems} data
            </p>
          )}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page: number
              if (totalPages <= 5) {
                page = i + 1
              } else if (currentPage <= 3) {
                page = i + 1
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i
              } else {
                page = currentPage - 2 + i
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'primary' : 'outline'}
                  size="icon"
                  onClick={() => onPageChange?.(page)}
                >
                  {page}
                </Button>
              )
            })}
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
