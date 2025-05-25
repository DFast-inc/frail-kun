"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type PhysicalAssessmentDetailClientProps = {
  exam: any;
  patient: any;
};

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

export default function PhysicalAssessmentDetailClient({ exam, patient }: PhysicalAssessmentDetailClientProps) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Link href={`/patients/${exam.patient_id}`}>
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              戻る
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">身体機能評価 詳細</h1>
            <p className="text-gray-600 mt-1">評価ID: {exam.id}</p>
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
              <p className="text-sm text-gray-600">評価日</p>
              <p className="font-semibold flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {exam.assessment_date}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 身体機能評価データ */}
      <Card>
        <CardHeader>
          <CardTitle>身体機能評価項目</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">身長</p>
              <p className="font-semibold">{exam.height ?? "-"} cm</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">体重</p>
              <p className="font-semibold">{exam.weight ?? "-"} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">BMI</p>
              <p className="font-semibold">{exam.bmi ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">体脂肪率</p>
              <p className="font-semibold">{exam.body_fat_percentage ?? "-"} %</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">筋肉量</p>
              <p className="font-semibold">{exam.muscle_mass ?? "-"} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">握力（右）</p>
              <p className="font-semibold">{exam.grip_strength_right ?? "-"} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">握力（左）</p>
              <p className="font-semibold">{exam.grip_strength_left ?? "-"} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">歩行速度</p>
              <p className="font-semibold">{exam.walking_speed ?? "-"} m/s</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">立ち上がり時間</p>
              <p className="font-semibold">{exam.stand_up_time ?? "-"} 秒</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">バランステスト</p>
              <p className="font-semibold">{exam.balance_test ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">MNA</p>
              <p className="font-semibold">{exam.mna ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">アルブミン</p>
              <p className="font-semibold">{exam.albumin ?? "-"} g/dL</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">MMSE</p>
              <p className="font-semibold">{exam.mmse ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">筋肉質スコア</p>
              <p className="font-semibold">{exam.muscle_quality_score ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">フレイル判定</p>
              <p className="font-semibold">{exam.frailty_status ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">サルコペニアリスク</p>
              <p className="font-semibold">{exam.sarcopenia_risk ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">転倒リスク</p>
              <p className="font-semibold">{exam.fall_risk ?? "-"}</p>
            </div>
          </div>
          {/* 備考 */}
          <div className="mt-4">
            <p className="text-sm text-gray-600">備考</p>
            <p className="font-semibold">{exam.basic_notes ?? ""}</p>
            <p className="font-semibold">{exam.physical_notes ?? ""}</p>
            <p className="font-semibold">{exam.nutritional_notes ?? ""}</p>
            <p className="font-semibold">{exam.cognitive_notes ?? ""}</p>
            <p className="font-semibold">{exam.overall_notes ?? ""}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
