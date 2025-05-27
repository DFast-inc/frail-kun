import ManagementGuidanceRecordSheet from "@/components/ManagementGuidanceRecordSheet";
import { createSupabaseClient } from "@/lib/supabaseClient";

/**
 * 管理指導記録簿 印刷専用ページ
 * - 既存の枠組みと同じレイアウト
 * - 印刷時に余計なUIが出ないようにする
 */
export default async function ManagementGuidanceRecordPrintPage() {
  // サーバーサイドでoral_function_examデータを取得
  const supabase = createSupabaseClient();
  // TODO: patientIdをルーティングパラメータから取得し、where句に追加する
  const { data, error } = await supabase
    .from("oral_function_exam")
    .select("id, date, general_condition, oral_function, other, management_content")
    .order("date", { ascending: true });

  // compareDataの整形
  const compareData = (data || []).map((d: any) => ({
    id: d.id,
    date: d.date,
    generalCondition: d.general_condition,
    oralFunction: d.oral_function,
    other: d.other,
    managementContent: d.management_content,
  }));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 print:bg-white">
      {/* 印刷用タイトル */}
      <h1 className="text-2xl font-bold mb-6 print:text-black print:mb-4 print:text-center">
        管理指導記録簿
      </h1>
      {/* 枠組み本体 */}
      <div className="w-full max-w-5xl print:max-w-full print:shadow-none print:border-none">
        <ManagementGuidanceRecordSheet compareData={compareData} />
      </div>
    </div>
  );
}
