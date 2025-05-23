"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import OralFunctionManagementPlanPrint from "@/components/OralFunctionManagementPlanPrint";
import { createSupabaseClient } from "@/lib/supabaseClient";

type Exam = {
  patientName?: string;
  age?: number;
  gender?: string;
  exam_date?: string;
  // 全身の状態
  basicDisease?: string;
  medication?: string;
  pneumoniaHistory?: string;
  weight?: number;
  height?: number;
  bmi?: number;
  bmiStatus?: string;
  weightChange?: string;
  foodForm?: string;
  appetite?: string;
  // 口腔機能の状態
  hygieneValue?: string;
  hygieneStatus?: string;
  drynessValue?: string;
  drynessStandard?: string;
  drynessStatus?: string;
  bitingValue?: string;
  bitingStandard?: string;
  bitingStatus?: string;
  odkPa?: string;
  odkPaStatus?: string;
  odkTa?: string;
  odkTaStatus?: string;
  odkKa?: string;
  odkKaStatus?: string;
  tonguePressure?: string;
  tonguePressureStatus?: string;
  chewingValue?: string;
  chewingStandard?: string;
  chewingStatus?: string;
  swallowingValue?: string;
  swallowingStandard?: string;
  swallowingStatus?: string;
  oralStatus?: string;
};

