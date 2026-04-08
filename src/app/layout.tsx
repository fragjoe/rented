import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { NavigationProgress } from '@/components/ui/navigation-progress'

export const metadata: Metadata = {
  title: 'Kontrakan App',
  description: 'Aplikasi Manajemen Kos / Kontrakan / Parkir',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
