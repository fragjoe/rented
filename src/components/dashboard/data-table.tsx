import Link from 'next/link'
import { Pagination } from '@/components/ui/pagination'

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
  const showPagination = (totalPages ?? 1) > 1

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
            <th key={col.key} className={`table-header ${col.className ?? ''}`}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
    )
  }

  return (
    <div className={`space-y-4 ${className ?? ''}`}>
      <div className="table-container">
        <table className="table">
          {renderHeader()}
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className={`table-cell ${col.className ?? ''}`}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages ?? 1}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}
