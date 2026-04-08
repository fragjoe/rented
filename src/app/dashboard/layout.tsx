import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServerAdminClient } from '@/lib/supabase/server-admin'
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

  // Use admin client to bypass RLS for profile fetch
  const adminClient = createServerAdminClient()
  let profile = null
  try {
    const { data } = await adminClient
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
