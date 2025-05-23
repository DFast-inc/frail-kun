"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabaseClient";
import OralFunctionManagementPlanForm from "@/components/OralFunctionManagementPlanForm";

export default function ManagementPlanEditPage() {
  const params = useParams();
  const [exam, setExam] = useState<any>(null);

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

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", background: "#fff", padding: "32px", fontFamily: "serif", color: "#222", border: "1px solid #ccc" }}>
      <style>{`
        .section-title { font-size: 1.2rem; font-weight: bold; margin-top: 2rem; margin-bottom: 0.5rem; }
        .form-group { margin-bottom: 1rem; }
        .input-section { margin-bottom: 2rem; }
        .radio-group, .checkbox-wrapper { display: flex; gap: 1.5em; flex-wrap: wrap; }
        .checkbox-other { display: flex; align-items: center; gap: 0.5em; }
      `}</style>
      <h2 className="text-2xl font-bold mb-6">口腔機能管理計画書作成</h2>
      <div className="mb-4">
        <Link href={`/patients/${params.patientId}/examinations/oral-function-assessment/${params.oralFunctionAssessmentId}/management-plan-edit/print`}>
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            style={{ fontWeight: "bold" }}
          >
            印刷
          </button>
        </Link>
      </div>
      <div className="mb-8">
        <div className="flex flex-wrap gap-6 items-center bg-gray-50 rounded-lg p-4 border mb-6">
          <div>
            <span className="font-semibold text-gray-700">患者名:</span> <span>{exam?.patientName ?? ""}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">年齢:</span> <span>{exam?.age ?? ""}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">性別:</span> <span>{exam?.gender ?? ""}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">検査日:</span> <span>{exam?.exam_date ?? ""}</span>
          </div>
        </div>

      </div>
      <OralFunctionManagementPlanForm />
      {/* ...（プレビュー・印刷用管理計画書部分も同様に移植可能）... */}
    </div>
  );
}
