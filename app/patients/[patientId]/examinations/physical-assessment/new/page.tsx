"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export default function NewPhysicalAssessmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get("patientId") || ""

  // サンプル患者データ（実際はAPIから取得）
  const patientData = {
    id: patientId || "1",
    name: patientId ? `患者ID: ${patientId}の患者` : "山田 太郎",
    age: 75,
    gender: "男性",
  }

  const [formData, setFormData] = useState({
    // 基本測定値
    basicMeasurements: {
      height: "",
      weight: "",
      bmi: "",
      bodyFatPercentage: "",
      muscleMass: "",
      muscleQualityScore: "",
      notes: "",
    },
    // 運動機能
    physicalFunction: {
      gripStrength: {
        right: "",
        left: "",
      },
      walkingSpeed: "",
      standUpTime: "",
      balanceTest: "",
      notes: "",
    },
    // 栄養状態
    nutritionalStatus: {
      mna: "",
      albumin: "",
      dietaryIntake: "",
      weightChange: "",
      notes: "",
    },
    // 認知機能
    cognitiveFunction: {
      mmse: "",
      clockDrawingTest: "",
      notes: "",
    },
    // 総合評価
    overallAssessment: {
      frailtyStatus: "",
      sarcopeniaRisk: "",
      fallRisk: "",
      notes: "",
    },
  })

  // BMIの自動計算
  useEffect(() => {
    if (formData.basicMeasurements.height && formData.basicMeasurements.weight) {
      const height = Number.parseFloat(formData.basicMeasurements.height) / 100 // cmをmに変換
      const weight = Number.parseFloat(formData.basicMeasurements.weight)
      if (height > 0 && weight > 0) {
        const bmi = (weight / (height * height)).toFixed(1)
        setFormData((prev) => ({
          ...prev,
          basicMeasurements: {
            ...prev.basicMeasurements,
            bmi,
          },
        }))
      }
    }
  }, [formData.basicMeasurements.height, formData.basicMeasurements.weight])

  const handleChange = (category: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleNestedChange = (category: string, nestedCategory: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [nestedCategory]: {
          ...prev[category as keyof typeof prev][nestedCategory as keyof (typeof prev)[keyof typeof prev]],
          [field]: value,
        },
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = (await import("@/lib/supabaseClient")).createSupabaseClient();

    const { error } = await supabase.from("physical_assessment").insert({
      patient_id: patientData.id,
      assessment_date: new Date().toISOString().slice(0, 10),
      height: formData.basicMeasurements.height ? Number(formData.basicMeasurements.height) : null,
      weight: formData.basicMeasurements.weight ? Number(formData.basicMeasurements.weight) : null,
      bmi: formData.basicMeasurements.bmi ? Number(formData.basicMeasurements.bmi) : null,
      body_fat_percentage: formData.basicMeasurements.bodyFatPercentage ? Number(formData.basicMeasurements.bodyFatPercentage) : null,
      muscle_mass: formData.basicMeasurements.muscleMass ? Number(formData.basicMeasurements.muscleMass) : null,
      muscle_quality_score: formData.basicMeasurements.muscleQualityScore ? Number(formData.basicMeasurements.muscleQualityScore) : null,
      basic_notes: formData.basicMeasurements.notes,
    });

    if (error) {
      toast({
        title: "保存エラー",
        description: "Supabaseへの保存に失敗しました",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "全身機能評価記録完了",
      description: `${patientData.name}さんの全身機能評価がSupabaseに保存されました`,
    });

    // 患者詳細ページへリダイレクト
    router.push(`/patients/${patientData.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">全身機能評価</h1>
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
        {/* 体組成測定 */}
        <Card className="border-2">
          <CardHeader className="bg-blue-100 rounded-t-lg">
            <CardTitle className="text-2xl">体組成測定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-lg">
                  身長 (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  value={formData.basicMeasurements.height}
                  onChange={(e) => handleChange("basicMeasurements", "height", e.target.value)}
                  placeholder="例: 165.0"
                  className="text-lg py-6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-lg">
                  体重 (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.basicMeasurements.weight}
                  onChange={(e) => handleChange("basicMeasurements", "weight", e.target.value)}
                  placeholder="例: 60.0"
                  className="text-lg py-6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bmi" className="text-lg">
                  BMI
                </Label>
                <Input
                  id="bmi"
                  type="text"
                  value={formData.basicMeasurements.bmi}
                  readOnly
                  className="text-lg py-6 bg-gray-50"
                />
                <p className="text-sm text-muted-foreground">身長と体重から自動計算されます</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bodyFatPercentage" className="text-lg">
                  体脂肪率 (%)
                </Label>
                <Input
                  id="bodyFatPercentage"
                  type="number"
                  step="0.1"
                  value={formData.basicMeasurements.bodyFatPercentage}
                  onChange={(e) => handleChange("basicMeasurements", "bodyFatPercentage", e.target.value)}
                  placeholder="例: 25.0"
                  className="text-lg py-6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="muscleMass" className="text-lg">
                  筋肉量 (kg)
                </Label>
                <Input
                  id="muscleMass"
                  type="number"
                  step="0.1"
                  value={formData.basicMeasurements.muscleMass}
                  onChange={(e) => handleChange("basicMeasurements", "muscleMass", e.target.value)}
                  placeholder="例: 45.0"
                  className="text-lg py-6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="muscleQualityScore" className="text-lg">
                  筋質点数
                </Label>
                <Input
                  id="muscleQualityScore"
                  type="number"
                  step="0.1"
                  value={formData.basicMeasurements.muscleQualityScore}
                  onChange={(e) => handleChange("basicMeasurements", "muscleQualityScore", e.target.value)}
                  placeholder="例: 80.0"
                  className="text-lg py-6"
                />
                <p className="text-sm text-muted-foreground">体組成計による筋質点数</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basicMeasurements-notes" className="text-lg">
                備考
              </Label>
              <Textarea
                id="basicMeasurements-notes"
                value={formData.basicMeasurements.notes}
                onChange={(e) => handleChange("basicMeasurements", "notes", e.target.value)}
                placeholder="その他特記事項があればご記入ください"
                className="text-lg min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* 運動機能
        <Card className="border-2">
          <CardHeader className="bg-green-100 rounded-t-lg">
            <CardTitle className="text-2xl">運動機能評価</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            ...（運動機能評価のフォーム内容）...
          </CardContent>
        </Card>
        */}


        <div className="flex justify-between mt-8">
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
            評価結果を保存
          </Button>
        </div>
      </form>
    </div>
  )
}
