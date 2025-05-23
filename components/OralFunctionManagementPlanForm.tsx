"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "../lib/utils";

const items = [
  { name: "hygiene", label: "1. 口腔内の衛生" },
  { name: "dryness", label: "2. 口腔内の乾燥" },
  { name: "biting", label: "3. 咬む力" },
  { name: "lipMovement", label: "4. 口唇の動き" },
  { name: "tongueTipMovement", label: "5. 舌尖の動き" },
  { name: "backTongueMovement", label: "6. 奥舌の動き" },
  { name: "tonguePower", label: "7. 舌の力" },
  { name: "chewing", label: "8. 咀嚼の機能" },
  { name: "swallowing", label: "9. 嚥下の機能" },
];

const radioOptions = [
  { value: "問題なし", label: "問題なし" },
  { value: "機能維持を目指す", label: "機能維持を目指す" },
  { value: "機能向上を目指す", label: "機能向上を目指す" },
];

export default function OralFunctionManagementPlanForm() {
  const [form, setForm] = useState<{
    // 口腔機能管理計画
    hygiene: string;
    dryness: string;
    biting: string;
    lipMovement: string;
    tongueTipMovement: string;
    backTongueMovement: string;
    tonguePower: string;
    chewing: string;
    swallowing: string;
    // 全身の状態
    basicDiseaseList: string[];
    basicDiseaseOtherChecked: boolean;
    basicDiseaseOther: string;
    medicationSelect: string;
    medicationDetail: string;
    pneumoniaHistory: string;
    bmiStatus: string;
    weight: string;
    height: string;
    bmi: string;
    weightChange: string;
    weightChangePeriod: number;
    weightChangeAmount: number;
    weightChangeDirection: string;
    foodForm: string;
    foodFormOtherText: string;
    appetite: string;
    appetiteReason: string;
    // 追加情報
    oralStatus: string;
    managementGoal: string;
    reevaluationPeriod: number;
  }>({
    // 口腔機能管理計画
    hygiene: "問題なし",
    dryness: "問題なし",
    biting: "問題なし",
    lipMovement: "問題なし",
    tongueTipMovement: "問題なし",
    backTongueMovement: "問題なし",
    tonguePower: "問題なし",
    chewing: "問題なし",
    swallowing: "問題なし",
    // 全身の状態
    basicDiseaseList: [],
    basicDiseaseOtherChecked: false,
    basicDiseaseOther: "",
    medicationSelect: "なし",
    medicationDetail: "",
    pneumoniaHistory: "なし",
    bmiStatus: "正常範囲内",
    weight: "",
    height: "",
    bmi: "",
    weightChange: "なし",
    weightChangePeriod: 3,
    weightChangeAmount: 0,
    weightChangeDirection: "増",
    foodForm: "常食",
    foodFormOtherText: "",
    appetite: "あり",
    appetiteReason: "",
    // 追加情報
    oralStatus: "",
    managementGoal: "",
    reevaluationPeriod: 3,
  });

  const router = useRouter();
  const params = useParams();
  console.log("useParams() in OralFunctionManagementPlanForm:", params);
  const patientId = params?.patientId ?? "unknown";
  const oralFunctionAssessmentId = params?.oralFunctionAssessmentId ?? "unknown";

  // localStorage保存
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `oralFunctionManagementPlan_${oralFunctionAssessmentId}`,
        JSON.stringify(form)
      );
    }
  }, [form, oralFunctionAssessmentId]);

  const handleRadioChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
  };

  // submit/戻るハンドラ
  const handleBack = () => {
    router.push(`/patients/${patientId}/examinations/oral-function-assessment/${oralFunctionAssessmentId}`);
  };
  const handleGenerate = () => {
    // localStorage保存はuseEffectで自動
    router.push(`/patients/${patientId}/examinations/oral-function-assessment/${oralFunctionAssessmentId}/management-plan-edit/print`);
  };

  return (
    <Card className="mt-8 p-6">
      <h3 className="text-lg font-bold mb-4">全身の状態</h3>
      <div className="space-y-4 mb-8">
        {/* 基礎疾患 */}
        <div>
          <Label className="block font-medium mb-2">基礎疾患</Label>
          <div className="flex flex-wrap gap-4">
            {["心疾患", "肝炎", "糖尿病", "高血圧症", "脳血管疾患"].map((disease) => (
              <label key={disease} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={form.basicDiseaseList?.includes(disease) || false}
                  onChange={(e) => {
                    setForm((prev) => {
                      const list = prev.basicDiseaseList || [];
                      return {
                        ...prev,
                        basicDiseaseList: e.target.checked
                          ? [...list, disease]
                          : list.filter((item) => item !== disease),
                      };
                    });
                  }}
                />
                {disease}
              </label>
            ))}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={!!form.basicDiseaseOtherChecked}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    basicDiseaseOtherChecked: e.target.checked,
                    basicDiseaseOther: e.target.checked ? prev.basicDiseaseOther : "",
                  }));
                }}
              />
              その他
              <input
                type="text"
                className="ml-2 border rounded px-2 py-1"
                placeholder="詳細"
                value={form.basicDiseaseOther || ""}
                disabled={!form.basicDiseaseOtherChecked}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    basicDiseaseOther: e.target.value,
                  }))
                }
              />
            </label>
          </div>
        </div>
        {/* 服用薬剤 */}
        <div>
          <Label htmlFor="medication" className="block font-medium mb-2">服用薬剤</Label>
          <select
            id="medication"
            name="medication"
            className="border rounded px-2 py-1"
            value={form.medicationSelect || "なし"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                medicationSelect: e.target.value,
              }))
            }
          >
            <option value="なし">なし</option>
            <option value="あり">あり</option>
          </select>
        </div>
        {form.medicationSelect === "あり" && (
          <div>
            <Label htmlFor="medicationDetail" className="block font-medium mb-2">薬剤名</Label>
            <input
              type="text"
              id="medicationDetail"
              className="border rounded px-2 py-1 w-64"
              placeholder="服用中の薬剤名"
              value={form.medicationDetail || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  medicationDetail: e.target.value,
                }))
              }
            />
          </div>
        )}
        {/* 肺炎の既往 */}
        <div>
          <Label htmlFor="pneumoniaHistory" className="block font-medium mb-2">肺炎の既往</Label>
          <select
            id="pneumoniaHistory"
            className="border rounded px-2 py-1"
            value={form.pneumoniaHistory || "なし"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                pneumoniaHistory: e.target.value,
              }))
            }
          >
            <option value="なし">なし</option>
            <option value="あり">あり</option>
            <option value="繰り返しあり">繰り返しあり</option>
          </select>
        </div>
        {/* 栄養状態（BMI） */}
        <div>
          <Label htmlFor="bmiStatus" className="block font-medium mb-2">栄養状態 (BMI)</Label>
          <select
            id="bmiStatus"
            className="border rounded px-2 py-1"
            value={form.bmiStatus || "正常範囲内"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                bmiStatus: e.target.value,
              }))
            }
          >
            <option value="正常範囲内">正常範囲内</option>
            <option value="低体重（やせ）">低体重（やせ）</option>
            <option value="肥満">肥満</option>
          </select>
          <div className="flex gap-4 mt-2">
            <div>
              <Label htmlFor="weight">体重 (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={form.weight}
                onChange={handleInputChange}
                className="mt-1 w-24"
              />
            </div>
            <div>
              <Label htmlFor="height">身長 (m)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                value={form.height}
                onChange={handleInputChange}
                className="mt-1 w-24"
              />
            </div>
            <div>
              <Label htmlFor="bmi">BMI</Label>
              <Input
                id="bmi"
                name="bmi"
                type="number"
                value={form.bmi}
                onChange={handleInputChange}
                className="mt-1 w-24"
              />
            </div>
          </div>
        </div>
        {/* 体重の変化 */}
        <div>
          <Label htmlFor="weightChange" className="block font-medium mb-2">体重の変化</Label>
          <select
            id="weightChange"
            className="border rounded px-2 py-1"
            value={form.weightChange || "なし"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                weightChange: e.target.value,
              }))
            }
          >
            <option value="なし">なし</option>
            <option value="あり">あり</option>
          </select>
        </div>
        {form.weightChange === "あり" && (
          <div className="flex gap-4 mt-2">
            <div>
              <Label htmlFor="weightChangePeriod" className="block font-medium mb-1">期間 (ヶ月)</Label>
              <input
                type="number"
                id="weightChangePeriod"
                min="1"
                value={form.weightChangePeriod || 3}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    weightChangePeriod: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className="border rounded px-2 py-1 w-20"
              />
            </div>
            <div>
              <Label htmlFor="weightChangeAmount" className="block font-medium mb-1">変化量 (kg)</Label>
              <input
                type="number"
                id="weightChangeAmount"
                step="0.1"
                value={form.weightChangeAmount || 0}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    weightChangeAmount: parseFloat(e.target.value) || 0,
                  }))
                }
                className="border rounded px-2 py-1 w-20"
              />
              <select
                id="weightChangeDirection"
                className="border rounded px-2 py-1 ml-2"
                value={form.weightChangeDirection || "増"}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    weightChangeDirection: e.target.value,
                  }))
                }
              >
                <option value="増">増加</option>
                <option value="減">減少</option>
              </select>
            </div>
          </div>
        )}
        {/* 食事形態 */}
        <div>
          <Label htmlFor="foodForm" className="block font-medium mb-2">食事形態</Label>
          <select
            id="foodForm"
            className="border rounded px-2 py-1"
            value={form.foodForm || "常食"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                foodForm: e.target.value,
              }))
            }
          >
            <option value="常食">常食</option>
            <option value="やわらかい食事">やわらかい食事</option>
            <option value="その他">その他</option>
          </select>
          {form.foodForm === "その他" && (
            <input
              type="text"
              id="foodFormOtherText"
              className="ml-2 border rounded px-2 py-1"
              placeholder="詳細"
              value={form.foodFormOtherText || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  foodFormOtherText: e.target.value,
                }))
              }
            />
          )}
        </div>
        {/* 食欲 */}
        <div>
          <Label htmlFor="appetite" className="block font-medium mb-2">食欲</Label>
          <select
            id="appetite"
            className="border rounded px-2 py-1"
            value={form.appetite || "あり"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                appetite: e.target.value,
              }))
            }
          >
            <option value="あり">あり</option>
            <option value="なし">なし</option>
          </select>
          {form.appetite === "なし" && (
            <input
              type="text"
              id="appetiteReason"
              className="ml-2 border rounded px-2 py-1"
              placeholder="食欲がない理由"
              value={form.appetiteReason || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  appetiteReason: e.target.value,
                }))
              }
            />
          )}
        </div>
      </div>

      <h3 className="text-lg font-bold mb-4">口腔機能管理計画</h3>
      <div className="space-y-6">
        {items.map((item) => (
          <div className="flex flex-col gap-2" key={item.name}>
            <Label className="font-medium">{item.label}</Label>
            <RadioGroup
              name={item.name}
              value={form[item.name as keyof typeof form] as string}
              onValueChange={(value) => handleRadioChange(item.name, value)}
              className="flex flex-row gap-6"
            >
              {radioOptions.map((opt) => (
                <RadioGroupItem
                  key={opt.value}
                  value={opt.value}
                  id={`${item.name}-${opt.value}`}
                  className="mr-2"
                >
                  {opt.label}
                </RadioGroupItem>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">追加情報</h3>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="oralStatus">口腔内・義歯の状態:</Label>
            <Textarea
              id="oralStatus"
              name="oralStatus"
              rows={2}
              placeholder="口腔内および義歯の状態について記載"
              value={form.oralStatus}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="managementGoal">管理方針・目標（ゴール）・治療予定等:</Label>
            <Textarea
              id="managementGoal"
              name="managementGoal"
              rows={3}
              placeholder="管理方針や目標、治療予定などを記載"
              value={form.managementGoal}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="reevaluationPeriod">再評価の時期（ヶ月後）:</Label>
            <Input
              id="reevaluationPeriod"
              name="reevaluationPeriod"
              type="number"
              min={1}
              max={12}
              value={form.reevaluationPeriod}
              onChange={handleNumberChange}
              className="mt-1 w-32"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end mt-8">
        <Button variant="secondary" onClick={handleBack} id="backToResultsButton">
          診断結果に戻る
        </Button>
        <Button onClick={handleGenerate} id="generatePlanButton">
          管理計画書を生成
        </Button>
      </div>
    </Card>
  );
}
