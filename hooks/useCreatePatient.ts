import { useState } from "react";
import { createSupabaseClient } from "../lib/supabaseClient";

type PatientFormData = {
  name: string;
  birthday: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  notes: string;
  karte_no: string;
};

export function useCreatePatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPatient = async (formData: PatientFormData) => {
    setLoading(true);
    setError(null);
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("patients")
      .insert([
        {
          name: formData.name,
          birthday: formData.birthday ? formData.birthday : null,
          gender: formData.gender,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          notes: formData.notes,
          karte_no: formData.karte_no ? Number(formData.karte_no) : null,
          clinic_id: 1, // テスト用クリニックID
        },
      ])
      .select()
      .single();
    setLoading(false);
    if (error || !data) {
      setError(error ? error.message : "患者登録に失敗しました");
      return null;
    }
    return data;
  };

  return { createPatient, loading, error };
}
