import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  typeof window === "undefined"
    ? process.env.SUPABASE_URL
    : process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  typeof window === "undefined"
    ? process.env.SUPABASE_ANON_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// サーバー/クライアント両対応のSupabaseクライアント生成
export function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("supabaseUrl and supabaseAnonKey are required.");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}
