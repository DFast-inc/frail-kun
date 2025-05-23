import { useEffect, useState } from "react";
import { createSupabaseClient } from "../lib/supabaseClient";

type Patient = {
  id: string;
  name: string;
  kana?: string;
  age: number;
  gender: string;
  birthdate?: string;
  phone?: string;
  address?: string;
  medicalHistory?: string;
  medications?: string;
  allergies?: string;
  notes?: string;
};

export function usePatient(id: string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const supabase = createSupabaseClient();
    supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setPatient(null);
        } else {
          setPatient(data as Patient);
        }
        setLoading(false);
      });
  }, [id]);

  return { patient, loading };
}
