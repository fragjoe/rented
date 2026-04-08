export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-4 md:p-6 space-y-3">
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="card p-4 md:p-6">
        <div className="space-y-3">
          <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
