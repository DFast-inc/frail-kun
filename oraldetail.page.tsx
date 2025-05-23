"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Calendar, FileText, AlertTriangle, CheckCircle, Printer, Download } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

// サンプルデータ（実際のアプリケーションではAPIから取得）
const getExaminationData = (id: string) => {
  const data = {
    "1": {
      id: "1",
      patientId: "P001",
      patientName: "田中 太郎",
      age: 75,
      gender: "男性",
      date: "2024-01-15",
      totalScore: 3,
      status: "口腔機能低下症",
      examiner: "佐藤医師",
      results: {
        oralHygiene: {
          score: 1,
          value: "25個以上",
          status: "該当",
          name: "口腔衛生状態不良",
          description: "舌苔��着度",
          normalRange: "25個未満",
        },
        oralDryness: {
          score: 0,
          value: "27.8",
          status: "正常",
          name: "口腔乾燥",
          description: "口腔水分計測定値",
          normalRange: "27.0以上",
        },
        bitingForce: {
          score: 1,
          value: "180N",
          status: "該当",
          name: "咬合力低下",
          description: "最大咬合力",
          normalRange: "200N以上",
        },
        tongueMotor: {
          score: 0,
          value: "6.2秒",
          status: "正常",
          name: "舌口唇運動機能低下",
          description: "オーラルディアドコキネシス（/ta/）",
          normalRange: "6.0回/秒以上",
        },
        chewingFunction: {
          score: 1,
          value: "95mg/dL",
          status: "該当",
          name: "咀嚼機能低下",
          description: "グルコース溶出量",
          normalRange: "100mg/dL以上",
        },
        swallowingFunction: {
          score: 0,
          value: "3.2mL",
          status: "正常",
          name: "嚥下機能低下",
          description: "30秒間水飲みテスト",
          normalRange: "3mL以上",
        },
        speechFunction: {
          score: 0,
          value: "6.8",
          status: "正常",
          name: "構音機能低下",
          description: "オーラルディアドコキネシス（/ka/）",
          normalRange: "6.0回/秒以上",
        },
      },
      recommendations: [
        "口腔衛生指導の実施",
        "咬合力向上のための咀嚼訓練",
        "咀嚼機能改善のための食事指導",
        "定期的な口腔機能評価の実施",
      ],
      nextAppointment: "2024-02-15",
    },
  }
  return data[id as keyof typeof data]
}

export default function ExaminationDetailPage() {
  const params = useParams()
  const id = params.id as string
  const examination = getExaminationData(id)

  if (!examination) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-900">検査結果が見つかりません</h1>
          <Link href="/examinations">
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              検査結果一覧に戻る
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // レーダーチャート用のデータ
  const radarData = [
    { subject: "口腔衛生", score: examination.results.oralHygiene.score === 0 ? 5 : 1 },
    { subject: "口腔乾燥", score: examination.results.oralDryness.score === 0 ? 5 : 1 },
    { subject: "咬合力", score: examination.results.bitingForce.score === 0 ? 5 : 1 },
    { subject: "舌運動", score: examination.results.tongueMotor.score === 0 ? 5 : 1 },
    { subject: "咀嚼機能", score: examination.results.chewingFunction.score === 0 ? 5 : 1 },
    { subject: "嚥下機能", score: examination.results.swallowingFunction.score === 0 ? 5 : 1 },
    { subject: "構音機能", score: examination.results.speechFunction.score === 0 ? 5 : 1 },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Link href="/patients/[id]">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              戻る
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">口腔機能検査結果詳細</h1>
            <p className="text-gray-600 mt-1">検査ID: {examination.id}</p>
          </div>
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
              <p className="font-semibold">{examination.patientId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">患者名</p>
              <p className="font-semibold">{examination.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">年齢・性別</p>
              <p className="font-semibold">
                {examination.age}歳 {examination.gender}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">検査日</p>
              <p className="font-semibold flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {examination.date}
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
              <div className="text-4xl font-bold mb-2">{examination.totalScore}/7</div>
              <p className="text-gray-600">該当項目数</p>
            </div>
            <div className="text-center">
              <Badge
                variant={examination.totalScore >= 2 ? "destructive" : "secondary"}
                className={`text-lg px-4 py-2 ${
                  examination.totalScore >= 2 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}
              >
                {examination.status}
              </Badge>
              <p className="text-gray-600 mt-2">診断結果</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{examination.examiner}</p>
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
                {Object.entries(examination.results).map(([key, result]) => (
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
            {examination.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>{recommendation}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">次回検査予定日</p>
            <p className="font-semibold text-blue-800">{examination.nextAppointment}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
