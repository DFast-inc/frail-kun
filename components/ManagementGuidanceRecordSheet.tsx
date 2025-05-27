import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, TrendingUp, User, Heart, Eye } from "lucide-react"

/**
 * 管理指導記録簿の枠組みUI（リッチデザイン版）
 */
const evaluationHeaders = ["評価期間1", "評価期間2", "評価期間3", "評価期間4"]

const oralFunctionItems = [
  { id: 1, name: "栄養・体重", icon: Heart, color: "bg-gray-100 text-gray-700" },
  { id: 2, name: "口腔衛生", icon: Eye, color: "bg-gray-100 text-gray-700" },
  { id: 3, name: "口腔乾燥", icon: FileText, color: "bg-gray-100 text-gray-700" },
  { id: 4, name: "咬合・義歯", icon: TrendingUp, color: "bg-gray-100 text-gray-700" },
  { id: 5, name: "口腔機能", icon: User, color: "bg-gray-100 text-gray-700" },
  { id: 6, name: "舌機能", icon: Calendar, color: "bg-gray-100 text-gray-700" },
  { id: 7, name: "咀嚼機能", icon: FileText, color: "bg-gray-100 text-gray-700" },
]

const observationItems = [
  { id: 1, name: "全身状態", color: "bg-gray-100 text-gray-700" },
  { id: 2, name: "口腔機能", color: "bg-gray-100 text-gray-700" },
  { id: 3, name: "その他", color: "bg-gray-100 text-gray-700" },
]

export const ManagementGuidanceRecordSheet = ({compareData}:{compareData:any}) => {

  // 評価値→ラベル変換
  const evalLabel = (v: number) => v === 1 ? "改善" : v === 2 ? "著変なし" : v === 3 ? "悪化" : "";

  console.log("ManagementGuidanceRecordSheet exam:", compareData)


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-7xl mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 bg-gray-800 text-white rounded-t-lg">
          <div className="flex items-center justify-center gap-3">
            <FileText className="w-8 h-8" />
            <CardTitle className="text-3xl font-bold tracking-wide">管理指導記録簿</CardTitle>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">評価（1：改善　2：著変なし　3：悪化）</span>
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
                    colSpan={evaluationHeaders.length}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      評価記録
                    </div>
                  </th>
                </tr>
                <tr className="bg-slate-50">
                  {evaluationHeaders.map((label, i) => (
                    <th key={i} className="border border-slate-200 p-3 bg-gray-100">
                      <Badge variant="outline" className="text-xs">
                        {label}
                      </Badge>
                    </th>
                  ))}
                </tr>
                <tr className="bg-white">
                  {evaluationHeaders.map((label, i) => (
                    <th key={i} className="border border-slate-200 p-2 text-xs font-medium text-slate-600 bg-slate-50">
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-700">{label}</div>
                        <div className="text-xs text-slate-500">
                          {(() => {
                            const d = compareData && compareData[i] && compareData[i].date ? new Date(compareData[i].date) : null;
                            return (
                              <div>
                                年: {d ? d.getFullYear() : "_____"} 月: {d ? d.getMonth() + 1 : "_____"} 日: {d ? d.getDate() : "_____"}
                                <div className="mt-1">
                                  評価: {compareData && compareData[i] && typeof compareData[i].bitingForce === "number"
                                    ? `${compareData[i].bitingForce} ${evalLabel(compareData[i].bitingForce)}`
                                    : "_____"}
                                </div>
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
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
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
                        <span className="font-medium text-slate-700">{item.name}</span>
                      </div>
                    </td>
                    {Array(evaluationHeaders.length)
                      .fill(null)
                      .map((_, i) => {
                        // oralFunctionItemsのnameとcompareDataのkeyのマッピング
                        const scoreKeyMap: { [key: string]: string } = {
                          "栄養・体重": "bitingForce",
                          "口腔衛生": "oralHygiene",
                          "口腔乾燥": "oralDryness",
                          "咬合・義歯": "bitingForce",
                          "口腔機能": "swallowingFunction",
                          "舌機能": "tongueMotor",
                          "咀嚼機能": "chewingFunction",
                        };
                        const scoreKey = scoreKeyMap[item.name] || "";
                        const value = compareData && compareData[i] && typeof compareData[i][scoreKey] === "number" ? compareData[i][scoreKey] : "_____";
                        return (
                          <td
                            key={i}
                            className="border border-slate-200 p-3 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="w-full h-8 rounded border-2 border-dashed border-slate-300 hover:border-gray-400 transition-colors duration-150 flex items-center justify-center">
                              評価: {typeof value === "number" ? `${value} ${evalLabel(value)}` : "_____"}
                            </div>
                          </td>
                        );
                      })}
                  </tr>
                ))}

                {/* 所見 */}
                {observationItems.map((item, index) => (
                  <tr key={`obs-${item.id}`} className="hover:bg-gray-50 transition-colors duration-200">
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
                        <span className="font-medium text-slate-700">{item.name}</span>
                      </div>
                    </td>
                    {Array(evaluationHeaders.length)
                      .fill(null)
                      .map((_, i) => (
                        <td
                          key={i}
                          className="border border-slate-200 p-3 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <div className="w-full h-8 rounded border-2 border-dashed border-slate-300 hover:border-gray-400 transition-colors duration-150"></div>
                        </td>
                      ))}
                  </tr>
                ))}

                {/* 管理内容 */}
                <tr className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <td className="border border-slate-200 p-4 font-bold text-slate-700 bg-gray-200" colSpan={2}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-300 text-gray-800">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-semibold">管理内容</span>
                    </div>
                  </td>
                  {Array(evaluationHeaders.length)
                    .fill(null)
                    .map((_, i) => (
                      <td
                        key={i}
                        className="border border-slate-200 p-3 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="w-full h-12 rounded border-2 border-dashed border-slate-300 hover:border-gray-400 transition-colors duration-150"></div>
                      </td>
                    ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* フッター情報 */}
          <div className="mt-8 p-6 bg-gray-100 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>記録作成日: {new Date().toLocaleDateString("ja-JP")}</span>
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
  )
}

export default ManagementGuidanceRecordSheet
