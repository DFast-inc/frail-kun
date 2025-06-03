"use client";

import type React from "react";
import OralHygieneSection from "@/components/oral-function-assessment/OralHygieneSection";
import OralDrynessSection from "@/components/oral-function-assessment/OralDrynessSection";
import OralBitingForceSection from "@/components/oral-function-assessment/OralBitingForceSection";
import TongueMovementSection from "@/components/oral-function-assessment/TongueMovementSection";
import TonguePressureSection from "@/components/oral-function-assessment/TonguePressureSection";
import ChewingFunctionSection from "@/components/oral-function-assessment/ChewingFunctionSection";
import SwallowingFunctionSection from "@/components/oral-function-assessment/SwallowingFunctionSection";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  updateOralFunctionExam,
  fetchOralFunctionExam,
  fetchPatientData,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

export default function EditExaminationPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = Array.isArray(params?.patientId)
    ? params.patientId[0]
    : params?.patientId || "";
  const oralFunctionAssessmentId = Array.isArray(
    params?.oralFunctionAssessmentId
  )
    ? params.oralFunctionAssessmentId[0]
    : params?.oralFunctionAssessmentId || "";

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [openSheet, setOpenSheet] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await fetchOralFunctionExam(oralFunctionAssessmentId);
      if (result.error || !result.data) {
        toast({
          title: "データ取得エラー",
          description: "検査データの取得に失敗しました",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      const data = result.data;
      const patientResult = await fetchPatientData(data.patient_id);
      let patient =
        patientResult && !patientResult.error ? patientResult.data : null;

      setPatientData(
        patient
          ? {
              id: patient.id,
              name: patient.name || `患者ID: ${patient.id}の患者`,
              age: patient.birthday
                ? new Date().getFullYear() -
                  new Date(patient.birthday).getFullYear()
                : "",
              gender:
                patient.gender === "male"
                  ? "男性"
                  : patient.gender === "female"
                  ? "女性"
                  : patient.gender || "",
            }
          : {
              id: patientId,
              name: `患者ID: ${patientId}の患者`,
              age: "",
              gender: "",
            }
      );

      setFormData({
        oralHygiene: {
          tongueFrontLeft: String(data.tongue_front_left ?? "0"),
          tongueFrontCenter: String(data.tongue_front_center ?? "0"),
          tongueFrontRight: String(data.tongue_front_right ?? "0"),
          tongueMiddleLeft: String(data.tongue_middle_left ?? "0"),
          tongueMiddleCenter: String(data.tongue_middle_center ?? "0"),
          tongueMiddleRight: String(data.tongue_middle_right ?? "0"),
          tongueBackLeft: String(data.tongue_back_left ?? "0"),
          tongueBackCenter: String(data.tongue_back_center ?? "0"),
          tongueBackRight: String(data.tongue_back_right ?? "0"),
          plaqueControl: data.plaque_control ?? "",
          notes: data.oral_hygiene_notes ?? "",
        },
        oralDryness: {
          evaluationMethod: data.oral_dryness_method ?? "method1",
          mucusValue:
            data.mucus_value !== null && data.mucus_value !== undefined
              ? String(data.mucus_value)
              : "",
          gauzeWeight:
            data.gauze_weight !== null && data.gauze_weight !== undefined
              ? String(data.gauze_weight)
              : "",
          notes: data.oral_dryness_notes ?? "",
        },
        bitingForce: {
          evaluationMethod: data.biting_force_method ?? "method1",
          pressureScaleType: data.pressure_scale_type ?? "pressScale2",
          useFilter: data.use_filter ?? "noFilter",
          occlusionForce:
            data.occlusion_force !== null && data.occlusion_force !== undefined
              ? String(data.occlusion_force)
              : "",
          remainingTeeth:
            data.remaining_teeth !== null && data.remaining_teeth !== undefined
              ? String(data.remaining_teeth)
              : "",
          notes: data.biting_force_notes ?? "",
        },
        tongueMovement: {
          paSound:
            data.pa_sound !== null && data.pa_sound !== undefined
              ? String(data.pa_sound)
              : "",
          taSound:
            data.ta_sound !== null && data.ta_sound !== undefined
              ? String(data.ta_sound)
              : "",
          kaSound:
            data.ka_sound !== null && data.ka_sound !== undefined
              ? String(data.ka_sound)
              : "",
          notes: data.tongue_movement_notes ?? "",
        },
        tonguePressure: {
          value:
            data.tongue_pressure_value !== null &&
            data.tongue_pressure_value !== undefined
              ? String(data.tongue_pressure_value)
              : "",
          notes: data.tongue_pressure_notes ?? "",
        },
        chewingFunction: {
          evaluationMethod: data.chewing_function_method ?? "method1",
          glucoseConcentration:
            data.glucose_concentration !== null &&
            data.glucose_concentration !== undefined
              ? String(data.glucose_concentration)
              : "",
          masticatoryScore:
            data.masticatory_score !== null &&
            data.masticatory_score !== undefined
              ? String(data.masticatory_score)
              : "",
          notes: data.chewing_function_notes ?? "",
        },
        swallowingFunction: {
          evaluationMethod: data.swallowing_function_method ?? "eat10",
          eat10Score:
            data.eat10_score !== null && data.eat10_score !== undefined
              ? String(data.eat10_score)
              : "",
          seireiScore:
            data.seirei_score !== null && data.seirei_score !== undefined
              ? String(data.seirei_score)
              : "",
          notes: data.swallowing_function_notes ?? "",
        },
      });
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oralFunctionAssessmentId]);

  const handleChange = (category: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field as string]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateOralFunctionExam(
      formData,
      oralFunctionAssessmentId
    );
    setLoading(false);
    if (result.error) {
      toast({
        title: "保存エラー",
        description: "Supabaseへの保存に失敗しました",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "検査記録を更新しました",
      description: `${
        patientData?.name || ""
      }さんの検査データがSupabaseに保存されました`,
    });

    router.push(
      `/patients/${patientId}/examinations/oral-function-assessment/${oralFunctionAssessmentId}`
    );
  };

  if (loading || !formData) {
    return <div className="p-8 text-xl">データを読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">口腔機能低下症検査（編集）</h1>
          <p className="text-xl text-muted-foreground mt-2">
            患者: {patientData?.name} ({patientData?.age}歳・
            {patientData?.gender})
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => router.push(`/patients/${patientId}`)}
            variant="outline"
            size="lg"
            className="text-lg py-6 px-6"
          >
            患者詳細に戻る
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="oralHygiene" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-4">
            <TabsTrigger value="oralHygiene">口腔衛生状態</TabsTrigger>
            <TabsTrigger value="oralDryness">口腔乾燥</TabsTrigger>
            <TabsTrigger value="bitingForce">咬合力</TabsTrigger>
            <TabsTrigger value="tongueMovement">舌口唇運動</TabsTrigger>
            <TabsTrigger value="tonguePressure">舌圧</TabsTrigger>
            <TabsTrigger value="chewingFunction">咀嚼機能</TabsTrigger>
            <TabsTrigger value="swallowingFunction">嚥下機能</TabsTrigger>
          </TabsList>

          <TabsContent value="oralHygiene">
            <OralHygieneSection
              value={formData.oralHygiene}
              onChange={(
                field: keyof typeof formData.oralHygiene,
                value: string
              ) => handleChange("oralHygiene", field, value)}
              openSheet={openSheet}
              setOpenSheet={setOpenSheet}
            />
          </TabsContent>
          <TabsContent value="oralDryness">
            <OralDrynessSection
              value={formData.oralDryness}
              onChange={(
                field: keyof typeof formData.oralDryness,
                value: string
              ) => handleChange("oralDryness", field, value)}
              openSheet={openSheet}
              setOpenSheet={setOpenSheet}
            />
          </TabsContent>
          <TabsContent value="bitingForce">
            <OralBitingForceSection
              value={formData.bitingForce}
              onChange={(
                field: keyof typeof formData.bitingForce,
                value: string
              ) => handleChange("bitingForce", field, value)}
              openSheet={openSheet}
              setOpenSheet={setOpenSheet}
            />
          </TabsContent>
          <TabsContent value="tongueMovement">
            <TongueMovementSection
              value={formData.tongueMovement}
              onChange={(
                field: keyof typeof formData.tongueMovement,
                value: string
              ) => handleChange("tongueMovement", field, value)}
              openSheet={openSheet}
              setOpenSheet={setOpenSheet}
            />
          </TabsContent>
          <TabsContent value="tonguePressure">
            <TonguePressureSection
              value={formData.tonguePressure}
              onChange={(
                field: keyof typeof formData.tonguePressure,
                value: string
              ) => handleChange("tonguePressure", field, value)}
              openSheet={openSheet}
              setOpenSheet={setOpenSheet}
            />
          </TabsContent>
          <TabsContent value="chewingFunction">
            <ChewingFunctionSection
              value={formData.chewingFunction}
              onChange={(
                field: keyof typeof formData.chewingFunction,
                value: string
              ) => handleChange("chewingFunction", field, value)}
              openSheet={openSheet}
              setOpenSheet={setOpenSheet}
            />
          </TabsContent>
          <TabsContent value="swallowingFunction">
            <SwallowingFunctionSection
              value={formData.swallowingFunction}
              onChange={(
                field: keyof typeof formData.swallowingFunction,
                value: string
              ) => handleChange("swallowingFunction", field, value)}
              openSheet={openSheet}
              setOpenSheet={setOpenSheet}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end gap-4">
          <Button
            type="submit"
            size="lg"
            className="text-lg py-6 px-12"
            disabled={loading}
          >
            {loading ? (
              <>
                記録中...
                <svg
                  className="animate-spin ml-2 h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </>
            ) : (
              "更新する"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
