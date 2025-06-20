import { createSupabaseServerClient } from "@/lib/supabaseClient";
import ExaminationDetailClient from "@/components/ExaminationDetailClient";
import { clinicDetect } from "@/lib/clinicDetect";

export default async function ExaminationDetailPage({
  params,
}: {
  params: Promise<{ patientId: string; oralFunctionAssessmentId: string }>;
}) {
  const { patientId, oralFunctionAssessmentId } = await params;
  const supabase = await createSupabaseServerClient();
  const { clinic_id } = await clinicDetect();
  const { data: exam, error } = await supabase
    .from("oral_function_exam")
    .select("*")
    .eq("id", oralFunctionAssessmentId)
    .single();

  // 患者情報も取得
  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .select("*")
    .eq("clinic_id", clinic_id)
    .eq("id", patientId)
    .single();

  if (error || !exam || patientError || !patient) {
    // Next.js 15推奨: notFound()で404ページへ
    const { notFound } = await import("next/navigation");
    notFound();
    return null;
  }

  return <ExaminationDetailClient exam={exam} patient={patient} />;
}
