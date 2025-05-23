import { createSupabaseClient } from "@/lib/supabaseClient"
import ExaminationDetailClient from "@/components/ExaminationDetailClient"

export default async function ExaminationDetailPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseClient()
  const { data: exam, error } = await supabase
    .from("oral_function_exam")
    .select("*")
    .eq("id", params.id)
    .single()


    console.log("exam", exam)

  if (error || !exam) {
    // Next.js 15推奨: notFound()で404ページへ
    const { notFound } = await import("next/navigation");
    notFound();
    return null;
  }

  return <ExaminationDetailClient exam={exam} />;
}
