import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login — Kontrakan App',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Kontrakan App</h1>
          <p className="mt-1 text-sm text-gray-500">Aplikasi Manajemen Properti</p>
        </div>

        <div className="card p-6">{children}</div>

        <p className="mt-4 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Kontrakan App
        </p>
      </div>
    </div>
  )
}
