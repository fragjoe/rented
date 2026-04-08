'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger enter animation on every navigation
    setIsVisible(false)
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    })
    return () => cancelAnimationFrame(timer)
  }, [pathname, searchParams])

  return (
    <div
      className="transition-opacity duration-300 ease-out"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {children}
    </div>
  )
}
