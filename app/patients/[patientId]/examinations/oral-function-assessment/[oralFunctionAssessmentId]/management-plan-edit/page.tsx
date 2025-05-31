import { createSupabaseServerClient } from "@/lib/supabaseClient";
import ManagementPlanEditClient from "./ManagementPlanEditClient";
import { clinicDetect } from "@/lib/clinicDetect";

type PageProps = {
  params: {
    patientId: string;
    oralFunctionAssessmentId: string;
  };
};

export default async function ManagementPlanEditPage({ params }: PageProps) {
  const supabase = await createSupabaseServerClient();
  const { clinic_id } = await clinicDetect();

  // oral_function_examデータ取得
  const { data: exam, error: examError } = await supabase
    .from("oral_function_exam")
    .select("*")
    .eq("id", params.oralFunctionAssessmentId)
    .single();

  // patientsデータ取得
  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .select("*")
    .eq("clinic_id", clinic_id)
    .eq("id", params.patientId)
    .single();

  // エラーハンドリング（必要に応じてUI側で詳細表示も可）
  // ここではnullを渡す

  return (
    <ManagementPlanEditClient
      exam={exam ?? null}
      patient={patient ?? null}
      patientId={params.patientId}
      oralFunctionAssessmentId={params.oralFunctionAssessmentId}
    />
  );
}
