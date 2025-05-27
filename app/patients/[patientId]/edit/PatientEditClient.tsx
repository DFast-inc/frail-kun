"use client"

import { useRouter } from "next/navigation"
import { PatientForm, PatientFormData } from "@/components/PatientForm"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { updatePatient } from "./actions"

type Props = {
  patientId: string
  initialValues: PatientFormData
}

export function PatientEditClient({ patientId, initialValues }: Props) {
  const router = useRouter()
  const [formValues, setFormValues] = useState<PatientFormData>(initialValues)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: PatientFormData) => {
    setLoading(true)
    const result = await updatePatient(patientId, data)
    setLoading(false)
    if (result?.error) {
      toast({
        title: "更新エラー",
        description: "患者情報の更新に失敗しました",
        variant: "destructive",
      })
      return false
    }
    router.push(`/patients/${patientId}`)
    return true
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">患者情報編集</h1>
        <Button variant="outline" size="sm" className="self-start sm:self-auto" onClick={() => router.push(`/patients/${patientId}`)}>
          詳細に戻る
        </Button>
      </div>
      <PatientForm
        initialValues={formValues}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/patients/${patientId}`)}
        submitLabel={loading ? "更新中..." : "更新"}

      />
    </div>
  )
}
