"use client";
import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, TrendingUp, User, Heart, Eye } from "lucide-react";

/**
 * 管理指導記録簿の枠組みUI（リッチデザイン版）
 */
/** oral_function_examの件数分だけ列を動的に描画する */

const oralFunctionItems = [
  {
    id: 1,
    name: "栄養・体重",
    icon: Heart,
    color: "bg-gray-100 text-gray-700",
  },
  { id: 2, name: "口腔衛生", icon: Eye, color: "bg-gray-100 text-gray-700" },
  {
    id: 3,
    name: "口腔乾燥",
    icon: FileText,
    color: "bg-gray-100 text-gray-700",
  },
  {
    id: 4,
    name: "咬合・義歯",
    icon: TrendingUp,
    color: "bg-gray-100 text-gray-700",
  },
  { id: 5, name: "口腔機能", icon: User, color: "bg-gray-100 text-gray-700" },
  { id: 6, name: "舌機能", icon: Calendar, color: "bg-gray-100 text-gray-700" },
  {
    id: 7,
    name: "咀嚼機能",
    icon: FileText,
    color: "bg-gray-100 text-gray-700",
  },
];

const observationItems = [
  { id: 1, name: "全身状態", color: "bg-gray-100 text-gray-700" },
  { id: 2, name: "口腔機能", color: "bg-gray-100 text-gray-700" },
  { id: 3, name: "その他", color: "bg-gray-100 text-gray-700" },
];

