import { createSupabaseClient } from "@/lib/supabaseClient";
import PatientsList from "@/components/PatientsList";

export default async function HomePage() {
  const supabase = createSupabaseClient();
  const { data: patients, error } = await supabase.from("patients").select("*");

  // データ整形（lastVisit, statusは仮で空欄。必要に応じてDBスキーマに合わせて修正）
  const patientsData = (patients ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    age: p.age,
    gender: p.gender,
    lastVisit: p.lastVisit ?? "",
    status: p.status ?? "",
  }));

  return (
    <PatientsList patients={patientsData} loading={false} />
  );
}
