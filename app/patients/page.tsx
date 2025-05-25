export const dynamic = 'force-dynamic';

import { createSupabaseClient } from "@/lib/supabaseClient";
import PatientsList from "@/components/PatientsList";

export default async function PatientsPage() {
  const supabase = createSupabaseClient();
  const { data: patients, error } = await supabase.from("patients").select("*");

  // データ整形（lastVisit, statusは仮で空欄。必要に応じてDBスキーマに合わせて修正）
  // 年齢計算関数
  function calcAge(birthday: string | null | undefined): number | null {
    if (!birthday) return null;
    const today = new Date();
    const birth = new Date(birthday);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  const patientsData = (patients ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    age: calcAge(p.birthday),
    gender: p.gender,
    lastVisit: p.lastVisit ?? "",
    status: p.status ?? "",
  }));

  return (
    <PatientsList patients={patientsData} loading={false} />
  );
}
