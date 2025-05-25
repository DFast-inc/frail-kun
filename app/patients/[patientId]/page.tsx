export const dynamic = 'force-dynamic';

import { createSupabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, Edit, Dumbbell, Plus, ArrowLeft, ChevronDown, ChevronUp, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
} from "@/lib/oralFunctionAssessmentJudge";

export default async function PatientDetailPage({ params }: { params: { patientId: string } }) {
  const patientId = await params.patientId;

  // サーバー側で患者データ取得
  const supabase = createSupabaseClient();
  const { data: patientData, error } = await supabase.from("patients").select("*").eq("id", patientId).single();



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

      console.log("患者データ:", oralExams);

  // サンプルデータ形式に変換＋診断名生成
  const examinationData = (oralExams ?? []).map((exam: any) => {
    const data: OralFunctionExamData = {
      oralHygiene: {
        tongueFrontLeft: exam.tongue_front_left !== null && exam.tongue_front_left !== undefined ? Number(exam.tongue_front_left) : undefined,
        tongueFrontCenter: exam.tongue_front_center !== null && exam.tongue_front_center !== undefined ? Number(exam.tongue_front_center) : undefined,
        tongueFrontRight: exam.tongue_front_right !== null && exam.tongue_front_right !== undefined ? Number(exam.tongue_front_right) : undefined,
        tongueMiddleLeft: exam.tongue_middle_left !== null && exam.tongue_middle_left !== undefined ? Number(exam.tongue_middle_left) : undefined,
        tongueMiddleCenter: exam.tongue_middle_center !== null && exam.tongue_middle_center !== undefined ? Number(exam.tongue_middle_center) : undefined,
        tongueMiddleRight: exam.tongue_middle_right !== null && exam.tongue_middle_right !== undefined ? Number(exam.tongue_middle_right) : undefined,
        tongueBackLeft: exam.tongue_back_left !== null && exam.tongue_back_left !== undefined ? Number(exam.tongue_back_left) : undefined,
        tongueBackCenter: exam.tongue_back_center !== null && exam.tongue_back_center !== undefined ? Number(exam.tongue_back_center) : undefined,
        tongueBackRight: exam.tongue_back_right !== null && exam.tongue_back_right !== undefined ? Number(exam.tongue_back_right) : undefined,
      },
      oralDryness: {
        evaluationMethod: exam.oral_dryness_method ?? "method1",
        mucusValue: exam.mucus_value !== null && exam.mucus_value !== undefined ? Number(exam.mucus_value) : undefined,
        gauzeWeight: exam.gauze_weight !== null && exam.gauze_weight !== undefined ? Number(exam.gauze_weight) : undefined,
      },
      bitingForce: {
        evaluationMethod: exam.biting_force_method ?? "method1",
        pressureScaleType: exam.pressure_scale_type ?? "pressScale2",
        useFilter: exam.use_filter ?? "noFilter",
        occlusionForce: exam.occlusion_force !== null && exam.occlusion_force !== undefined ? Number(exam.occlusion_force) : undefined,
        remainingTeeth: exam.remaining_teeth !== null && exam.remaining_teeth !== undefined ? Number(exam.remaining_teeth) : undefined,
      },
      tongueMovement: {
        paSound: exam.pa_sound !== null && exam.pa_sound !== undefined ? Number(exam.pa_sound) : undefined,
        taSound: exam.ta_sound !== null && exam.ta_sound !== undefined ? Number(exam.ta_sound) : undefined,
        kaSound: exam.ka_sound !== null && exam.ka_sound !== undefined ? Number(exam.ka_sound) : undefined,
      },
      tonguePressure: {
        value: exam.tongue_pressure_value !== null && exam.tongue_pressure_value !== undefined ? Number(exam.tongue_pressure_value) : undefined,
      },
      chewingFunction: {
        evaluationMethod: exam.chewing_function_method ?? "method1",
        glucoseConcentration: exam.glucose_concentration !== null && exam.glucose_concentration !== undefined ? Number(exam.glucose_concentration) : undefined,
        masticatoryScore: exam.masticatory_score !== null && exam.masticatory_score !== undefined ? Number(exam.masticatory_score) : undefined,
      },
      swallowingFunction: {
        evaluationMethod: exam.swallowing_function_method ?? "eat10",
        eat10Score: exam.eat10_score !== null && exam.eat10_score !== undefined ? Number(exam.eat10_score) : undefined,
        seireiScore: exam.seirei_score !== null && exam.seirei_score !== undefined ? Number(exam.seirei_score) : undefined,
      },
    };
    console.log("検査データ:", data);
    const scores = [
      judgeOralHygiene(data.oralHygiene) ? 0 : 1,
      judgeOralDryness(data.oralDryness) ? 0 : 1,
      judgeBitingForce(data.bitingForce) ? 0 : 1,
      judgeTongueMovement(data.tongueMovement) ? 0 : 1,
      judgeTonguePressure(data.tonguePressure) ? 0 : 1,
      judgeChewingFunction(data.chewingFunction) ? 0 : 1,
      judgeSwallowingFunction(data.swallowingFunction) ? 0 : 1,
    ];
    const abnormalCount = scores.reduce((a, b) => a + b, 0);
    return {
      id: exam.id,
      date: exam.exam_date,
      diagnosis: `口腔機能低下症（該当項目: ${abnormalCount}/7）`,
      raw: exam,
    };
  });

  // 健康スコア・診断バッジ用ロジック
  let healthScore = 0;
  let healthStatus = "要管理";
  let healthStatusColor = "bg-red-100 text-red-800";
  if (examinationData.length > 0) {
    const exam = examinationData[0].raw;
    const data: OralFunctionExamData = {
      oralHygiene: {
        tongueFrontLeft: exam.tongue_front_left !== null && exam.tongue_front_left !== undefined ? Number(exam.tongue_front_left) : undefined,
        tongueFrontCenter: exam.tongue_front_center !== null && exam.tongue_front_center !== undefined ? Number(exam.tongue_front_center) : undefined,
        tongueFrontRight: exam.tongue_front_right !== null && exam.tongue_front_right !== undefined ? Number(exam.tongue_front_right) : undefined,
        tongueMiddleLeft: exam.tongue_middle_left !== null && exam.tongue_middle_left !== undefined ? Number(exam.tongue_middle_left) : undefined,
        tongueMiddleCenter: exam.tongue_middle_center !== null && exam.tongue_middle_center !== undefined ? Number(exam.tongue_middle_center) : undefined,
        tongueMiddleRight: exam.tongue_middle_right !== null && exam.tongue_middle_right !== undefined ? Number(exam.tongue_middle_right) : undefined,
        tongueBackLeft: exam.tongue_back_left !== null && exam.tongue_back_left !== undefined ? Number(exam.tongue_back_left) : undefined,
        tongueBackCenter: exam.tongue_back_center !== null && exam.tongue_back_center !== undefined ? Number(exam.tongue_back_center) : undefined,
        tongueBackRight: exam.tongue_back_right !== null && exam.tongue_back_right !== undefined ? Number(exam.tongue_back_right) : undefined,
      },
      oralDryness: {
        evaluationMethod: exam.oral_dryness_method ?? "method1",
        mucusValue: exam.mucus_value !== null && exam.mucus_value !== undefined ? Number(exam.mucus_value) : undefined,
        gauzeWeight: exam.gauze_weight !== null && exam.gauze_weight !== undefined ? Number(exam.gauze_weight) : undefined,
      },
      bitingForce: {
        evaluationMethod: exam.biting_force_method ?? "method1",
        pressureScaleType: exam.pressure_scale_type ?? "pressScale2",
        useFilter: exam.use_filter ?? "noFilter",
        occlusionForce: exam.occlusion_force !== null && exam.occlusion_force !== undefined ? Number(exam.occlusion_force) : undefined,
        remainingTeeth: exam.remaining_teeth !== null && exam.remaining_teeth !== undefined ? Number(exam.remaining_teeth) : undefined,
      },
      tongueMovement: {
        paSound: exam.pa_sound !== null && exam.pa_sound !== undefined ? Number(exam.pa_sound) : undefined,
        taSound: exam.ta_sound !== null && exam.ta_sound !== undefined ? Number(exam.ta_sound) : undefined,
        kaSound: exam.ka_sound !== null && exam.ka_sound !== undefined ? Number(exam.ka_sound) : undefined,
      },
      tonguePressure: {
        value: exam.tongue_pressure_value !== null && exam.tongue_pressure_value !== undefined ? Number(exam.tongue_pressure_value) : undefined,
      },
      chewingFunction: {
        evaluationMethod: exam.chewing_function_method ?? "method1",
        glucoseConcentration: exam.glucose_concentration !== null && exam.glucose_concentration !== undefined ? Number(exam.glucose_concentration) : undefined,
        masticatoryScore: exam.masticatory_score !== null && exam.masticatory_score !== undefined ? Number(exam.masticatory_score) : undefined,
      },
      swallowingFunction: {
        evaluationMethod: exam.swallowing_function_method ?? "eat10",
        eat10Score: exam.eat10_score !== null && exam.eat10_score !== undefined ? Number(exam.eat10_score) : undefined,
        seireiScore: exam.seirei_score !== null && exam.seirei_score !== undefined ? Number(exam.seirei_score) : undefined,
      },
    };
    const scores = [
      judgeOralHygiene(data.oralHygiene) ? 0 : 1,
      judgeOralDryness(data.oralDryness) ? 0 : 1,
      judgeBitingForce(data.bitingForce) ? 0 : 1,
      judgeTongueMovement(data.tongueMovement) ? 0 : 1,
      judgeTonguePressure(data.tonguePressure) ? 0 : 1,
      judgeChewingFunction(data.chewingFunction) ? 0 : 1,
      judgeSwallowingFunction(data.swallowingFunction) ? 0 : 1,
    ];
    const abnormalCount = scores.reduce((a, b) => a + b, 0);
    healthScore = Math.round(((7 - abnormalCount) / 7) * 100);
    if (healthScore > 70) {
      healthStatus = "良好";
      healthStatusColor = "bg-green-100 text-green-800";
    } else if (healthScore > 50) {
      healthStatus = "経過観察";
      healthStatusColor = "bg-yellow-100 text-yellow-800";
    } else {
      healthStatus = "要管理";
      healthStatusColor = "bg-red-100 text-red-800";
    }
  }

  // サンプル管理記録データ（実際はAPIから取得）
  const managementData = [
    {
      id: 1,
      date: "2023-04-20",
      interventions: "専門的口腔ケア、舌運動訓練、嚥下リハビリテーション",
      notes: "舌運動訓練の方法を指導。自宅でも毎日実施するよう説明。",
    },
    // ...（省略）
  ];

  // Supabaseから全身機能評価データを取得
  const { data: physicalAssessments, error: physicalAssessmentError } = await supabase
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
    gripStrength: `右: ${a.grip_strength_right ?? "-"} / 左: ${a.grip_strength_left ?? "-"}`,
    walkingSpeed: a.walking_speed,
    frailtyStatus: a.frailty_status,
    // 必要に応じて他のカラムも追加
  }));

  // 展開状態はクライアントで管理するため、"use client"な小コンポーネントに分離するのが理想だが、ここではサーバー側でpropsとして渡す
  // 既存デザイン・UIは一切変更しない

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
                    <span className="text-sm text-gray-500 mr-2">健康スコア:</span>
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
                    <span className="ml-2 text-sm font-medium">{healthScore}/100</span>
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
<Link href={`/patients/${patientId}/examinations/oral-function-assessment/new`}>
  <ClipboardList className="mr-2 h-5 w-5" />
  <span>口腔機能検査</span>
