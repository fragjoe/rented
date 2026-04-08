'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger on any pathname or searchParam change
    // Small delay to detect actual navigation (not initial mount)
    const timer = setTimeout(() => {
      setIsNavigating(true)
      setVisible(true)
      setProgress(20)
    }, 50)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 150)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [pathname, searchParams])

  useEffect(() => {
    if (isNavigating) {
      // Navigation complete — fill to 100% then hide
      setProgress(100)
      const timer = setTimeout(() => {
        setVisible(false)
        setIsNavigating(false)
        setProgress(0)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [pathname, searchParams, isNavigating])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-0.5 transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div
        className="h-full bg-primary transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
