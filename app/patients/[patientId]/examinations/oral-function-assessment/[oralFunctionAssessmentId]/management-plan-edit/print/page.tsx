import { createSupabaseServerClient } from "@/lib/supabaseClient";
import ManagementPlanEditPrintClient from "./ManagementPlanEditPrintClient";

type PageProps = {
  params: {
    patientId: string;
    oralFunctionAssessmentId: string;
  };
};

export default async function ManagementPlanEditPrintPage({ params }: PageProps) {
  const supabase = createSupabaseServerClient();
          const session = await supabase.auth.getSession()
  const clinic_id = session.data.session?.user.user_metadata.clinic_id;

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
    <ManagementPlanEditPrintClient
      exam={exam ?? null}
      patient={patient ?? null}
      patientId={params.patientId}
      oralFunctionAssessmentId={params.oralFunctionAssessmentId}
    />
  );
}
