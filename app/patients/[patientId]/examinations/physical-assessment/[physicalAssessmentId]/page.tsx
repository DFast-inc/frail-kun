import { createSupabaseServerClient } from "@/lib/supabaseClient";
import PhysicalAssessmentDetailClient from "@/components/PhysicalAssessmentDetailClient";
import { clinicDetect } from "@/lib/clinicDetect";

export default async function PhysicalAssessmentDetailPage({
  params,
}: {
  params: Promise<{ patientId: string; physicalAssessmentId: string }>;
}) {
  const { patientId, physicalAssessmentId } = await params;
  const supabase = await createSupabaseServerClient();
  const { clinic_id } = await clinicDetect();

  const { data: exam, error } = await supabase
    .from("physical_assessment")
    .select("*")
    .eq("id", physicalAssessmentId)
    .single();

  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .select("*")
    .eq("clinic_id", clinic_id)
    .eq("id", patientId)
    .single();

  if (error || !exam || patientError || !patient) {
    const { notFound } = await import("next/navigation");
    notFound();
    return null;
  }

  return <PhysicalAssessmentDetailClient exam={exam} patient={patient} />;
}
