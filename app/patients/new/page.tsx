"use client"

import { useRouter } from "next/navigation"
import { PatientForm, PatientFormData } from "@/components/PatientForm"
import { useCreatePatient } from "@/hooks/useCreatePatient"
import { Button } from "@/components/ui/button"

export default function NewPatientPage() {
  const router = useRouter()
  const { createPatient } = useCreatePatient()

  const handleSubmit = async (data: PatientFormData) => {
    const patient = await createPatient(data)
    if (patient && patient.id) {
      router.push(`/patients/${patient.id}/examinations/oral-function-assessment/new`)
      return true
    }
    return false
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">新規患者登録</h1>
        <Button variant="outline" size="sm" className="self-start sm:self-auto" onClick={() => router.push("/")}>
          ホームに戻る
        </Button>
      </div>
      <PatientForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/")}
        submitLabel="登録"
      />
    </div>
  )
}
