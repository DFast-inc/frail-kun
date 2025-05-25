"use client"

import { useRouter, useParams } from "next/navigation"
import { PatientForm, PatientFormData } from "@/components/PatientForm"
import { usePatient } from "@/hooks/usePatient"
import { useUpdatePatient } from "@/hooks/useUpdatePatient"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function EditPatientPage() {
  const router = useRouter()
  const params = useParams()
  const patientId = Array.isArray(params?.patientId) ? params.patientId[0] : params?.patientId
  const { patient, loading } = usePatient(patientId ?? "")
  const { updatePatient } = useUpdatePatient()
  const [initialValues, setInitialValues] = useState<PatientFormData | null>(null)

  useEffect(() => {
    if (patient) {
      setInitialValues({
        name: patient.name || "",
        birthday: patient.birthday || "",
        gender: patient.gender || "",
        address: patient.address || "",
        phone: patient.phone || "",
        email: patient.email || "",
        notes: patient.notes || "",
        karte_no: patient.karte_no !== undefined && patient.karte_no !== null ? String(patient.karte_no) : "",
      })
    }
  }, [patient])

  const handleSubmit = async (data: PatientFormData) => {
    const success = await updatePatient(patientId ?? "", data)
    if (success) {
      router.push(`/patients/${patientId}`)
    } else {
      toast({
        title: "更新エラー",
        description: "患者情報の更新に失敗しました",
        variant: "destructive",
      })
    }
    return success
  }

  if (loading || !initialValues) {
    return <div className="p-8 text-center text-gray-500">読み込み中...</div>
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
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/patients/${patientId}`)}
        submitLabel="更新"
      />
    </div>
  )
}
