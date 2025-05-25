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

export function useUpdatePatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePatient = async (id: string, formData: PatientFormData) => {
    setLoading(true);
    setError(null);
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("patients")
      .update({
        name: formData.name,
        birthday: formData.birthday ? formData.birthday : null,
        gender: formData.gender,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes,
        karte_no: formData.karte_no ? Number(formData.karte_no) : null,
        clinic_id: 1, // テスト用クリニックID（必要に応じて修正）
      })
      .eq("id", id);
    setLoading(false);
    if (error) {
      setError(error.message);
      return false;
    }
    return true;
  };

  return { updatePatient, loading, error };
}
