"use server"

import { createSupabaseServerClient } from "@/lib/supabaseClient";

// oral_function_examテーブルにinsertするServer Action
export async function createOralFunctionExam(formData: any, patientId: string) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("oral_function_exam")
    .insert({
      patient_id: patientId,
      exam_date: new Date().toISOString().slice(0, 10),
      // 口腔衛生状態
      tongue_front_left: Number(formData.oralHygiene.tongueFrontLeft),
      tongue_front_center: Number(formData.oralHygiene.tongueFrontCenter),
      tongue_front_right: Number(formData.oralHygiene.tongueFrontRight),
      tongue_middle_left: Number(formData.oralHygiene.tongueMiddleLeft),
      tongue_middle_center: Number(formData.oralHygiene.tongueMiddleCenter),
      tongue_middle_right: Number(formData.oralHygiene.tongueMiddleRight),
      tongue_back_left: Number(formData.oralHygiene.tongueBackLeft),
      tongue_back_center: Number(formData.oralHygiene.tongueBackCenter),
      tongue_back_right: Number(formData.oralHygiene.tongueBackRight),
      plaque_control: formData.oralHygiene.plaqueControl,
      oral_hygiene_notes: formData.oralHygiene.notes,
      // 口腔乾燥
      oral_dryness_method: formData.oralDryness.evaluationMethod,
      mucus_value: formData.oralDryness.mucusValue ? Number(formData.oralDryness.mucusValue) : null,
      gauze_weight: formData.oralDryness.gauzeWeight ? Number(formData.oralDryness.gauzeWeight) : null,
      oral_dryness_notes: formData.oralDryness.notes,
      // 咬合力
      biting_force_method: formData.bitingForce.evaluationMethod,
      pressure_scale_type: formData.bitingForce.pressureScaleType,
      use_filter: formData.bitingForce.useFilter,
      occlusion_force: formData.bitingForce.occlusionForce ? Number(formData.bitingForce.occlusionForce) : null,
      remaining_teeth: formData.bitingForce.remainingTeeth ? Number(formData.bitingForce.remainingTeeth) : null,
      biting_force_notes: formData.bitingForce.notes,
      // 舌口唇運動
      pa_sound: formData.tongueMovement.paSound ? Number(formData.tongueMovement.paSound) : null,
      ta_sound: formData.tongueMovement.taSound ? Number(formData.tongueMovement.taSound) : null,
      ka_sound: formData.tongueMovement.kaSound ? Number(formData.tongueMovement.kaSound) : null,
      tongue_movement_notes: formData.tongueMovement.notes,
      // 舌圧
      tongue_pressure_value: formData.tonguePressure.value ? Number(formData.tonguePressure.value) : null,
      tongue_pressure_notes: formData.tonguePressure.notes,
      // 咀嚼機能
      chewing_function_method: formData.chewingFunction.evaluationMethod,
      glucose_concentration: formData.chewingFunction.glucoseConcentration ? Number(formData.chewingFunction.glucoseConcentration) : null,
      masticatory_score: formData.chewingFunction.masticatoryScore ? Number(formData.chewingFunction.masticatoryScore) : null,
      chewing_function_notes: formData.chewingFunction.notes,
      // 嚥下機能
      swallowing_function_method: formData.swallowingFunction.evaluationMethod,
      eat10_score: formData.swallowingFunction.eat10Score ? Number(formData.swallowingFunction.eat10Score) : null,
      seirei_score: formData.swallowingFunction.seireiScore ? Number(formData.swallowingFunction.seireiScore) : null,
    })
    .select()
    .single();

    console.log("Oral Function Exam Data:", data,error);

  if (error || !data) {
    return { error: true };
  }
  return { id: data.id };
}
