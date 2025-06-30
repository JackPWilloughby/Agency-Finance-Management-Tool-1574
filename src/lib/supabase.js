import { createClient } from '@supabase/supabase-js'

// Your Supabase project credentials
const SUPABASE_URL = 'https://ngfjxtbwszzwwbbreqvn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nZmp4dGJ3c3p6d3diYnJlcXZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjA0MzQsImV4cCI6MjA2Njg5NjQzNH0.W3z47Psq-5T3FrS6Bz6QEqIEdeqdzKyrEUi-zBvJE_E'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase credentials');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

export default supabase