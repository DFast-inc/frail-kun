import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// サーバー専用Supabaseクライアント生成
export const createSupabaseServerClient = () => createServerComponentClient({ cookies } as any);
