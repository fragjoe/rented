import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/dashboard-shell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile — wrap in try-catch to avoid crashing the layout
  let profile = null
  try {
    const { data } = await supabase
      .from('users')
      .select('full_name, role')
      .eq('id', user.id)
      .maybeSingle()
    profile = data
  } catch (err) {
    console.error('Failed to fetch profile:', err)
  }

  return (
    <DashboardShell
      user={{
        id: user.id,
        email: user.email || '',
        fullName: profile?.full_name,
        role: profile?.role || 'staff',
      }}
    >
      {children}
    </DashboardShell>
  )
}
