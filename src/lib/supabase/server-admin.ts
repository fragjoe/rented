import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Service role client for server components — bypasses RLS
// Only used for reads; all writes go through user-authenticated client
export function createServerAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}