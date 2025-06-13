"use client";

import type React from "react";
import OralHygieneSection from "@/components/oral-function-assessment/OralHygieneSection";
import OralDrynessSection from "@/components/oral-function-assessment/OralDrynessSection";
import OralBitingForceSection from "@/components/oral-function-assessment/OralBitingForceSection";
import TongueMovementSection from "@/components/oral-function-assessment/TongueMovementSection";
import TonguePressureSection from "@/components/oral-function-assessment/TonguePressureSection";
import ChewingFunctionSection from "@/components/oral-function-assessment/ChewingFunctionSection";
import SwallowingFunctionSection from "@/components/oral-function-assessment/SwallowingFunctionSection";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createOralFunctionExam } from "./actions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

export default function NewExaminationPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = Array.isArray(params?.patientId)
    ? params.patientId[0]
    : params?.patientId || "";

  // サンプル患者データ（実際はAPIから取得）
  const patientData = {
    id: patientId,
    name: patientId ? `患者ID: ${patientId}の患者` : "---",
    age: 70, // 仮データ
    gender: "male", // 仮データ
  };

  const [formData, setFormData] = useState({
    oralHygiene: {
      tongueFrontLeft: "0",
      tongueFrontCenter: "0",
      tongueFrontRight: "0",
      tongueMiddleLeft: "0",
      tongueMiddleCenter: "0",
      tongueMiddleRight: "0",
      tongueBackLeft: "0",
      tongueBackCenter: "0",
      tongueBackRight: "0",
      plaqueControl: "",
      notes: "",
    },
    oralDryness: {
      evaluationMethod: "method1",
      mucus1: "",
      mucus2: "",
      mucus3: "",
      mucusValue: "",
      gauzeWeight: "",
      notes: "",
    },
    bitingForce: {
      evaluationMethod: "method1",
      pressureScaleType: "pressScale2",
      useFilter: "noFilter",
      occlusionForce: "",
      remainingTeeth: "",
      notes: "",
    },
    tongueMovement: {
      paSound: "",
      taSound: "",
      kaSound: "",
      notes: "",
    },
    tonguePressure: {
      value: "",
      press1: "",
      press2: "",
      press3: "",
      notes: "",
    },
    chewingFunction: {
      evaluationMethod: "method1",
      glucoseConcentration: "",
      masticatoryScore: "",
      notes: "",
    },
    swallowingFunction: {
      evaluationMethod: "eat10",
      eat10Score: "",
      eat10Answers: Array(10).fill("0"), // 初期値は全て0
      seireiScore: "",
      notes: "",
    },
  });

  const [openSheet, setOpenSheet] = useState<string | null>(null);
  const loading = false;

  const handleChange = (category: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleTemporarySave = () => {
    toast({
      title: "一時保存完了",
      description: `${patientData.name}さんの検査データが一時保存されました`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createOralFunctionExam(formData, patientId);
    if (result.error || !result.id) {
      toast({
        title: "保存エラー",
        description: "Supabaseへの保存に失敗しました",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "検査記録完了",
      description: `${patientData.name}さんの検査データがSupabaseに保存されました`,
    });
    router.push(
      `/patients/${patientId}/examinations/oral-function-assessment/${result.id}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">口腔機能低下症検査</h1>
          <p className="text-xl text-muted-foreground mt-2">
            患者: {patientData.name} ({patientData.age}歳・
            {patientData.gender === "male"
              ? "男性"
              : patientData.gender === "female"
              ? "女性"
              : patientData.gender}
            )
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => router.push(`/patients/${patientData.id}`)}
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
            type="button"
            variant="outline"
            size="lg"
            className="text-lg py-6 px-12"
            onClick={handleTemporarySave}
          >
            一時保存
          </Button>
          <Button type="submit" size="lg" className="text-lg py-6 px-12">
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
              "記録する"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
