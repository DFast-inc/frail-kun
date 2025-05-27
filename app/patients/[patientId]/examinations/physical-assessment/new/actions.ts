"use server";

import { createSupabaseServerClient } from "@/lib/supabaseClient";

type CreatePhysicalAssessmentInput = {
  patientId: string;
  height: string;
  weight: string;
  bmi: string;
  bodyFatPercentage: string;
  muscleMass: string;
  muscleQualityScore: string;
  notes: string;
};

export async function createPhysicalAssessment(input: CreatePhysicalAssessmentInput) {
  const supabase = createSupabaseServerClient();

  // clinic_idは患者情報から取得するのが理想だが、ここではnullで仮置き（本番は必須）
  // 必要に応じて患者情報取得・clinic_id付与ロジックを追加すること
  const clinic_id = null;

  const { error } = await supabase.from("physical_assessment").insert({
    patient_id: input.patientId,
    clinic_id,
    assessment_date: new Date().toISOString().slice(0, 10),
    height: input.height ? Number(input.height) : null,
    weight: input.weight ? Number(input.weight) : null,
    bmi: input.bmi ? Number(input.bmi) : null,
    body_fat_percentage: input.bodyFatPercentage ? Number(input.bodyFatPercentage) : null,
    muscle_mass: input.muscleMass ? Number(input.muscleMass) : null,
    muscle_quality_score: input.muscleQualityScore ? Number(input.muscleQualityScore) : null,
    basic_notes: input.notes,
  });

  return { error };
}
