import React from "react";
import ManagementGuidanceRecordSheet from "@/components/ManagementGuidanceRecordSheet";

/**
 * 管理指導記録簿 印刷専用ページ
 * - 既存の枠組みと同じレイアウト
 * - 印刷時に余計なUIが出ないようにする
 */
export default function ManagementGuidanceRecordPrintPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 print:bg-white">
      {/* 印刷用タイトル */}
      <h1 className="text-2xl font-bold mb-6 print:text-black print:mb-4 print:text-center">
        管理指導記録簿
      </h1>
      {/* 枠組み本体 */}
      <div className="w-full max-w-5xl print:max-w-full print:shadow-none print:border-none">
        <ManagementGuidanceRecordSheet />
      </div>
    </div>
  );
}