export default function ExaminationPrintPage({ params }: { params: { id: string } }) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [localPlan, setLocalPlan] = useState<any>(null);

  useEffect(() => {
    async function fetchExam() {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("oral_function_exam")
        .select("*")
        .eq("id", params.id)
        .single();
      if (!error) setExam(data);
      setLoading(false);
    }
    fetchExam();

    // localStorageから全身の状態も含めた値を取得
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(`oralFunctionManagementPlan_${params.id}`);
      if (data) {
        setLocalPlan(JSON.parse(data));
      }
    }
  }, [params.id]);

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>読み込み中...</div>;
  }

  if (!exam) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>検査データが見つかりません</h1>
      </div>
    );
  }

  // localPlanがあればそちらを優先
  const getValue = (key: string) => {
    if (localPlan && localPlan[key] !== undefined && localPlan[key] !== "") {
      return localPlan[key];
    }
    return exam[key as keyof Exam] ?? "";
  };

  return (
    <div>
      <div className="no-print" style={{ marginBottom: "16px" }}>
        <Link href={`/examinations/detail/${params.id}/management-plan-edit`}>
          <button
            type="button"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            style={{ fontWeight: "bold" }}
          >
            戻る
          </button>
        </Link>
      </div>
      <div
        id="printManagementPlan"
        className="management-plan"
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#fff",
          padding: "32px",
          fontFamily: "serif",
          color: "#222",
          border: "1px solid #ccc",
        }}
      >
        <style>{`
          @media print {
            body { background: #fff !important; }
            .no-print { display: none !important; }
          }
          .management-plan-title { font-size: 1.5rem; font-weight: bold; text-align: center; margin-bottom: 1rem; }
          .management-plan-table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
          .management-plan-table th, .management-plan-table td { border: 1px solid #888; padding: 6px 8px; }
          .management-plan-section { margin-top: 2rem; }
        `}</style>
        <div className="management-plan-title">管理計画書</div>
        <table className="management-plan-table">
          <tbody>
            <tr>
              <th>患者氏名</th>
              <td>
                <span id="printPatientName">{exam.patientName ?? ""}</span>
              </td>
              <th>年齢</th>
              <td>
                <span id="printPatientAge">{exam.age ?? ""}</span>歳
              </td>
              <th>性別</th>
              <td>
                <span id="printPatientGender">{exam.gender ?? ""}</span>
              </td>
              <th>日付</th>
              <td>
                <span id="printExamDate">{exam.exam_date ?? ""}</span>
              </td>
            </tr>
          </tbody>
        </table>
        {/* 全身の状態 */}
        <div className="management-plan-section">
          <h3>【全身の状態】</h3>
          <table className="management-plan-table">
            <tbody>
              <tr>
                <th>1. 基礎疾患</th>
                <td>
                  {localPlan
                    ? [
                        ...(localPlan.basicDiseaseList || []),
                        ...(localPlan.basicDiseaseOtherChecked && localPlan.basicDiseaseOther
                          ? [localPlan.basicDiseaseOther]
                          : []),
                      ].join("・") || ""
                    : getValue("basicDisease")}
                </td>
              </tr>
              <tr>
                <th>2. 服用薬剤</th>
                <td>
                  {localPlan
                    ? localPlan.medicationSelect === "あり"
                      ? `あり（${localPlan.medicationDetail || ""}）`
                      : "なし"
                    : getValue("medication")}
                </td>
              </tr>
              <tr>
                <th>3. 肺炎の既往</th>
                <td>{localPlan ? localPlan.pneumoniaHistory : getValue("pneumoniaHistory")}</td>
              </tr>
              <tr>
                <th>4. 栄養状態</th>
                <td>
                  体重：{localPlan ? localPlan.weight : getValue("weight")} Kg， 身長：
                  {localPlan ? localPlan.height : getValue("height")} m
                  <br />
                  体格指数（BMI）：{localPlan ? localPlan.bmi : getValue("bmi")}　
                  {localPlan ? localPlan.bmiStatus : getValue("bmiStatus")}
                </td>
              </tr>
              <tr>
                <th>5. 体重の変化</th>
                <td>
                  {localPlan
                    ? localPlan.weightChange === "あり"
                      ? `あり（${localPlan.weightChangePeriod}ヶ月, ${localPlan.weightChangeAmount}kg, ${localPlan.weightChangeDirection === "増" ? "増加" : "減少"})`
                      : "なし"
                    : getValue("weightChange")}
                </td>
              </tr>
              <tr>
                <th>6. 食事形態</th>
                <td>
                  {localPlan
                    ? localPlan.foodForm === "その他"
                      ? `その他（${localPlan.foodFormOtherText || ""}）`
                      : localPlan.foodForm
                    : getValue("foodForm")}
                </td>
              </tr>
              <tr>
                <th>7. 食欲</th>
                <td>
                  {localPlan
                    ? localPlan.appetite === "なし"
                      ? `なし（${localPlan.appetiteReason || ""}）`
                      : "あり"
                    : getValue("appetite")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 口腔機能の状態 */}
        <div className="management-plan-section">
          <h3>【口腔機能の状態】</h3>
          <table className="management-plan-table">
            <tbody>
              <tr>
                <th>1. 口腔内の衛生状態</th>
                <td>
                  検査結果 {exam.hygieneValue ?? ""}（基準値 2点以下）
                </td>
                <td>
                  {exam.hygieneStatus ?? ""}
                </td>
              </tr>
              <tr>
                <th>2. 口腔内の乾燥程度</th>
                <td>
                  検査結果 {exam.drynessValue ?? ""}（基準値 {exam.drynessStandard ?? ""}）
                </td>
                <td>
                  {exam.drynessStatus ?? ""}
                </td>
              </tr>
              <tr>
                <th>3. 咬む力の程度</th>
                <td>
                  検査結果 {exam.bitingValue ?? ""}（基準値 {exam.bitingStandard ?? ""}）
                </td>
                <td>
                  {exam.bitingStatus ?? ""}
                </td>
              </tr>
              <tr>
                <th>4. 口唇の動きの程度</th>
                <td>
                  パ発音速度 {exam.odkPa ?? ""}回/秒（基準値 6.0回/秒以上）
                </td>
                <td>
                  {exam.odkPaStatus ?? ""}
                </td>
              </tr>
              <tr>
                <th>5. 舌尖の動きの程度</th>
                <td>
                  タ発音速度 {exam.odkTa ?? ""}回/秒（基準値 6.0回/秒以上）
                </td>
                <td>
                  {exam.odkTaStatus ?? ""}
                </td>
              </tr>
              <tr>
                <th>6. 奥舌の動きの程度</th>
                <td>
                  カ発音速度 {exam.odkKa ?? ""}回/秒（基準値 6.0回/秒以上）
                </td>
                <td>
                  {exam.odkKaStatus ?? ""}
                </td>
              </tr>
              <tr>
                <th>7. 舌の力の程度</th>
                <td>
                  舌圧 {exam.tonguePressure ?? ""}kPa（基準値 30kPa以上）
                </td>
                <td>
                  {exam.tonguePressureStatus ?? ""}
                </td>
              </tr>
              <tr>
                <th>8. 咀嚼の機能の程度</th>
                <td>
                  検査結果 {exam.chewingValue ?? ""}（基準値 {exam.chewingStandard ?? ""}）
                </td>
                <td>
                  {exam.chewingStatus ?? ""}
                </td>
              </tr>
              <tr>
                <th>9. 嚥下の機能の程度</th>
                <td>
                  検査結果 {exam.swallowingValue ?? ""}（基準値 {exam.swallowingStandard ?? ""}）
                </td>
                <td>
                  {exam.swallowingStatus ?? ""}
                </td>
              </tr>
              <tr>
                <th>10. 口腔内・義歯の状態</th>
                <td colSpan={2}>
                  {exam.oralStatus ?? ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 管理計画書部分 */}
        <OralFunctionManagementPlanPrint examinationId={params.id} />
      </div>
    </div>
  );
}
