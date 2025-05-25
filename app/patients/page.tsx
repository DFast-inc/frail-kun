export const dynamic = 'force-dynamic';

import { createSupabaseClient } from "@/lib/supabaseClient";
import PatientsList from "@/components/PatientsList";
import {
  OralFunctionExamData,
  judgeOralHygiene,
  judgeOralDryness,
  judgeBitingForce,
  judgeTongueMovement,
  judgeTonguePressure,
  judgeChewingFunction,
  judgeSwallowingFunction,
} from "@/lib/oralFunctionAssessmentJudge";

export default async function PatientsPage() {
  const supabase = createSupabaseClient();
  const { data: patients, error } = await supabase.from("patients").select("*");
  const { data: oralExams, error: oralExamError } = await supabase
    .from("oral_function_exam")
    .select("*")
    .order("exam_date", { ascending: false });

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

  // 各患者ごとに最新のoral_function_examを抽出
  const latestExamByPatient: { [patientId: string]: any } = {};
  (oralExams ?? []).forEach((exam: any) => {
    const pid = String(exam.patient_id);
    if (!latestExamByPatient[pid]) {
      latestExamByPatient[pid] = exam;
    }
  });

  const patientsData = (patients ?? []).map((p: any) => {
    const latestExam = latestExamByPatient[String(p.id)];
    let diagnosis = "";
    if (latestExam) {
      const data: OralFunctionExamData = {
        oralHygiene: {
          tongueFrontLeft: latestExam.tongue_front_left !== null && latestExam.tongue_front_left !== undefined ? Number(latestExam.tongue_front_left) : undefined,
          tongueFrontCenter: latestExam.tongue_front_center !== null && latestExam.tongue_front_center !== undefined ? Number(latestExam.tongue_front_center) : undefined,
          tongueFrontRight: latestExam.tongue_front_right !== null && latestExam.tongue_front_right !== undefined ? Number(latestExam.tongue_front_right) : undefined,
          tongueMiddleLeft: latestExam.tongue_middle_left !== null && latestExam.tongue_middle_left !== undefined ? Number(latestExam.tongue_middle_left) : undefined,
          tongueMiddleCenter: latestExam.tongue_middle_center !== null && latestExam.tongue_middle_center !== undefined ? Number(latestExam.tongue_middle_center) : undefined,
          tongueMiddleRight: latestExam.tongue_middle_right !== null && latestExam.tongue_middle_right !== undefined ? Number(latestExam.tongue_middle_right) : undefined,
          tongueBackLeft: latestExam.tongue_back_left !== null && latestExam.tongue_back_left !== undefined ? Number(latestExam.tongue_back_left) : undefined,
          tongueBackCenter: latestExam.tongue_back_center !== null && latestExam.tongue_back_center !== undefined ? Number(latestExam.tongue_back_center) : undefined,
          tongueBackRight: latestExam.tongue_back_right !== null && latestExam.tongue_back_right !== undefined ? Number(latestExam.tongue_back_right) : undefined,
        },
        oralDryness: {
          evaluationMethod: latestExam.oral_dryness_method ?? "method1",
          mucusValue: latestExam.mucus_value !== null && latestExam.mucus_value !== undefined ? Number(latestExam.mucus_value) : undefined,
          gauzeWeight: latestExam.gauze_weight !== null && latestExam.gauze_weight !== undefined ? Number(latestExam.gauze_weight) : undefined,
        },
        bitingForce: {
          evaluationMethod: latestExam.biting_force_method ?? "method1",
          pressureScaleType: latestExam.pressure_scale_type ?? "pressScale2",
          useFilter: latestExam.use_filter ?? "noFilter",
          occlusionForce: latestExam.occlusion_force !== null && latestExam.occlusion_force !== undefined ? Number(latestExam.occlusion_force) : undefined,
          remainingTeeth: latestExam.remaining_teeth !== null && latestExam.remaining_teeth !== undefined ? Number(latestExam.remaining_teeth) : undefined,
        },
        tongueMovement: {
          paSound: latestExam.pa_sound !== null && latestExam.pa_sound !== undefined ? Number(latestExam.pa_sound) : undefined,
          taSound: latestExam.ta_sound !== null && latestExam.ta_sound !== undefined ? Number(latestExam.ta_sound) : undefined,
          kaSound: latestExam.ka_sound !== null && latestExam.ka_sound !== undefined ? Number(latestExam.ka_sound) : undefined,
        },
        tonguePressure: {
          value: latestExam.tongue_pressure_value !== null && latestExam.tongue_pressure_value !== undefined ? Number(latestExam.tongue_pressure_value) : undefined,
        },
        chewingFunction: {
          evaluationMethod: latestExam.chewing_function_method ?? "method1",
          glucoseConcentration: latestExam.glucose_concentration !== null && latestExam.glucose_concentration !== undefined ? Number(latestExam.glucose_concentration) : undefined,
          masticatoryScore: latestExam.masticatory_score !== null && latestExam.masticatory_score !== undefined ? Number(latestExam.masticatory_score) : undefined,
        },
        swallowingFunction: {
          evaluationMethod: latestExam.swallowing_function_method ?? "eat10",
          eat10Score: latestExam.eat10_score !== null && latestExam.eat10_score !== undefined ? Number(latestExam.eat10_score) : undefined,
          seireiScore: latestExam.seirei_score !== null && latestExam.seirei_score !== undefined ? Number(latestExam.seirei_score) : undefined,
        },
      };
      const results = [
        judgeOralHygiene(data.oralHygiene),
        judgeOralDryness(data.oralDryness),
        judgeBitingForce(data.bitingForce),
        judgeTongueMovement(data.tongueMovement),
        judgeTonguePressure(data.tonguePressure),
        judgeChewingFunction(data.chewingFunction),
        judgeSwallowingFunction(data.swallowingFunction),
      ];
      const abnormalCount = results.filter(r => r === false).length;
      const totalCount = results.filter(r => r !== undefined).length;
      diagnosis = `口腔機能低下症（該当項目: ${abnormalCount}/${totalCount}）`;
    }
    return {
      id: p.id,
      karte_no: p.karte_no,
      name: p.name,
      age: calcAge(p.birthday),
      gender: p.gender,
      lastVisit: p.lastVisit ?? "",
      status: p.status ?? "",
      diagnosis,
    };
  });

  return (
    <PatientsList patients={patientsData} loading={false} />
  );
}
