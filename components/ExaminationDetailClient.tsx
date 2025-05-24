"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Calendar, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import {
  judgeOralHygiene,
  judgeOralDryness,
  judgeBitingForce,
  judgeTongueMovement,
  judgeTonguePressure,
  judgeChewingFunction,
  judgeSwallowingFunction,
  judgeOverall,
  judgeOralHygieneStatus,
  OralFunctionExamData,
} from "@/lib/oralFunctionAssessmentJudge";

type ExaminationDetailClientProps = {
  exam: any;
  patient: any;
};

// DB値→OralFunctionExamData型へ変換
function toOralFunctionExamData(exam: any): OralFunctionExamData {
  return {
    oralHygiene: {
      tongueFrontLeft: String(exam.tongue_front_left ?? ""),
      tongueFrontCenter: String(exam.tongue_front_center ?? ""),
      tongueFrontRight: String(exam.tongue_front_right ?? ""),
      tongueMiddleLeft: String(exam.tongue_middle_left ?? ""),
      tongueMiddleCenter: String(exam.tongue_middle_center ?? ""),
      tongueMiddleRight: String(exam.tongue_middle_right ?? ""),
      tongueBackLeft: String(exam.tongue_back_left ?? ""),
      tongueBackCenter: String(exam.tongue_back_center ?? ""),
      tongueBackRight: String(exam.tongue_back_right ?? ""),
    },
    oralDryness: {
      evaluationMethod: exam.oral_dryness_method ?? "method1",
      mucusValue: String(exam.mucus_value ?? ""),
      gauzeWeight: String(exam.gauze_weight ?? ""),
    },
    bitingForce: {
      evaluationMethod: exam.biting_force_method ?? "method1",
      pressureScaleType: exam.pressure_scale_type ?? "pressScale2",
      useFilter: exam.use_filter ?? "noFilter",
      occlusionForce: String(exam.occlusion_force ?? ""),
      remainingTeeth: String(exam.remaining_teeth ?? ""),
    },
    tongueMovement: {
      paSound: String(exam.pa_sound ?? ""),
      taSound: String(exam.ta_sound ?? ""),
      kaSound: String(exam.ka_sound ?? ""),
    },
    tonguePressure: {
      value: String(exam.tongue_pressure_value ?? ""),
    },
    chewingFunction: {
      evaluationMethod: exam.chewing_function_method ?? "method1",
      glucoseConcentration: String(exam.glucose_concentration ?? ""),
      masticatoryScore: String(exam.masticatory_score ?? ""),
    },
    swallowingFunction: {
      evaluationMethod: exam.swallowing_function_method ?? "eat10",
      eat10Score: String(exam.eat10_score ?? ""),
      seireiScore: String(exam.seirei_score ?? ""),
    },
  };
}

