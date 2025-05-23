"use client"
import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ManagementPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: patientId } = React.use(params)
  const router = useRouter()

  // サンプル患者データ（実際はAPIから取得）
  const patientData = {
    id: patientId,
    name: `患者ID: ${patientId}の患者`,
    age: 75,
    gender: "男性",
    // 検査結果サンプル（実際はAPIから取得）
    examResults: {
      oralHygiene: { result: "異常あり" },
      oralDryness: { result: "異常あり" },
      bitingForce: { result: "正常" },
      tongueMovement: { result: "異常あり" },
      tonguePressure: { result: "異常あり" },
      chewingFunction: { result: "正常" },
      swallowingFunction: { result: "異常あり" },
    },
  }

  const [formData, setFormData] = useState({
    // ...（省略: 既存のformData初期値）
    oralHygiene: {
      professionalCleaning: false,
      selfCareInstruction: false,
      tongueCleaningInstruction: false,
      regularCheckup: false,
      notes: "",
    },
    oralDryness: {
      moisturizingAgent: false,
      salivaryGlandMassage: false,
      waterIntakeInstruction: false,
      sugarlessCandyRecommendation: false,
      notes: "",
    },
    bitingForce: {
      bitingExercise: false,
      prosthodonticTreatment: false,
      occlusalAdjustment: false,
      notes: "",
    },
    tongueMovement: {
      tongueExercise: false,
      lipExercise: false,
      speechTherapy: false,
      notes: "",
    },
    tonguePressure: {
      tonguePressureTraining: false,
      swallowingExercise: false,
      notes: "",
    },
    chewingFunction: {
      chewingExercise: false,
      dietaryGuidance: false,
      dentalProsthesis: false,
      notes: "",
    },
    swallowingFunction: {
      swallowingRehabilitation: false,
      posturalTechnique: false,
      dietModification: false,
      referToSpecialist: false,
      notes: "",
    },
    overallPlan: {
      visitFrequency: "",
      expectedDuration: "",
      goals: "",
      additionalNotes: "",
    },
  })

  const handleCheckboxChange = (category: string, field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("管理計画データ:", formData)

    // ここで実際のAPIリクエストを行う代わりに成功メッセージを表示
    toast({
      title: "管理計画保存完了",
      description: `${patientData.name}さんの管理計画が保存されました`,
    })

    // 患者詳細ページへリダイレクト
    router.push(`/patients/${patientData.id}`)
  }

  return (
    // ...（省略: 既存のJSX部分はそのまま）
    <div className="space-y-6">
      {/* ...既存のJSXをそのまま残す */}
    </div>
  )
}
