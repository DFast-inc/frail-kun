"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Calendar, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

type ExaminationDetailClientProps = {
  exam: any;
};

function toResultStruct(exam: any) {
  // サンプルUIのresults構造に変換
  return {
    oralHygiene: {
      score: (Number(exam.tongue_front_left) + Number(exam.tongue_front_center) + Number(exam.tongue_front_right) +
        Number(exam.tongue_middle_left) + Number(exam.tongue_middle_center) + Number(exam.tongue_middle_right) +
        Number(exam.tongue_back_left) + Number(exam.tongue_back_center) + Number(exam.tongue_back_right)) >= 3 ? 1 : 0,
      value: [
        `前方: 左${exam.tongue_front_left}, 中央${exam.tongue_front_center}, 右${exam.tongue_front_right}`,
        `中央: 左${exam.tongue_middle_left}, 中央${exam.tongue_middle_center}, 右${exam.tongue_middle_right}`,
        `後方: 左${exam.tongue_back_left}, 中央${exam.tongue_back_center}, 右${exam.tongue_back_right}`,
        `プラークコントロール: ${exam.plaque_control ?? "-"}`,
      ].join(" / "),
      status: (Number(exam.tongue_front_left) + Number(exam.tongue_front_center) + Number(exam.tongue_front_right) +
        Number(exam.tongue_middle_left) + Number(exam.tongue_middle_center) + Number(exam.tongue_middle_right) +
        Number(exam.tongue_back_left) + Number(exam.tongue_back_center) + Number(exam.tongue_back_right)) >= 3 ? "該当" : "正常",
      name: "口腔衛生状態",
      description: "舌苔指数・プラークコントロール",
      normalRange: "合計スコア3未満",
      notes: exam.oral_hygiene_notes,
    },
    oralDryness: {
      score: exam.mucus_value && Number(exam.mucus_value) < 27.0 ? 1 : 0,
      value: `湿潤度: ${exam.mucus_value ?? "-"} / ガーゼ重量: ${exam.gauze_weight ?? "-"}`,
      status: exam.mucus_value && Number(exam.mucus_value) < 27.0 ? "該当" : "正常",
      name: "口腔乾燥",
      description: "口腔湿潤度測定値・サクソンテスト",
      normalRange: "湿潤度27.0以上, ガーゼ2g以上",
      notes: exam.oral_dryness_notes,
    },
    bitingForce: {
      score: exam.occlusion_force && Number(exam.occlusion_force) < 200 ? 1 : 0,
      value: `咬合力: ${exam.occlusion_force ?? "-"}N / 残存歯数: ${exam.remaining_teeth ?? "-"}本 / 器具: ${exam.pressure_scale_type ?? "-"} / フィルタ: ${exam.use_filter ?? "-"}`,
      status: exam.occlusion_force && Number(exam.occlusion_force) < 200 ? "該当" : "正常",
      name: "咬合力",
      description: "最大咬合力・残存歯数",
      normalRange: "200N以上, 20本以上",
      notes: exam.biting_force_notes,
    },
    tongueMotor: {
      score: exam.pa_sound && Number(exam.pa_sound) < 6.0 ? 1 : 0,
      value: `pa: ${exam.pa_sound ?? "-"} / ta: ${exam.ta_sound ?? "-"} / ka: ${exam.ka_sound ?? "-"}`,
      status: exam.pa_sound && Number(exam.pa_sound) < 6.0 ? "該当" : "正常",
      name: "舌口唇運動機能",
      description: "オーラルディアドコキネシス",
      normalRange: "6.0回/秒以上",
      notes: exam.tongue_movement_notes,
    },
    tonguePressure: {
      score: exam.tongue_pressure_value && Number(exam.tongue_pressure_value) < 30 ? 1 : 0,
      value: `${exam.tongue_pressure_value ?? "-"} kPa`,
      status: exam.tongue_pressure_value && Number(exam.tongue_pressure_value) < 30 ? "該当" : "正常",
      name: "舌圧",
      description: "舌圧測定値",
      normalRange: "30kPa以上",
      notes: exam.tongue_pressure_notes,
    },
    chewingFunction: {
      score: exam.glucose_concentration && Number(exam.glucose_concentration) < 100 ? 1 : 0,
      value: `グルコース濃度: ${exam.glucose_concentration ?? "-"} / 咀嚼能率スコア: ${exam.masticatory_score ?? "-"}`,
      status: exam.glucose_concentration && Number(exam.glucose_concentration) < 100 ? "該当" : "正常",
      name: "咀嚼機能",
      description: "グルコース含有ゼリー法・咀嚼能率スコア",
      normalRange: "100mg/dL以上, スコア3以上",
      notes: exam.chewing_function_notes,
    },
    swallowingFunction: {
      score: exam.eat10_score && Number(exam.eat10_score) >= 3 ? 1 : 0,
      value: `EAT-10: ${exam.eat10_score ?? "-"} / 聖隷式: ${exam.seirei_score ?? "-"}`,
      status: exam.eat10_score && Number(exam.eat10_score) >= 3 ? "該当" : "正常",
      name: "嚥下機能",
      description: "EAT-10・聖隷式嚥下質問紙",
      normalRange: "EAT-10: 3点未満, 聖隷式: 2点未満",
      notes: exam.swallowing_function_notes,
    },
  };
}

export default function ExaminationDetailClient({ exam }: ExaminationDetailClientProps) {
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
              <p className="font-semibold">{exam.patientId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">患者名</p>
              <p className="font-semibold">{exam.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">年齢・性別</p>
              <p className="font-semibold">
                {exam.age}歳 {exam.gender}
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
              <div className="text-4xl font-bold mb-2">{exam.totalScore}/7</div>
              <p className="text-gray-600">該当項目数</p>
            </div>
            <div className="text-center">
              <Badge
                variant={exam.totalScore >= 2 ? "destructive" : "secondary"}
                className={`text-lg px-4 py-2 ${
                  exam.totalScore >= 2 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}
              >
                {exam.status}
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
                {Object.entries(results).map(([key, result]: [string, any]) => (
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
                        <p className="font-semibold text-lg">{result.value}</p>
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
                ))}
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
