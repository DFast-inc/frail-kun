"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabaseClient";
import OralFunctionManagementPlanForm from "@/components/OralFunctionManagementPlanForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 年齢計算ユーティリティ
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

export default function ManagementPlanEditPage() {
  const params = useParams();
  const [exam, setExam] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    async function fetchExam() {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("oral_function_exam")
        .select("*")
        .eq("id", params.oralFunctionAssessmentId)
        .single();
      if (!error) setExam(data);
    }
    fetchExam();
  }, [params.oralFunctionAssessmentId]);

  useEffect(() => {
    async function fetchPatient() {
      if (!params.patientId) return;
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", params.patientId)
        .single();
      if (!error) setPatient(data);
    }
    fetchPatient();
  }, [params.patientId]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-6">口腔機能管理計画書作成</h2>
        <div className="mb-4">
          <Link href={`/patients/${params.patientId}/examinations/oral-function-assessment/${params.oralFunctionAssessmentId}/management-plan-edit/print`}>
            <Button variant="default" className="font-bold">
              印刷
            </Button>
          </Link>
        </div>
        <Card className="mb-8 bg-gray-50 border flex flex-wrap gap-6 items-center p-4">
          <div>
            <span className="font-semibold text-gray-700">患者名:</span> <span>{patient?.name ?? ""}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">年齢:</span> <span>{calcAge(patient?.birthday)}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">性別:</span>
<span>
  {patient?.gender === "male"
    ? "男性"
    : patient?.gender === "female"
      ? "女性"
      : patient?.gender ?? ""}
</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">検査日:</span> <span>{exam?.exam_date ?? ""}</span>
          </div>
        </Card>
        <OralFunctionManagementPlanForm />
        {/* ...（プレビュー・印刷用管理計画書部分も同様に移植可能）... */}
      </Card>
    </div>
  );
}
