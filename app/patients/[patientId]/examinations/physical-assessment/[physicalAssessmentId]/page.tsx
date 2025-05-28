import { createSupabaseServerClient } from "@/lib/supabaseClient";
import PhysicalAssessmentDetailClient from "@/components/PhysicalAssessmentDetailClient";

export default async function PhysicalAssessmentDetailPage({ params }: { params: Promise<{ patientId: string; physicalAssessmentId: string }> }) {
  const { patientId, physicalAssessmentId } = await params;
  const supabase = createSupabaseServerClient();
        const session = await supabase.auth.getSession()
  const clinic_id = session.data.session?.user.user_metadata.clinic_id;

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
