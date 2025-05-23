import { useState } from "react";
import { createSupabaseClient } from "../lib/supabaseClient";

type PatientFormData = {

  name: string;
  age: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  notes: string;
};

export function useCreatePatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPatient = async (formData: PatientFormData) => {
    setLoading(true);
    setError(null);
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("patients").insert([
      {
        name: formData.name,
        // ageは送信しない
        gender: formData.gender,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes,
        clinic_id: 1, // テスト用クリニックID
      },
    ]);
    setLoading(false);
    if (error) {
      setError(error.message);
      return false;
    }
    return true;
  };

  return { createPatient, loading, error };
}