</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
<Link href={`/patients/${patientId}/examinations/physical-assessment/new`}>
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
              <TabsTrigger value="physical" >
                <Dumbbell className="mr-2 h-5 w-5" />
                全身機能評価
              </TabsTrigger>
            </TabsList>
            <TabsContent value="oral">
              {examinationData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-lg">検査日</TableHead>
                      <TableHead className="text-lg">診断</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examinationData.map((exam) => (
<Link href={`/patients/${patientId}/examinations/oral-function-assessment/${exam.id}`} key={exam.id} passHref legacyBehavior>
  <TableRow className="cursor-pointer hover:bg-blue-50">
    <TableCell className="text-lg font-medium">{exam.date}</TableCell>
    <TableCell className="text-lg">{exam.diagnosis}</TableCell>
  </TableRow>
</Link>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg text-muted-foreground">検査記録がありません</p>
<Link href={`/patients/${patientId}/examinations/oral-function-assessment/new`} className="mt-4 inline-block">
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
  <Link href={`/patients/${patientId}/examinations/physical-assessment/${assessment.id}`} key={assessment.id} passHref legacyBehavior>
    <TableRow className="cursor-pointer hover:bg-blue-50">
      <TableCell className="text-lg font-medium">{assessment.date}</TableCell>
      <TableCell className="text-lg">
        {assessment.height}cm / {assessment.weight}kg / BMI: {assessment.bmi}
      </TableCell>
      <TableCell className="text-lg">{assessment.gripStrength}</TableCell>
      <TableCell className="text-lg">{assessment.walkingSpeed} m/秒</TableCell>
      <TableCell className="text-lg">{assessment.frailtyStatus}</TableCell>
    </TableRow>
  </Link>
))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg text-muted-foreground">全身機能評価の記録がありません</p>
<Link href={`/patients/${patientId}/examinations/physical-assessment/new`} className="mt-4 inline-block">
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
    </div>
  );
}
