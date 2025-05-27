import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// サーバー専用Supabaseクライアント生成
export const createSupabaseServerClient = () => createPagesServerClient({ cookies } as any);
