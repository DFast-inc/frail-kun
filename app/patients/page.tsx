export const dynamic = "force-dynamic";

import { createSupabaseServerClient } from "@/lib/supabaseClient";
import PatientsList from "@/components/PatientsList";
import {
  countApplicableItems,
  toOralFunctionExamData,
} from "@/lib/oralFunctionAssessmentJudge";
import { clinicDetect } from "@/lib/clinicDetect";

export default async function PatientsPage() {
  const supabase = await createSupabaseServerClient();

  const { clinic_id } = await clinicDetect();

  const { data: patients, error } = await supabase
    .from("patients")
    .select("*, oral_function_exam(*)")
    .eq("clinic_id", clinic_id)
    .order("exam_date", {
      ascending: false,
      referencedTable: "oral_function_exam",
    });

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
  const patientsData = (patients ?? []).map((p: any) => {
    console.log("患者データ:", p?.oral_function_exam?.[0]);
    const diagnosis = p?.oral_function_exam?.[0]
      ? countApplicableItems(toOralFunctionExamData(p?.oral_function_exam?.[0]))
      : undefined;

    // console.log("診断結果:", diagnosis, [oralExams?.[0]]);
    const diagnosisText =
      diagnosis?.abnormalCount > 2
        ? `口腔機能低下症 (${diagnosis?.abnormalCount}/7項目)`
        : `正常 (${diagnosis?.abnormalCount}/7項目)`;

    return {
      id: p.id,
      karte_no: p.karte_no,
      name: p.name,
      birthday: p.birthday,
      age: calcAge(p.birthday),
      gender: p.gender,
      lastVisit: p.lastVisit ?? "",
      status: p.status ?? "",
      diagnosis: diagnosisText,
    };
  });

  return <PatientsList patients={patientsData} loading={false} />;
}
