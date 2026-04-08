'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MapPin,
  Users,
  Home,
  User,
  FileText,
  Receipt,
  DollarSign,
  Wrench,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Plug,
  CreditCard,
  FileType,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { signOut } from '@/app/auth/actions'
import type { UserRole } from '@/types/auth'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Master Data',
    icon: FileType,
    href: '#',
    children: [
      { title: 'Lokasi', href: '/dashboard/locations', icon: MapPin },
      { title: 'Pemilik', href: '/dashboard/owners', icon: User },
      { title: 'Unit', href: '/dashboard/units', icon: Home },
      { title: 'Penyewa', href: '/dashboard/customers', icon: Users },
    ],
  },
  {
    title: 'Kontrak',
    href: '/dashboard/contracts',
    icon: FileText,
  },
  {
    title: 'Penagihan',
    icon: Receipt,
    href: '#',
    children: [
      { title: 'Jenis Biaya', href: '/dashboard/charge-types', icon: CreditCard },
      { title: 'Aturan Biaya', href: '/dashboard/charge-rules', icon: Plug },
      { title: 'Tagihan', href: '/dashboard/invoices', icon: Receipt },
      { title: 'Pembayaran', href: '/dashboard/payments', icon: DollarSign },
    ],
  },
  {
    title: 'Utilitas',
    href: '/dashboard/shared-utilities',
    icon: Plug,
  },
  {
    title: 'Maintenance',
    href: '/dashboard/maintenance',
    icon: Wrench,
  },
  {
    title: 'Laporan',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
  {
    title: 'Pengaturan',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

interface SidebarNavProps {
  onLinkClick?: () => void
}

export function SidebarNav({ onLinkClick }: SidebarNavProps) {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  function toggleGroup(key: string) {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function isActive(href: string) {
    if (href === '#') return false
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  function renderItem(item: NavItem, index: number) {
    const key = item.title + index
    const hasChildren = item.children && item.children.length > 0
    const active = isActive(item.href)
    const isExpanded = expandedGroups[key]

    if (hasChildren) {
      return (
        <div key={key}>
          <button
            onClick={() => toggleGroup(key)}
            className={cn(
              'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              {item.title}
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4">
              {item.children!.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onLinkClick}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    isActive(child.href)
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <child.icon className="w-4 h-4" />
                  {child.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onLinkClick}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          active
            ? 'bg-primary-50 text-primary-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        )}
      >
        <item.icon className="w-5 h-5" />
        {item.title}
      </Link>
    )
  }

  return (
    <nav className="px-3 space-y-1">
      {navItems.map((item, index) => renderItem(item, index))}
    </nav>
  )
}

interface DashboardShellProps {
  children: React.ReactNode
  user: {
    id: string
    email: string
    fullName?: string
    role: UserRole
  }
}

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])

  return isMobile
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      {isMobile && (
        <>
          {/* Backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Header */}
          <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-40 flex items-center px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1 text-center">
              <span className="font-semibold text-gray-900">Kontrakan App</span>
            </div>
            {/* Mobile user menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 -mr-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {user.fullName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </span>
                </div>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.fullName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Pengaturan
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </form>
                </div>
              )}
            </div>
          </header>

          {/* Mobile Sidebar Overlay */}
          <aside
            className={cn(
              'fixed top-0 left-0 bottom-0 w-64 bg-white z-50 transform transition-transform duration-200 ease-in-out',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <span className="font-semibold text-gray-900">Menu</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto py-4">
              <SidebarNav onLinkClick={() => setSidebarOpen(false)} />
            </div>
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-white border-r">
          <div className="flex items-center h-16 px-6 border-b">
            <span className="text-xl font-bold text-gray-900">Kontrakan App</span>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <SidebarNav />
          </div>
          {/* User section at bottom */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary-700">
                  {user.fullName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen',
          isMobile ? 'pt-16' : 'lg:pl-64'
        )}
      >
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
