export const dynamic = "force-dynamic";

import { createSupabaseServerClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClipboardList,
  Edit,
  Dumbbell,
  Plus,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PatientInfoAccordion from "@/components/PatientInfoAccordion";
import {
  OralFunctionExamData,
  judgeOralHygiene,
  judgeOralDryness,
  judgeBitingForce,
  judgeTongueMovement,
  judgeTonguePressure,
  judgeChewingFunction,
  judgeSwallowingFunction,
  judgeOverall,
  countApplicableItems,
  toOralFunctionExamData,
} from "@/lib/oralFunctionAssessmentJudge";
import ManagementGuidanceRecordSheet from "@/components/ManagementGuidanceRecordSheet";

/**
 * 管理指導記録簿 印刷専用ページ
 * - 既存の枠組みと同じレイアウト
 * - 印刷時に余計なUIが出ないようにする
 */
export default async function ManagementGuidanceRecordPrintPage({
  params,
}: {
  params: { patientId: string };
}) {
  const patientId = await params.patientId;

  // サーバー側で患者データ取得
  const supabase = await createSupabaseServerClient();
  const { data: patientData, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", patientId)
    .single();

  if (error || !patientData) {
    // データが見つからない場合は一覧にリダイレクト
    redirect("/patients");
  }

  // Supabaseから検査データを取得
  const { data: oralExams, error: oralExamError } = await supabase
    .from("oral_function_exam")
    .select("*")
    .eq("patient_id", patientId)
    .order("exam_date", { ascending: false });
  const examinationData = oralExams?.map((exam) => {
    const diagnosis = countApplicableItems(toOralFunctionExamData(exam));
    const diagnosisText =
      diagnosis.abnormalCount > 2
        ? `口腔機能低下症 (${diagnosis.abnormalCount}/7項目)`
        : `正常 (${diagnosis.abnormalCount}/7項目)`;
    return {
      id: exam.id,
      date: exam.exam_date,
      diagnosisText: diagnosisText,
      diagnosis: diagnosis,
      exam,
    };
  });

  const compare = (now: number, before: number) => {
    if (now === before) return 2;
    if (before === 1 && now === 0) return 1;
    if (before === 0 && now === 1) return 3;
    return 2;
  };

  const compareData = examinationData?.map((item, idx, arr) => {
    if (idx === 0) {
      return {
        ...item,
        bitingForce: 2,
        chewingFunction: 2,
        oralDryness: 2,
        oralHygiene: 2,
        swallowingFunction: 2,
        tongueMotor: 2,
        tonguePressure: 2,
      };
    }
    const prev = arr[idx - 1];
    return {
      ...item,
      bitingForce: compare(
        item.diagnosis.bitingForceScore,
        prev.diagnosis.bitingForceScore
      ),
      chewingFunction: compare(
        item.diagnosis.chewingFunctionScore,
        prev.diagnosis.chewingFunctionScore
      ),
      oralDryness: compare(
        item.diagnosis.oralDrynessScore,
        prev.diagnosis.oralDrynessScore
      ),
      oralHygiene: compare(
        item.diagnosis.oralHygieneScore,
        prev.diagnosis.oralHygieneScore
      ),
      swallowingFunction: compare(
        item.diagnosis.swallowingFunctionScore,
        prev.diagnosis.swallowingFunctionScore
      ),
      tongueMotor: compare(
        item.diagnosis.tongueMotorScore,
        prev.diagnosis.tongueMotorScore
      ),
      tonguePressure: compare(
        item.diagnosis.tonguePressureScore,
        prev.diagnosis.tonguePressureScore
      ),
    };
  });

  // Supabaseから全身機能評価データを取得
  const { data: physicalAssessments, error: physicalAssessmentError } =
    await supabase
      .from("physical_assessment")
      .select("*")
      .eq("patient_id", patientId)
      .order("assessment_date", { ascending: false });

  const physicalAssessmentData = (physicalAssessments ?? []).map((a: any) => ({
    id: a.id,
    date: a.assessment_date,
    height: a.height,
    weight: a.weight,
    bmi: a.bmi,
    gripStrength: `右: ${a.grip_strength_right ?? "-"} / 左: ${
      a.grip_strength_left ?? "-"
    }`,
    walkingSpeed: a.walking_speed,
    frailtyStatus: a.frailty_status,
    // 必要に応じて他のカラムも追加
  }));

  // 展開状態はクライアントで管理するため、"use client"な小コンポーネントに分離するのが理想だが、ここではサーバー側でpropsとして渡す
  // 既存デザイン・UIは一切変更しない

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center print:bg-white">
      {/* 印刷用タイトル */}
      <h1 className="text-2xl font-bold mb-6 print:text-black print:mb-4 print:text-center">
        管理指導記録簿
      </h1>
      {/* 枠組み本体 */}
      <div className="w-full max-w-5xl print:max-w-full print:shadow-none print:border-none">
        <ManagementGuidanceRecordSheet compareData={compareData} />
      </div>
    </div>
  );
}
