'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h2>
      <p className="text-gray-500 mb-4 max-w-md">
        {error.message || 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-600"
      >
        Coba Lagi
      </button>
    </div>
  )
}
