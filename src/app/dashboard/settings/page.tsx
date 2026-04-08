import type { Metadata } from 'next'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Card } from '@/components/ui/card'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { Settings } from 'lucide-react'

export const metadata: Metadata = { title: 'Pengaturan' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <PageTemplate title="Pengaturan" description="Pengaturan akun dan aplikasi" breadcrumbs={[{ label: 'Pengaturan' }]}>
      <div className="max-w-2xl space-y-6">
        <Card title="Profil Akun">
          <div className="space-y-4">
            <Input label="Email" value={user?.email || ''} disabled />
            <Input label="Nama Lengkap" defaultValue={profile?.full_name || ''} />
            <Input label="Telepon" defaultValue={profile?.phone || ''} />
            <div className="flex items-center gap-3 pt-2">
              <Button>Simpan</Button>
            </div>
          </div>
        </Card>

        <Card title="Keamanan">
          <p className="text-sm text-gray-500 mb-4">
            Untuk mengubah password, silakan gunakan fitur reset password di halaman login.
          </p>
        </Card>
      </div>
    </PageTemplate>
  )
}