// 判定・スコア・statusを共通ロジックで生成
function toResultStruct(exam: any) {
  const data = toOralFunctionExamData(exam);
  return {
    oralHygiene: (() => {
      // 6ブロック: 左前・右前・左中・右中・左後・右後
      const scores = [
        Number(data.oralHygiene.tongueFrontLeft || 0), // 左前
        Number(data.oralHygiene.tongueFrontRight || 0), // 右前
        Number(data.oralHygiene.tongueMiddleLeft || 0), // 左中
        Number(data.oralHygiene.tongueMiddleRight || 0), // 右中
        Number(data.oralHygiene.tongueBackLeft || 0), // 左後
        Number(data.oralHygiene.tongueBackRight || 0), // 右後
      ];
      const { tci, isAbnormal } = judgeOralHygieneStatus(scores);
      const blockStr = [
        `左前: ${scores[0]}`,
        `右前: ${scores[1]}`,
        `左中: ${scores[2]}`,
        `右中: ${scores[3]}`,
        `左後: ${scores[4]}`,
        `右後: ${scores[5]}`
      ].join(" / ");
      const tciStr = `TCI: ${tci.toFixed(1)}%`;
      const status = isAbnormal ? "低下（✕）" : "正常";
      return {
        score: isAbnormal ? 1 : 0,
        value: {
          blocks: blockStr,
          tci: tciStr,
          plaque: `プラークコントロール: ${exam.plaque_control ?? "-"}`
        },
        status,
        name: "口腔衛生状態",
        description: "舌苔指数（TCI）・プラークコントロール",
        normalRange: "TCI 50%未満が正常",
        notes: exam.oral_hygiene_notes,
      };
    })(),
    oralDryness: (() => {
      const isNormal = judgeOralDryness(data.oralDryness);
      const value =
        data.oralDryness.evaluationMethod === "method1"
          ? `湿潤度値: ${data.oralDryness.mucusValue ?? "-"}`
          : `ガーゼ重量: ${data.oralDryness.gauzeWeight ?? "-"}`;
      const status = isNormal ? "正常" : "低下（✕）";
      return {
        score: isNormal ? 0 : 1,
        value: `${value} / 判定: ${status}`,
        status,
        name: "口腔乾燥",
        description: "口腔湿潤度測定値・サクソンテスト",
        normalRange: "湿潤度27.0以上, ガーゼ2g以上",
        notes: exam.oral_dryness_notes,
      };
    })(),
    bitingForce: {
      score: judgeBitingForce(data.bitingForce) ? 0 : 1,
      value: `咬合力: ${data.bitingForce.occlusionForce ?? "-"}N / 残存歯数: ${data.bitingForce.remainingTeeth ?? "-"}本 / 器具: ${data.bitingForce.pressureScaleType ?? "-"} / フィルタ: ${data.bitingForce.useFilter ?? "-"}`,
      status: judgeBitingForce(data.bitingForce) ? "正常" : "該当",
      name: "咬合力",
      description: "最大咬合力・残存歯数",
      normalRange: "200N以上, 20本以上",
      notes: exam.biting_force_notes,
    },
    tongueMotor: {
      score: judgeTongueMovement(data.tongueMovement) ? 0 : 1,
      value: `pa: ${data.tongueMovement.paSound ?? "-"} / ta: ${data.tongueMovement.taSound ?? "-"} / ka: ${data.tongueMovement.kaSound ?? "-"}`,
      status: judgeTongueMovement(data.tongueMovement) ? "正常" : "該当",
      name: "舌口唇運動機能",
      description: "オーラルディアドコキネシス",
      normalRange: "6.0回/秒以上",
      notes: exam.tongue_movement_notes,
    },
    tonguePressure: {
      score: judgeTonguePressure(data.tonguePressure) ? 0 : 1,
      value: `${data.tonguePressure.value ?? "-"} kPa`,
      status: judgeTonguePressure(data.tonguePressure) ? "正常" : "該当",
      name: "舌圧",
      description: "舌圧測定値",
      normalRange: "30kPa以上",
      notes: exam.tongue_pressure_notes,
    },
    chewingFunction: {
      score: judgeChewingFunction(data.chewingFunction) ? 0 : 1,
      value: `グルコース濃度: ${data.chewingFunction.glucoseConcentration ?? "-"} / 咀嚼能率スコア: ${data.chewingFunction.masticatoryScore ?? "-"}`,
      status: judgeChewingFunction(data.chewingFunction) ? "正常" : "該当",
      name: "咀嚼機能",
      description: "グルコース含有ゼリー法・咀嚼能率スコア",
      normalRange: "100mg/dL以上, スコア3以上",
      notes: exam.chewing_function_notes,
    },
    swallowingFunction: {
      score: judgeSwallowingFunction(data.swallowingFunction) ? 0 : 1,
      value: `EAT-10: ${data.swallowingFunction.eat10Score ?? "-"} / 聖隷式: ${data.swallowingFunction.seireiScore ?? "-"}`,
      status: judgeSwallowingFunction(data.swallowingFunction) ? "正常" : "該当",
      name: "嚥下機能",
      description: "EAT-10・聖隷式嚥下質問紙",
      normalRange: "EAT-10: 3点未満, 聖隷式: 2点未満",
      notes: exam.swallowing_function_notes,
    },
  };
}

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

