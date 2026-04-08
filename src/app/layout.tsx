import type { Metadata } from 'next'
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
        <NavigationProgress />
        {children}
      </body>
    </html>
  )
}
