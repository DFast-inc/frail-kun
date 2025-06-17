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
import { ClipboardList, Dumbbell, Plus, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PatientInfoAccordion from "@/components/PatientInfoAccordion";
import {
  countApplicableItems,
  toOralFunctionExamData,
} from "@/lib/oralFunctionAssessmentJudge";
import ManagementGuidanceRecordSheet from "@/components/ManagementGuidanceRecordSheet";
import { clinicDetect } from "@/lib/clinicDetect";

export default async function PatientDetailPage({
  params,
}: {
  params: { patientId: string };
}) {
  const { patientId } = await params;

  // サーバー側で患者データ取得
  const supabase = await createSupabaseServerClient();
  const { clinic_id } = await clinicDetect();
  const { data: patientData, error } = await supabase
    .from("patients")
    .select("*")
    .eq("clinic_id", clinic_id)
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
    .order("exam_date", { ascending: true });

  const healthScore = 100; // 仮の健康スコア（実際は計算ロジックが必要）
  let healthStatus = "良好"; // 仮の健康状態
  let healthStatusColor = "bg-green-100 text-green-800"; // 仮の健康状態色

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

  // 展開状態はクライアントで管理するため、"use client"な小コンポーネントに分離するのが理想だが、ここではサーバー側でpropsとして渡す
  // 既存デザイン・UIは一切変更しない

  const physicalAssessmentData = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-start">
          <Link href="/patients">
            <Button variant="ghost" size="sm" className="text-lg px-2">
              <ArrowLeft className="mr-2 h-5 w-5" />
              患者一覧に戻る
            </Button>
          </Link>
        </div>
        <div className="flex justify-between items-start">
          <Card className="border-2 border-gray-200 shadow-sm max-w-md">
            <CardContent className="p-4 flex items-center space-x-4">
              <div>
                <h2 className="text-2xl font-bold">{patientData.name ?? ""}</h2>
                <div className="flex items-center mt-1">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${healthStatusColor}`}
                  >
                    {healthStatus}
                  </span>
                  <div className="ml-3 flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      健康スコア:
                    </span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          healthScore > 70
                            ? "bg-green-500"
                            : healthScore > 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${healthScore}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      {healthScore}/100
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="lg" className="text-lg py-6 px-8">
                <Plus className="mr-2 h-5 w-5" />
                新規検査
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link
                  href={`/patients/${patientId}/examinations/oral-function-assessment/new`}
                >
                  <ClipboardList className="mr-2 h-5 w-5" />
                  <span>口腔機能検査</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/patients/${patientId}/examinations/physical-assessment/new`}
                >
                  <Dumbbell className="mr-2 h-5 w-5" />
                  <span>全身機能検査</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* 患者基本情報 */}
      <PatientInfoAccordion patientData={{ ...patientData, id: patientId }} />
      <Card className="border-2 mt-6">
        <CardHeader className="bg-blue-50 rounded-t-lg">
          <CardTitle className="text-2xl">検査・評価履歴</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="oral" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="oral">
                <ClipboardList className="mr-2 h-5 w-5" />
                口腔機能検査
              </TabsTrigger>
              <TabsTrigger value="physical">
                <Dumbbell className="mr-2 h-5 w-5" />
                全身機能評価
              </TabsTrigger>
            </TabsList>
            <TabsContent value="oral">
              {(examinationData ?? []).length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-lg">検査日</TableHead>
                      <TableHead className="text-lg">診断</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(examinationData ?? []).map((exam) => (
                      <Link
                        href={`/patients/${patientId}/examinations/oral-function-assessment/${exam.id}`}
                        key={exam.id}
                        passHref
                        legacyBehavior
                      >
                        <TableRow className="cursor-pointer hover:bg-blue-50">
                          <TableCell className="text-lg font-medium">
                            {exam.date}
                          </TableCell>
                          <TableCell className="text-lg">
                            {exam.diagnosisText}
                          </TableCell>
                        </TableRow>
                      </Link>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg text-muted-foreground">
                    検査記録がありません
                  </p>
                  <Link
                    href={`/patients/${patientId}/examinations/oral-function-assessment/new`}
                    className="mt-4 inline-block"
                  >
                    <Button size="lg" className="text-lg">
                      <ClipboardList className="mr-2 h-5 w-5" />
                      新規検査を実施
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            <TabsContent value="physical">
              {physicalAssessmentData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-lg">評価日</TableHead>
                      <TableHead className="text-lg">身長/体重/BMI</TableHead>
                      <TableHead className="text-lg">握力</TableHead>
                      <TableHead className="text-lg">歩行速度</TableHead>
                      <TableHead className="text-lg">フレイル状態</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {physicalAssessmentData.map((assessment) => (
                      <Link
                        href={`/patients/${patientId}/examinations/physical-assessment/${assessment.id}`}
                        key={assessment.id}
                        passHref
                        legacyBehavior
                      >
                        <TableRow className="cursor-pointer hover:bg-blue-50">
                          <TableCell className="text-lg font-medium">
                            {assessment.date}
                          </TableCell>
                          <TableCell className="text-lg">
                            {assessment.height}cm / {assessment.weight}kg / BMI:{" "}
                            {assessment.bmi}
                          </TableCell>
                          <TableCell className="text-lg">
                            {assessment.gripStrength}
                          </TableCell>
                          <TableCell className="text-lg">
                            {assessment.walkingSpeed} m/秒
                          </TableCell>
                          <TableCell className="text-lg">
                            {assessment.frailtyStatus}
                          </TableCell>
                        </TableRow>
                      </Link>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg text-muted-foreground">
                    全身機能評価の記録がありません
                  </p>
                  <Link
                    href={`/patients/${patientId}/examinations/physical-assessment/new`}
                    className="mt-4 inline-block"
                  >
                    <Button size="lg" className="text-lg">
                      <Dumbbell className="mr-2 h-5 w-5" />
                      新規評価を実施
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {/* 管理指導記録簿 枠組み */}
      <div className="mt-8">
        <div className="flex justify-end mb-2">
          <Link
            href={`/patients/${patientId}/management-guidance-record/print`}
            passHref
          >
            <Button size="sm" variant="outline">
              印刷ページへ
            </Button>
          </Link>
        </div>
        <ManagementGuidanceRecordSheet compareData={compareData} />
      </div>
    </div>
  );
}
