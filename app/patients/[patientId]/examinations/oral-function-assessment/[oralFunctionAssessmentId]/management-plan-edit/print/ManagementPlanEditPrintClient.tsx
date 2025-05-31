"use client";

import Link from "next/link";
import * as React from "react";
import OralFunctionManagementPlanPrint from "@/components/OralFunctionManagementPlanPrint";
import { toResultStruct } from "@/lib/oralFunctionAssessmentJudge";

// 年齢計算ユーティリティ
function calcAge(birthday: string | null | undefined): string {
  if (!birthday) return "-";
  const birth = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age.toString();
}

type Exam = Record<string, any>;
type Patient = Record<string, any>;

type Props = {
  exam: Exam | null;
  patient: Patient | null;
  patientId: string;
  oralFunctionAssessmentId: string;
};

export default function ManagementPlanEditPrintClient({
  exam,
  patient,
  patientId,
  oralFunctionAssessmentId,
}: Props) {
  const [localPlan, setLocalPlan] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(
        `oralFunctionManagementPlan_${oralFunctionAssessmentId}`
      );
      if (data) {
        setLocalPlan(JSON.parse(data));
      }
    }
  }, [oralFunctionAssessmentId]);

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

  // 口腔機能の状態 共通ロジック
  const oralResult = toResultStruct(exam);

  return (
    <div>
      <div className="no-print" style={{ marginBottom: "16px" }}>
        <Link
          href={`/patients/${patientId}/examinations/oral-function-assessment/${oralFunctionAssessmentId}/management-plan-edit`}
        >
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
                <span id="printPatientName">{patient?.name ?? ""}</span>
              </td>
              <th>年齢</th>
              <td>
                <span id="printPatientAge">{calcAge(patient?.birthday)}</span>歳
              </td>
              <th>性別</th>
              <td>
                <span id="printPatientGender">{patient?.gender ?? ""}</span>
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
                        ...(localPlan.basicDiseaseOtherChecked &&
                        localPlan.basicDiseaseOther
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
                <td>
                  {localPlan
                    ? localPlan.pneumoniaHistory
                    : getValue("pneumoniaHistory")}
                </td>
              </tr>
              <tr>
                <th>4. 栄養状態</th>
                <td>
                  体重：{localPlan ? localPlan.weight : getValue("weight")} Kg，
                  身長：
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
                      ? `あり（${localPlan.weightChangePeriod}ヶ月, ${
                          localPlan.weightChangeAmount
                        }kg, ${
                          localPlan.weightChangeDirection === "増"
                            ? "増加"
                            : "減少"
                        })`
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
                  {oralResult.oralHygiene.value.tci}（
                  {oralResult.oralHygiene.normalRange}）
                </td>
                <td>{oralResult.oralHygiene.status}</td>
              </tr>
              <tr>
                <th>2. 口腔内の乾燥程度</th>
                <td>
                  {oralResult.oralDryness.value}（
                  {oralResult.oralDryness.normalRange}）
                </td>
                <td>{oralResult.oralDryness.status}</td>
              </tr>
              <tr>
                <th>3. 咬む力の程度</th>
                <td>
                  {oralResult.bitingForce.value}（
                  {oralResult.bitingForce.normalRange}）
                </td>
                <td>{oralResult.bitingForce.status}</td>
              </tr>
              <tr>
                <th>4. 舌口唇運動機能</th>
                <td>
                  {oralResult.tongueMotor.value}（
                  {oralResult.tongueMotor.normalRange}）
                </td>
                <td>{oralResult.tongueMotor.status}</td>
              </tr>
              <tr>
                <th>5. 舌圧</th>
                <td>
                  {oralResult.tonguePressure.value}（
                  {oralResult.tonguePressure.normalRange}）
                </td>
                <td>{oralResult.tonguePressure.status}</td>
              </tr>
              <tr>
                <th>6. 咀嚼機能</th>
                <td>
                  {oralResult.chewingFunction.value}（
                  {oralResult.chewingFunction.normalRange}）
                </td>
                <td>{oralResult.chewingFunction.status}</td>
              </tr>
              <tr>
                <th>7. 嚥下機能</th>
                <td>
                  {oralResult.swallowingFunction.value}（
                  {oralResult.swallowingFunction.normalRange}）
                </td>
                <td>{oralResult.swallowingFunction.status}</td>
              </tr>
              <tr>
                <th>8. 口腔内・義歯の状態</th>
                <td colSpan={2}>{exam.oralStatus ?? ""}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 管理計画書部分 */}
        <OralFunctionManagementPlanPrint
          examinationId={oralFunctionAssessmentId}
        />
      </div>
    </div>
  );
}