export default function ExaminationDetailClient({ exam, patient }: ExaminationDetailClientProps) {
  const results = toResultStruct(exam);


  // レーダーチャート用のデータ
  const radarData = [
    { subject: "口腔衛生", score: results.oralHygiene.score === 0 ? 5 : 1 },
    { subject: "口腔乾燥", score: results.oralDryness.score === 0 ? 5 : 1 },
    { subject: "咬合力", score: results.bitingForce.score === 0 ? 5 : 1 },
    { subject: "舌運動", score: results.tongueMotor.score === 0 ? 5 : 1 },
    { subject: "舌圧", score: results.tonguePressure.score === 0 ? 5 : 1 },
    { subject: "咀嚼機能", score: results.chewingFunction.score === 0 ? 5 : 1 },
    { subject: "嚥下機能", score: results.swallowingFunction.score === 0 ? 5 : 1 },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Link href={`/patients/${exam.patient_id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              戻る
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">口腔機能検査結果詳細</h1>
            <p className="text-gray-600 mt-1">検査ID: {exam.id}</p>
          </div>
        </div>
        <div>
<Link href={`/patients/${exam.patient_id}/examinations/oral-function-assessment/${exam.id}/management-plan-edit`}>
  <Button variant="default" size="sm" className="ml-2">
    管理計画書作成
  </Button>
</Link>
        </div>
      </div>

      {/* 基本情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            患者基本情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">患者ID</p>
              <p className="font-semibold">{patient?.id ?? ""}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">患者名</p>
              <p className="font-semibold">{patient?.name ?? ""}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">年齢・性別</p>
              <p className="font-semibold">
                {calcAge(patient?.birthday)}歳 {patient?.gender ?? ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">検査日</p>
              <p className="font-semibold flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {exam.exam_date}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 総合評価 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            総合評価
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {
                  [
                    results.oralHygiene.score,
                    results.oralDryness.score,
                    results.bitingForce.score,
                    results.tongueMotor.score,
                    results.tonguePressure.score,
                    results.chewingFunction.score,
                    results.swallowingFunction.score,
                  ].reduce((a, b) => a + b, 0)
                }
                /7
              </div>
              <p className="text-gray-600">該当項目数</p>
            </div>
            <div className="text-center">
              <Badge
                variant={
                  [
                    results.oralHygiene.score,
                    results.oralDryness.score,
                    results.bitingForce.score,
                    results.tongueMotor.score,
                    results.tonguePressure.score,
                    results.chewingFunction.score,
                    results.swallowingFunction.score,
                  ].reduce((a, b) => a + b, 0) >= 2
                    ? "destructive"
                    : "secondary"
                }
                className={`text-lg px-4 py-2 ${
                  [
                    results.oralHygiene.score,
                    results.oralDryness.score,
                    results.bitingForce.score,
                    results.tongueMotor.score,
                    results.tonguePressure.score,
                    results.chewingFunction.score,
                    results.swallowingFunction.score,
                  ].reduce((a, b) => a + b, 0) >= 2
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {judgeOverall(toOralFunctionExamData(exam)) ? "正常" : "要注意"}
              </Badge>
              <p className="text-gray-600 mt-2">診断結果</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{exam.examiner}</p>
              <p className="text-gray-600">検査者</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 詳細結果タブ */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details" className="text-lg py-3">
            詳細結果
          </TabsTrigger>
          <TabsTrigger value="chart" className="text-lg py-3">
            グラフ表示
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>検査項目別結果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(
                  [
                    "oralHygiene",
                    "oralDryness",
                    "bitingForce",
                    "tongueMotor",
                    "tonguePressure",
                    "chewingFunction",
                    "swallowingFunction",
                  ] as (keyof typeof results)[]
                ).map((key) => {
                  const result = results[key] ?? {
                    name: "",
                    description: "",
                    score: 0,
                    value: "-",
                    status: "-",
                    normalRange: "",
                    notes: "",
                  };
                  return (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{result.name}</h3>
                          <p className="text-gray-600 text-sm">{result.description}</p>
                        </div>
                        <Badge variant={result.score === 0 ? "secondary" : "destructive"}>{result.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-sm text-gray-600">測定値</p>
                          {key === "oralHygiene" && typeof result.value === "object" ? (
                            <div>
                              <div className="font-semibold">{result.value.blocks}</div>
                              <div className="font-semibold">{result.value.tci}</div>
                              <div className="font-semibold">{result.value.plaque}</div>
                              <div className="mt-1 font-semibold">
                                判定: {result.status}
                              </div>
                            </div>
                          ) : (
                            typeof result.value === "string" ? (
                              <p className="font-semibold text-lg">{result.value}</p>
                            ) : null
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">正常範囲</p>
                          <p className="font-semibold">{result.normalRange}</p>
                        </div>
                      </div>
                      {result.notes && (
                        <div className="mt-2 text-sm text-gray-500">備考: {result.notes}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>口腔機能評価チャート</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} tick={false} />
                    <Radar
                      name="機能レベル"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">※ 5: 正常、1: 機能低下</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 推奨事項 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            推奨事項・治療計画
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(exam.recommendations ?? []).map((recommendation: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>{recommendation}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">次回検査予定日</p>
            <p className="font-semibold text-blue-800">{exam.nextAppointment}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
