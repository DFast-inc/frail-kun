"use server";

import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { PatientFormData } from "@/components/PatientForm";
import { clinicDetect } from "@/lib/clinicDetect";

export async function updatePatient(patientId: string, data: PatientFormData) {
  const supabase = await createSupabaseServerClient();

  const { clinic_id } = await clinicDetect();

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
