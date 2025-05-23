import { createSupabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, Edit, Dumbbell, Plus, ArrowLeft, ChevronDown, ChevronUp, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const patientId = params.id;

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

  // サンプルデータ形式に変換
  const examinationData = (oralExams ?? []).map((exam: any) => ({
    id: exam.id,
    date: exam.exam_date,
    // 必要に応じて診断やスコアを計算・整形
    diagnosis: "口腔機能低下症", // TODO: 必要なら診断ロジックを追加
    // scores: {...} // TODO: 必要ならスコア計算
  }));

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
                  {/* TODO: スコア計算ロジック追加予定 */}
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      0 > 70
                        ? "bg-green-100 text-green-800"
                        : 0 > 50
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {/* TODO: スコア計算ロジック追加予定 */}
                    {"要管理"}
                  </span>
                  <div className="ml-3 flex items-center">
                    <span className="text-sm text-gray-500 mr-2">健康スコア:</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          0 > 70
                            ? "bg-green-500"
                            : 0 > 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `0%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">0/100</span>
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
                <Link href={`/examinations/new?patientId=${patientId}`}>
                  <ClipboardList className="mr-2 h-5 w-5" />
                  <span>口腔機能検査</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/physical-assessment/new?patientId=${patientId}`}>
                  <Dumbbell className="mr-2 h-5 w-5" />
                  <span>全身機能検査</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* 患者基本情報 */}
      <Card className="border-2">
        <CardHeader
          className="bg-white rounded-t-lg border-b flex flex-row items-center justify-between cursor-pointer"
        >
          <div className="flex items-center">
            <User className="mr-2 h-5 w-5 text-gray-500" />
            <CardTitle className="text-2xl">患者基本情報</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 transition-all duration-300 ease-in-out">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">氏名</h3>
                <p className="text-xl">{patientData.name ?? ""}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">フリガナ</h3>
                <p className="text-xl">{patientData.kana ?? ""}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">生年月日</h3>
                <p className="text-xl">
                  {patientData.birthdate ? `${patientData.birthdate} (${patientData.age ?? ""}歳)` : ""}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">性別</h3>
                <p className="text-xl">{patientData.gender ?? ""}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">電話番号</h3>
                <p className="text-xl">{patientData.phone ?? ""}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">住所</h3>
                <p className="text-xl">{patientData.address ?? ""}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-muted-foreground">既往歴</h3>
              <p className="text-xl">{patientData.medicalHistory || "なし"}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-muted-foreground">服用中の薬</h3>
              <p className="text-xl">{patientData.medications || "なし"}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-muted-foreground">アレルギー</h3>
              <p className="text-xl">{patientData.allergies || "なし"}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-muted-foreground">備考</h3>
              <p className="text-xl">{patientData.notes || "なし"}</p>
            </div>
          </div>
          <div className="mt-8">
            <Link href={`/patients/${patientId}/edit`}>
              <Button variant="outline" size="lg" className="text-lg py-6 px-6">
                <Edit className="mr-2 h-4 w-4" />
                患者情報を編集
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
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
                      <Link href={`/examinations/detail/${exam.id}`} key={exam.id} passHref legacyBehavior>
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
                  <Link href={`/examinations/new?patientId=${patientId}`} className="mt-4 inline-block">
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
                      <TableRow key={assessment.id}>
                        <TableCell className="text-lg font-medium">{assessment.date}</TableCell>
                        <TableCell className="text-lg">
                          {assessment.height}cm / {assessment.weight}kg / BMI: {assessment.bmi}
                        </TableCell>
                        <TableCell className="text-lg">{assessment.gripStrength}</TableCell>
                        <TableCell className="text-lg">{assessment.walkingSpeed} m/秒</TableCell>
                        <TableCell className="text-lg">{assessment.frailtyStatus}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg text-muted-foreground">全身機能評価の記録がありません</p>
                  <Link href={`/physical-assessment/new?patientId=${patientId}`} className="mt-4 inline-block">
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
