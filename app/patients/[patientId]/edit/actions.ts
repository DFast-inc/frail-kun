"use server";

import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { PatientFormData } from "@/components/PatientForm";

export async function updatePatient(patientId: string, data: PatientFormData) {
  const supabase = createSupabaseServerClient();

  // clinic_idは本番では必須。ここではnullで仮置き（必要に応じて患者情報取得・clinic_id付与を追加）
  const clinic_id = null;

  const { error } = await supabase
    .from("patients")
    .update({
      name: data.name,
      birthday: data.birthday,
      gender: data.gender,
      address: data.address,
      phone: data.phone,
      email: data.email,
      notes: data.notes,
      karte_no: data.karte_no ? Number(data.karte_no) : null,
      clinic_id,
      // ageカラム送信は廃止
    })
    .eq("id", patientId);

  return { error };
}
