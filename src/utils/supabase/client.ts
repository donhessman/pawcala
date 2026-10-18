import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Only used for Realtime broadcast/presence; there is no database or auth usage.
export const createClient = () =>
  createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
