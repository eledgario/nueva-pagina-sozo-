import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Helper to validate Supabase URL
function isValidSupabaseUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

let client: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isValidSupabaseUrl(supabaseUrl) || !supabaseAnonKey) {
    throw new Error(
      'Supabase no esta configurado. Contacta al administrador.'
    );
  }

  // Reuse existing client if available
  if (client) return client;

  client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return client;
}

// Check if Supabase is configured (for conditional UI)
export function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return isValidSupabaseUrl(supabaseUrl) && !!supabaseAnonKey;
}
