import { useEffect, useState } from "react";
import { createSupabaseClient } from "../lib/supabaseClient";

type Patient = {
  id: number;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  status: string;
};

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase
      .from("patients")
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          setPatients([]);
        } else {
          setPatients(data as Patient[]);
        }
        setLoading(false);
      });
  }, []);

  return { patients, loading };
}
