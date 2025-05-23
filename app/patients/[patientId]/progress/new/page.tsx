"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewProgressPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const patientId = params.id

  // サンプル患者データ（実際はAPIから取得）
  const patientData = {
    id: patientId,
    name: `患者ID: ${patientId}の患者`,
    age: 75,
    gender: "男性",
  }

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    interventions: {
      oralHygiene: false,
      oralMoisturizer: false,
      tongueExercise: false,
      swallowingExercise: false,
      bitingExercise: false,
      dietaryGuidance: false,
      dentalTreatment: false,
      other: false,
      otherText: "",
    },
    progress: {
      oralHygiene: "",
      oralDryness: "",
      bitingForce: "",
      tongueMovement: "",
      tonguePressure: "",
      chewingFunction: "",
      swallowingFunction: "",
    },
    overallStatus: "",
    nextAppointment: "",
    notes: "",
  })

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interventions: {
        ...prev.interventions,
        [field]: checked,
      },
    }))
  }

  const handleTextChange = (category: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("経過記録データ:", formData)

    // ここで実際のAPIリクエストを行う代わりに成功メッセージを表示
    toast({
      title: "経過記録保存完了",
      description: `${patientData.name}さんの経過記録が保存されました`,
    })

    // 患者詳細ページへリダイレクト
    router.push(`/patients/${patientData.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">経過記録</h1>
          <p className="text-xl text-muted-foreground mt-2">
            患者: {patientData.name} ({patientData.age}歳・{patientData.gender})
          </p>
        </div>
        <Button
          onClick={() => router.push(`/patients/${patientData.id}`)}
          variant="outline"
          size="lg"
          className="text-lg py-6 px-6"
        >
          患者詳細に戻る
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-2">
          <CardHeader className="bg-blue-100 rounded-t-lg">
            <CardTitle className="text-2xl">基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-lg">
                  実施日 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                  className="text-lg py-6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextAppointment" className="text-lg">
                  次回予約日
                </Label>
                <Input
                  id="nextAppointment"
                  type="date"
                  value={formData.nextAppointment}
                  onChange={(e) => handleInputChange("nextAppointment", e.target.value)}
                  className="text-lg py-6"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 mt-6">
          <CardHeader className="bg-green-100 rounded-t-lg">
            <CardTitle className="text-2xl">実施内容</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="oralHygiene"
                  checked={formData.interventions.oralHygiene}
                  onCheckedChange={(checked) => handleCheckboxChange("oralHygiene", checked as boolean)}
                  className="h-5 w-5"
                />
                <Label htmlFor="oralHygiene" className="text-lg">
                  専門的口腔ケア
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="oralMoisturizer"
                  checked={formData.interventions.oralMoisturizer}
                  onCheckedChange={(checked) => handleCheckboxChange("oralMoisturizer", checked as boolean)}
                  className="h-5 w-5"
                />
                <Label htmlFor="oralMoisturizer" className="text-lg">
                  口腔保湿剤の使用
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tongueExercise"
                  checked={formData.interventions.tongueExercise}
                  onCheckedChange={(checked) => handleCheckboxChange("tongueExercise", checked as boolean)}
                  className="h-5 w-5"
                />
                <Label htmlFor="tongueExercise" className="text-lg">
                  舌運動訓練
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="swallowingExercise"
                  checked={formData.interventions.swallowingExercise}
                  onCheckedChange={(checked) => handleCheckboxChange("swallowingExercise", checked as boolean)}
                  className="h-5 w-5"
                />
                <Label htmlFor="swallowingExercise" className="text-lg">
                  嚥下訓練
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bitingExercise"
                  checked={formData.interventions.bitingExercise}
                  onCheckedChange={(checked) => handleCheckboxChange("bitingExercise", checked as boolean)}
                  className="h-5 w-5"
                />
                <Label htmlFor="bitingExercise" className="text-lg">
                  咬合力トレーニング
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dietaryGuidance"
                  checked={formData.interventions.dietaryGuidance}
                  onCheckedChange={(checked) => handleCheckboxChange("dietaryGuidance", checked as boolean)}
                  className="h-5 w-5"
                />
                <Label htmlFor="dietaryGuidance" className="text-lg">
                  食事指導
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dentalTreatment"
                  checked={formData.interventions.dentalTreatment}
                  onCheckedChange={(checked) => handleCheckboxChange("dentalTreatment", checked as boolean)}
                  className="h-5 w-5"
                />
                <Label htmlFor="dentalTreatment" className="text-lg">
                  歯科治療
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="other"
                  checked={formData.interventions.other}
                  onCheckedChange={(checked) => handleCheckboxChange("other", checked as boolean)}
                  className="h-5 w-5"
                />
                <Label htmlFor="other" className="text-lg">
                  その他
                </Label>
              </div>
            </div>

            {formData.interventions.other && (
              <div className="space-y-2">
                <Label htmlFor="otherText" className="text-lg">
                  その他の内容
                </Label>
                <Input
                  id="otherText"
                  value={formData.interventions.otherText}
                  onChange={(e) => handleTextChange("interventions", "otherText", e.target.value)}
                  placeholder="その他の実施内容を入力してください"
                  className="text-lg py-6"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 mt-6">
          <CardHeader className="bg-purple-100 rounded-t-lg">
            <CardTitle className="text-2xl">経過状況</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <Label className="text-lg">口腔衛生状態</Label>
              <Select
                value={formData.progress.oralHygiene}
                onValueChange={(value) => handleTextChange("progress", "oralHygiene", value)}
              >
                <SelectTrigger className="text-lg py-6">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="improved">改善</SelectItem>
                  <SelectItem value="unchanged">変化なし</SelectItem>
                  <SelectItem value="worsened">悪化</SelectItem>
                  <SelectItem value="notAssessed">未評価</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-lg">口腔乾燥</Label>
              <Select
                value={formData.progress.oralDryness}
                onValueChange={(value) => handleTextChange("progress", "oralDryness", value)}
              >
                <SelectTrigger className="text-lg py-6">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="improved">改善</SelectItem>
                  <SelectItem value="unchanged">変化なし</SelectItem>
                  <SelectItem value="worsened">悪化</SelectItem>
                  <SelectItem value="notAssessed">未評価</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-lg">咬合力</Label>
              <Select
                value={formData.progress.bitingForce}
                onValueChange={(value) => handleTextChange("progress", "bitingForce", value)}
              >
                <SelectTrigger className="text-lg py-6">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="improved">改善</SelectItem>
                  <SelectItem value="unchanged">変化なし</SelectItem>
                  <SelectItem value="worsened">悪化</SelectItem>
                  <SelectItem value="notAssessed">未評価</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-lg">舌口唇運動機能</Label>
              <Select
                value={formData.progress.tongueMovement}
                onValueChange={(value) => handleTextChange("progress", "tongueMovement", value)}
              >
                <SelectTrigger className="text-lg py-6">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="improved">改善</SelectItem>
                  <SelectItem value="unchanged">変化なし</SelectItem>
                  <SelectItem value="worsened">悪化</SelectItem>
                  <SelectItem value="notAssessed">未評価</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-lg">舌圧</Label>
              <Select
                value={formData.progress.tonguePressure}
                onValueChange={(value) => handleTextChange("progress", "tonguePressure", value)}
              >
                <SelectTrigger className="text-lg py-6">
                  <SelectValue placeholder="選択し��ください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="improved">改善</SelectItem>
                  <SelectItem value="unchanged">変化なし</SelectItem>
                  <SelectItem value="worsened">悪化</SelectItem>
                  <SelectItem value="notAssessed">未評価</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-lg">咀嚼機能</Label>
              <Select
                value={formData.progress.chewingFunction}
                onValueChange={(value) => handleTextChange("progress", "chewingFunction", value)}
              >
                <SelectTrigger className="text-lg py-6">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="improved">改善</SelectItem>
                  <SelectItem value="unchanged">変化なし</SelectItem>
                  <SelectItem value="worsened">悪化</SelectItem>
                  <SelectItem value="notAssessed">未評価</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-lg">嚥下機能</Label>
              <Select
                value={formData.progress.swallowingFunction}
                onValueChange={(value) => handleTextChange("progress", "swallowingFunction", value)}
              >
                <SelectTrigger className="text-lg py-6">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="improved">改善</SelectItem>
                  <SelectItem value="unchanged">変化なし</SelectItem>
                  <SelectItem value="worsened">悪化</SelectItem>
                  <SelectItem value="notAssessed">未評価</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-lg">全体的な状態</Label>
              <Select
                value={formData.overallStatus}
                onValueChange={(value) => handleInputChange("overallStatus", value)}
              >
                <SelectTrigger className="text-lg py-6">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="improved">改善傾向</SelectItem>
                  <SelectItem value="stable">安定</SelectItem>
                  <SelectItem value="unchanged">変化なし</SelectItem>
                  <SelectItem value="worsened">悪化傾向</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-lg">
                備考・詳細
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="その他特記事項があればご記入ください"
                className="text-lg min-h-[150px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="text-lg py-6 px-8"
              onClick={() => router.push(`/patients/${patientData.id}`)}
            >
              キャンセル
            </Button>
            <Button type="submit" size="lg" className="text-lg py-6 px-8">
              記録を保存
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
