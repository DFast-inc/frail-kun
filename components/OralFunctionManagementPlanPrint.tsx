"use client";

import React, { useEffect, useState } from "react";

type PlanForm = {
  hygiene: string;
  dryness: string;
  biting: string;
  lipMovement: string;
  tongueTipMovement: string;
  backTongueMovement: string;
  tonguePower: string;
  chewing: string;
  swallowing: string;
  oralStatus: string;
  managementGoal: string;
  reevaluationPeriod: number;
};

type Props = {
  examinationId: string;
};

export default function OralFunctionManagementPlanPrint({ examinationId }: Props) {
  const [plan, setPlan] = useState<PlanForm | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(`oralFunctionManagementPlan_${examinationId}`);
      if (data) {
        setPlan(JSON.parse(data));
      }
    }
  }, [examinationId]);

  if (!plan) {
    return <div style={{ color: "red", padding: "1rem" }}>管理計画書データがありません</div>;
  }

  return (
    <div>
      <div className="management-plan-section">
        <h3>【口腔機能管理計画】</h3>
        <table className="management-plan-table">
          <tbody>
            <tr>
              <th>1. 口腔内の衛生</th>
              <td>{plan.hygiene}</td>
            </tr>
            <tr>
              <th>2. 口腔内の乾燥</th>
              <td>{plan.dryness}</td>
            </tr>
            <tr>
              <th>3. 咬む力</th>
              <td>{plan.biting}</td>
            </tr>
            <tr>
              <th>4. 口唇の動き</th>
              <td>{plan.lipMovement}</td>
            </tr>
            <tr>
              <th>5. 舌尖の動き</th>
              <td>{plan.tongueTipMovement}</td>
            </tr>
            <tr>
              <th>6. 奥舌の動き</th>
              <td>{plan.backTongueMovement}</td>
            </tr>
            <tr>
              <th>7. 舌の力</th>
              <td>{plan.tonguePower}</td>
            </tr>
            <tr>
              <th>8. 咀嚼の機能</th>
              <td>{plan.chewing}</td>
            </tr>
            <tr>
              <th>9. 嚥下の機能</th>
              <td>{plan.swallowing}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="management-plan-section">
        <h3>【口腔内・義歯の状態】</h3>
        <p style={{ fontSize: "9pt", margin: "4px 0" }}>{plan.oralStatus}</p>
      </div>

      <div className="management-plan-section">
        <h3>【管理方針・目標（ゴール）・治療予定等】</h3>
        <p style={{ fontSize: "9pt", margin: "4px 0" }}>{plan.managementGoal}</p>
      </div>

      <div className="management-plan-section">
        <h3>【再評価の時期・治療期間】</h3>
        <p style={{ fontSize: "9pt", margin: "4px 0" }}>
          再評価の時期：約（{plan.reevaluationPeriod}）か月後
        </p>
      </div>
    </div>
  );
}