export const ManagementGuidanceRecordSheet = ({
  compareData,
}: {
  compareData: any;
}) => {
  // 評価値→ラベル変換
  const evalLabel = (v: number) =>
    v === 1 ? "改善" : v === 2 ? "著変なし" : v === 3 ? "悪化" : "";

  // 所見・管理内容フォームの状態管理
  const [formState, setFormState] = useState<{
    [examId: string]: {
      generalCondition: string;
      oralFunction: string;
      other: string;
      managementContent: string;
    };
  }>(() => {
    // 初期値: compareDataから生成
    const initial: {
      [examId: string]: {
        generalCondition: string;
        oralFunction: string;
        other: string;
        managementContent: string;
      };
    } = {};
    (compareData || []).forEach((d: any) => {
      console.log("d", d);
      initial[d.id] = {
        generalCondition: d.exam.general_condition_note || "",
        oralFunction: d.exam.oral_function_note || "",
        other: d.exam.other_note || "",
        managementContent: d.exam.management_content_note || "",
      };
    });
    return initial;
  });

  const handleChange = (
    examId: string,
    field: "generalCondition" | "oralFunction" | "other" | "managementContent",
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [examId]: { ...prev[examId], [field]: value },
    }));
  };

  // 保存ボタン押下時のAPI Route呼び出し
  const handleSave = async (examId: string) => {
    const { generalCondition, oralFunction, other, managementContent } =
      formState[examId] || {};
    const res = await fetch("/api/management-guidance-record", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: examId,
        general_condition_note: generalCondition,
        oral_function_note: oralFunction,
        other_note: other,
        management_content_note: managementContent,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert("保存に失敗しました: " + (data.error || res.statusText));
    } else {
      alert("保存しました");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Card className="">
        <CardHeader className="text-center space-y-4 bg-blue-50 rounded-t-lg">
          <div className="flex items-start justify-start gap-3">
            <CardTitle className="text-3xl font-bold tracking-wide">
              管理指導記録簿
            </CardTitle>
          </div>
          <div className="flex items-center justify-start gap-2 ">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">
              評価（1：改善　2：著変なし　3：悪化）
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-lg">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th
                    className="border border-slate-200 p-4 font-bold text-slate-700"
                    rowSpan={3}
                    style={{ minWidth: 80 }}
                  >
                    <div className="writing-vertical text-center">状態区分</div>
                  </th>
                  <th
                    className="border border-slate-200 p-4 font-bold text-slate-700"
                    rowSpan={3}
                    style={{ minWidth: 150 }}
                  >
                    評価項目
                  </th>
                  <th
                    className="border border-slate-200 p-4 font-bold text-slate-700 bg-gray-200"
                    colSpan={compareData.length}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      評価記録
                    </div>
                  </th>
                </tr>
                <tr className="bg-slate-50">
                  {compareData.map((d: any, i: number) => (
                    <th
                      key={i}
                      className="border border-slate-200 p-3 bg-gray-100"
                    >
                      <Badge variant="outline" className="text-xs">
                        {`評価${i + 1}`}
                      </Badge>
                    </th>
                  ))}
                </tr>
                <tr className="bg-white">
                  {compareData.map((d: any, i: number) => (
                    <th
                      key={i}
                      className="border border-slate-200 p-2 text-xs font-medium text-slate-600 bg-slate-50"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-700">{`評価${
                          i + 1
                        }`}</div>
                        <div className="text-xs text-slate-500">
                          {(() => {
                            const dateObj =
                              d && d.date ? new Date(d.date) : null;
                            return (
                              <div>
                                年: {dateObj ? dateObj.getFullYear() : "_____"}{" "}
                                月: {dateObj ? dateObj.getMonth() + 1 : "_____"}{" "}
                                日: {dateObj ? dateObj.getDate() : "_____"}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* 口腔機能の状態 */}
                {oralFunctionItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    {index === 0 && (
                      <td
                        className="border border-slate-200 p-4 font-bold text-slate-700 bg-gray-100"
                        rowSpan={7}
                        style={{ minWidth: 80, writingMode: "vertical-rl" }}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Heart className="w-5 h-5 text-gray-600" />
                          <span>口腔機能の状態</span>
                        </div>
                      </td>
                    )}
                    <td className="border border-slate-200 p-3">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                        >
                          {item.id}
                        </Badge>
                        <div className={`p-2 rounded-lg ${item.color}`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-700">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    {compareData.map((d: any, i: number) => {
                      // oralFunctionItemsのnameとcompareDataのkeyのマッピング
                      const scoreKeyMap: { [key: string]: string } = {
                        "栄養・体重": "bitingForce",
                        口腔衛生: "oralHygiene",
                        口腔乾燥: "oralDryness",
                        "咬合・義歯": "bitingForce",
                        口腔機能: "swallowingFunction",
                        舌機能: "tongueMotor",
                        咀嚼機能: "chewingFunction",
                      };
                      const scoreKey = scoreKeyMap[item.name] || "";
                      const value =
                        d && typeof d[scoreKey] === "number"
                          ? d[scoreKey]
                          : "_____";
                      return (
                        <td
                          key={i}
                          className="border border-slate-200 p-3 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <div className="w-full h-8 rounded border-2 border-dashed border-slate-300 hover:border-gray-400 transition-colors duration-150 flex items-center justify-center">
                            評価:{" "}
                            {typeof value === "number"
                              ? `${value} ${evalLabel(value)}`
                              : "_____"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* 所見 */}
                {observationItems.map((item, index) => (
                  <tr
                    key={`obs-${item.id}`}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    {index === 0 && (
                      <td
                        className="border border-slate-200 p-4 font-bold text-slate-700 bg-gray-100"
                        rowSpan={3}
                        style={{ minWidth: 80, writingMode: "vertical-rl" }}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Eye className="w-5 h-5 text-gray-600" />
                          <span>所見</span>
                        </div>
                      </td>
                    )}
                    <td className="border border-slate-200 p-3">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                        >
                          {item.id}
                        </Badge>
                        <div className={`p-2 rounded-lg ${item.color}`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-700">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    {compareData.map((d: any, i: number) => {
                      const examId = d && d.id;
                      // 各所見項目ごとにフォームフィールド名を決定
                      let field: "generalCondition" | "oralFunction" | "other";
                      if (item.name === "全身状態") field = "generalCondition";
                      else if (item.name === "口腔機能") field = "oralFunction";
                      else field = "other";
                      return (
                        <td
                          key={i}
                          className="border border-slate-200 p-3 hover:bg-gray-50 transition-colors duration-150"
                        >
                          {examId ? (
                            <textarea
                              className="w-full h-10 rounded border border-slate-300 p-1 text-xs"
                              value={formState[examId]?.[field] || ""}
                              onChange={(e) =>
                                handleChange(examId, field, e.target.value)
                              }
                              placeholder={`${item.name}を入力`}
                            />
                          ) : (
                            <div className="w-full h-10 rounded border-2 border-dashed border-slate-300"></div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* 管理内容 */}
                <tr className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <td
                    className="border border-slate-200 p-4 font-bold text-slate-700 bg-gray-200"
                    colSpan={2}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-300 text-gray-800">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-semibold">管理内容</span>
                    </div>
                  </td>
                  {compareData.map((d: any, i: number) => {
                    const examId = d && d.id;
                    return (
                      <td
                        key={i}
                        className="border border-slate-200 p-3 hover:bg-gray-50 transition-colors duration-150"
                      >
                        {examId ? (
                          <div className="flex flex-col gap-1">
                            <textarea
                              className="w-full h-10 rounded border border-slate-300 p-1 text-xs"
                              value={formState[examId]?.managementContent || ""}
                              onChange={(e) =>
                                handleChange(
                                  examId,
                                  "managementContent",
                                  e.target.value
                                )
                              }
                              placeholder="管理内容を入力"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-12 rounded border-2 border-dashed border-slate-300"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* 一括保存ボタン */}
          <div className="flex justify-end mt-6">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition"
              onClick={async () => {
                // 一括保存ロジック
                const updates = Object.entries(formState).map(
                  ([examId, values]) => ({
                    id: examId,
                    general_condition_note: values.generalCondition,
                    oral_function_note: values.oralFunction,
                    other_note: values.other,
                    management_content_note: values.managementContent,
                  })
                );
                let success = true;
                let errorMsg = "";
                for (const update of updates) {
                  const res = await fetch("/api/management-guidance-record", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(update),
                  });
                  if (!res.ok) {
                    success = false;
                    const data = await res.json().catch(() => ({}));
                    errorMsg = data.error || res.statusText;
                    break;
                  }
                }
                if (success) {
                  alert("全て保存しました");
                } else {
                  alert("保存に失敗しました: " + errorMsg);
                }
              }}
              type="button"
            >
              一括保存
            </button>
          </div>

          {/* フッター情報 */}
          <div className="mt-8 p-6 bg-gray-100 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>
                  記録作成日: {new Date().toLocaleDateString("ja-JP")}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  デジタル記録簿
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagementGuidanceRecordSheet;
