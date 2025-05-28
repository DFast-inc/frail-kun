'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabaseClient'

export async function createPatient(formData: FormData) {
  const name = formData.get('name')?.toString().trim() || ''
  const birthday = formData.get('birthday')?.toString() || null
  const gender = formData.get('gender')?.toString() || ''
  const address = formData.get('address')?.toString() || null
  const phone = formData.get('phone')?.toString() || null
  const email = formData.get('email')?.toString() || null
  const notes = formData.get('notes')?.toString() || null
  const karte_no = formData.get('karte_no')?.toString() || null

  // 必須バリデーション
  if (!name || !gender) {
    redirect('/patients/new?error=' + encodeURIComponent('氏名・性別は必須です'))
  }

  // サーバー専用supabaseクライアント
  const supabase = createSupabaseServerClient()

    const session = await supabase.auth.getSession()
  const clinic_id = session.data.session?.user.user_metadata.clinic_id;

  // clinic_idは現状セッションや環境から取得する想定。ここではnullで仮置き
  const { data, error } = await supabase
    .from('patients')
    .insert([
      {
        name,
        birthday,
        gender,
        address,
        phone,
        email,
        notes,
        karte_no,
        clinic_id:clinic_id, // TODO: clinic_idをセッション等から取得してセット
      }
    ])
    .select()
    .single()

  if (error || !data) {
    redirect('/patients/new?error=' + encodeURIComponent(error?.message || '登録に失敗しました'))
  }

  // 成功時は患者詳細→口腔機能新規検査ページへリダイレクト
  redirect(`/patients/${data.id}/examinations/oral-function-assessment/new`)
}
