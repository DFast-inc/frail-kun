"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  updateOralFunctionExam,
  fetchOralFunctionExam,
  fetchPatientData,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditExaminationPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = Array.isArray(params?.patientId)
    ? params.patientId[0]
    : params?.patientId || "";
  const oralFunctionAssessmentId = Array.isArray(
    params?.oralFunctionAssessmentId
  )
    ? params.oralFunctionAssessmentId[0]
    : params?.oralFunctionAssessmentId || "";

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [openSheet, setOpenSheet] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any>(null);

  // 既存データ取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await fetchOralFunctionExam(oralFunctionAssessmentId);
      if (result.error || !result.data) {
        toast({
          title: "データ取得エラー",
          description: "検査データの取得に失敗しました",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      const data = result.data;

      // 患者データ取得
      const patientResult = await fetchPatientData(data.patient_id);
      let patient =
        patientResult && !patientResult.error ? patientResult.data : null;

      setPatientData(
        patient
          ? {
              id: patient.id,
              name: patient.name || `患者ID: ${patient.id}の患者`,
              age: patient.birthday
                ? new Date().getFullYear() -
                  new Date(patient.birthday).getFullYear()
                : "",
              gender:
                patient.gender === "male"
                  ? "男性"
                  : patient.gender === "female"
                  ? "女性"
                  : patient.gender || "",
            }
          : {
              id: patientId,
              name: `患者ID: ${patientId}の患者`,
              age: "",
              gender: "",
            }
      );

      setFormData({
        oralHygiene: {
          tongueFrontLeft: String(data.tongue_front_left ?? "0"),
          tongueFrontCenter: String(data.tongue_front_center ?? "0"),
          tongueFrontRight: String(data.tongue_front_right ?? "0"),
          tongueMiddleLeft: String(data.tongue_middle_left ?? "0"),
          tongueMiddleCenter: String(data.tongue_middle_center ?? "0"),
          tongueMiddleRight: String(data.tongue_middle_right ?? "0"),
          tongueBackLeft: String(data.tongue_back_left ?? "0"),
          tongueBackCenter: String(data.tongue_back_center ?? "0"),
          tongueBackRight: String(data.tongue_back_right ?? "0"),
          plaqueControl: data.plaque_control ?? "",
          notes: data.oral_hygiene_notes ?? "",
        },
        oralDryness: {
          evaluationMethod: data.oral_dryness_method ?? "method1",
          mucusValue:
            data.mucus_value !== null && data.mucus_value !== undefined
              ? String(data.mucus_value)
              : "",
          gauzeWeight:
            data.gauze_weight !== null && data.gauze_weight !== undefined
              ? String(data.gauze_weight)
              : "",
          notes: data.oral_dryness_notes ?? "",
        },
        bitingForce: {
          evaluationMethod: data.biting_force_method ?? "method1",
          pressureScaleType: data.pressure_scale_type ?? "pressScale2",
          useFilter: data.use_filter ?? "noFilter",
          occlusionForce:
            data.occlusion_force !== null && data.occlusion_force !== undefined
              ? String(data.occlusion_force)
              : "",
          remainingTeeth:
            data.remaining_teeth !== null && data.remaining_teeth !== undefined
              ? String(data.remaining_teeth)
              : "",
          notes: data.biting_force_notes ?? "",
        },
        tongueMovement: {
          paSound:
            data.pa_sound !== null && data.pa_sound !== undefined
              ? String(data.pa_sound)
              : "",
          taSound:
            data.ta_sound !== null && data.ta_sound !== undefined
              ? String(data.ta_sound)
              : "",
          kaSound:
            data.ka_sound !== null && data.ka_sound !== undefined
              ? String(data.ka_sound)
              : "",
          notes: data.tongue_movement_notes ?? "",
        },
        tonguePressure: {
          value:
            data.tongue_pressure_value !== null &&
            data.tongue_pressure_value !== undefined
              ? String(data.tongue_pressure_value)
              : "",
          notes: data.tongue_pressure_notes ?? "",
        },
        chewingFunction: {
          evaluationMethod: data.chewing_function_method ?? "method1",
          glucoseConcentration:
            data.glucose_concentration !== null &&
            data.glucose_concentration !== undefined
              ? String(data.glucose_concentration)
              : "",
          masticatoryScore:
            data.masticatory_score !== null &&
            data.masticatory_score !== undefined
              ? String(data.masticatory_score)
              : "",
          notes: data.chewing_function_notes ?? "",
        },
        swallowingFunction: {
          evaluationMethod: data.swallowing_function_method ?? "eat10",
          eat10Score:
            data.eat10_score !== null && data.eat10_score !== undefined
              ? String(data.eat10_score)
              : "",
          seireiScore:
            data.seirei_score !== null && data.seirei_score !== undefined
              ? String(data.seirei_score)
              : "",
          notes: data.swallowing_function_notes ?? "",
        },
      });
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oralFunctionAssessmentId]);

  const handleChange = (category: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateOralFunctionExam(
      formData,
      oralFunctionAssessmentId
    );
    setLoading(false);
    if (result.error) {
      toast({
        title: "保存エラー",
        description: "Supabaseへの保存に失敗しました",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "検査記録を更新しました",
      description: `${
        patientData?.name || ""
      }さんの検査データがSupabaseに保存されました`,
    });

    // 検査結果詳細ページへリダイレクト
    router.push(
      `/patients/${patientId}/examinations/oral-function-assessment/${oralFunctionAssessmentId}`
    );
  };

  if (loading || !formData) {
    return <div className="p-8 text-xl">データを読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">口腔機能低下症検査（編集）</h1>
          <p className="text-xl text-muted-foreground mt-2">
            患者: {patientData?.name} ({patientData?.age}歳・
            {patientData?.gender})
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => router.push(`/patients/${patientId}`)}
            variant="outline"
            size="lg"
            className="text-lg py-6 px-6"
          >
            患者詳細に戻る
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="oralHygiene" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-4">
            <TabsTrigger value="oralHygiene">口腔衛生状態</TabsTrigger>
            <TabsTrigger value="oralDryness">口腔乾燥</TabsTrigger>
            <TabsTrigger value="bitingForce">咬合力</TabsTrigger>
            <TabsTrigger value="tongueMovement">舌口唇運動</TabsTrigger>
            <TabsTrigger value="tonguePressure">舌圧</TabsTrigger>
            <TabsTrigger value="chewingFunction">咀嚼機能</TabsTrigger>
            <TabsTrigger value="swallowingFunction">嚥下機能</TabsTrigger>
          </TabsList>

          {/* 口腔衛生状態 */}
          <TabsContent value="oralHygiene">
            <Card className="border-2">
              <CardHeader className="bg-blue-100 rounded-t-lg flex flex-row justify-between items-center">
                <CardTitle className="text-2xl">口腔衛生状態の評価</CardTitle>
                <Sheet
                  open={openSheet === "oralHygiene"}
                  onOpenChange={(open) =>
                    setOpenSheet(open ? "oralHygiene" : null)
                  }
                >
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="text-base">
                      やり方を見る
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="!w-1/2 !max-w-none !min-w-none overflow-y-auto">
                    <SheetHeader className="mb-5">
                      <SheetTitle className="text-2xl">
                        口腔衛生状態の評価（TCI）
                      </SheetTitle>
                      <SheetDescription>
                        口腔衛生状態を正確に評価するための手順を説明します
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold">
                          検査に必要な準備物
                        </h4>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-lg">
                          <li>
                            口腔内ライトまたはヘッドランプ（明るさが十分なもの）
                          </li>
                          <li>舌圧子または清潔なスパチュラ</li>
                          <li>使い捨て手袋</li>
                          <li>記録用紙またはチェックシート</li>
                          <li>鏡（必要に応じて患者が自身で確認する場合）</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold">
                          検査前の確認事項
                        </h4>
                        <ol className="list-decimal list-inside ml-4 space-y-2 text-lg">
                          <li>
                            <span className="font-medium">被検者へ説明：</span>{" "}
                            「舌の清潔度（舌苔の付き具合）を見て、口の清掃状態を確認します。痛みなどはありませんのでご安心ください。」
                          </li>
                          <li>
                            <span className="font-medium">
                              食事・歯磨きの時間確認：
                            </span>{" "}
                            直前の食事や清掃で舌苔が除去されていないか確認（検査前2時間程度は避けるのが望ましい）。
                          </li>
                          <li>
                            <span className="font-medium">手指衛生：</span>{" "}
                            検査者は手洗い・手指消毒を行い、清潔な手袋を装着する。
                          </li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold">検査手順</h4>
                        <div className="space-y-4 ml-4">
                          <div>
                            <p className="font-medium">
                              Step 1：舌の観察部位の確認
                            </p>
                            <p className="text-lg">
                              舌背（舌の上の面）を前方・中央・後方の3分割に分ける。それぞれをさらに左右に分けて、合計6ブロックとして評価を行う。
                            </p>
                            <ul className="list-disc list-inside ml-4 text-lg">
                              <li>前方（舌尖部）</li>
                              <li>中央（中間部）</li>
                              <li>後方（舌根部）</li>
                            </ul>
                            <p className="text-lg">
                              左右に分けることで、舌の左前・右前・左中・右中・左後・右後の6つの領域が対象となります。
                            </p>
                          </div>

                          <div>
                            <p className="font-medium">
                              Step 2：舌の状態を確認
                            </p>
                            <ol className="list-decimal list-inside ml-4 text-lg">
                              <li>
                                「アー」と声を出してもらい、口を大きく開ける。明るいライトで舌全体を明るく照らす。
                              </li>
                              <li>
                                必要に応じて舌圧子で舌を軽く押さえるか前方に出してもらう。奥まで観察しやすくする。
                              </li>
                            </ol>
                          </div>

                          <div>
                            <p className="font-medium">
                              Step 3：各ブロックごとの舌苔の付着程度を評価
                            </p>
                            <p className="text-lg">
                              それぞれの6ブロックについて、下記の基準に従って評価をつける：
                            </p>
                            <ul className="list-disc list-inside ml-4 text-lg">
                              <li>
                                <span className="font-medium">0点</span>
                                ：舌苔なし（またはほとんどなし）
                              </li>
                              <li>
                                <span className="font-medium">1点</span>
                                ：舌苔が部分的に付着
                              </li>
                              <li>
                                <span className="font-medium">2点</span>
                                ：舌苔が広範囲に明らかに付着
                              </li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-medium">
                              Step 4：スコア集計とTCIの計算
                            </p>
                            <ul className="list-disc list-inside ml-4 text-lg">
                              <li>各ブロックのスコアを合計（最大12点）</li>
                              <li>
                                <span className="font-medium">
                                  TCI (%) ＝（合計スコア ÷ 最大スコア12）× 100
                                </span>
                              </li>
                            </ul>
                            <p className="text-lg ml-4">
                              例：合計スコアが6点 → TCI＝(6÷12)×100＝50%
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold">
                          結果の判定基準（参考）
                        </h4>
                        <ul className="list-disc list-inside ml-4 space-y-2 text-lg">
                          <li>
                            <span className="font-medium">TCIが50%以上</span>
                            ：舌苔が顕著であり、口腔衛生状態の低下を示唆 →
                            口腔機能低下症の要因として該当の可能性あり
                          </li>
                          <li>
                            <span className="font-medium">TCIが50%未満</span>
                            ：正常範囲の可能性が高い
                          </li>
                        </ul>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                        <h4 className="text-lg font-semibold">注意点</h4>
                        <ul className="list-disc list-inside ml-4 space-y-2 text-lg">
                          <li>
                            舌苔は個人差・体調・口腔習慣で日々変動するため、1回だけで判断せず経時的観察も重要です。
                          </li>
                          <li>
                            抗菌薬使用や口腔乾燥症のある患者では舌苔が過剰・過少になることがあるため、総合的に評価します。
                          </li>
                          <li>
                            高齢者や認知機能に問題のある患者の場合、しっかりと口を開けてもらうために介助が必要なことがあります。
                          </li>
                        </ul>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 bg-white">
                {/* 検査結果入力フォーム */}
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">検査結果入力</h3>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-lg">舌苔指数評価（0～18点）</Label>
                      <p className="text-muted-foreground">
                        舌の前方・中央・後方の各部位をさらに左・中央・右の3箇所に分け、合計9箇所を0～2点で評価します。
                        TCI(舌苔指数スコア)=合計スコア/18×100
                      </p>

                      <div className="mt-6 space-y-6">
                        {/* 舌前方部 */}
                        <div className="space-y-2">
                          <h4 className="text-lg font-medium">舌前方部</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 border p-4 rounded-lg">
                              <Label
                                htmlFor="tongueFrontLeft"
                                className="text-lg"
                              >
                                左側
                              </Label>
                              <RadioGroup
                                value={
                                  formData.oralHygiene.tongueFrontLeft || "0"
                                }
                                onValueChange={(value) =>
                                  handleChange(
                                    "oralHygiene",
                                    "tongueFrontLeft",
                                    value
                                  )
                                }
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="0"
                                    id="tongueFrontLeft-0"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueFrontLeft-0"
                                    className="text-lg"
                                  >
                                    0
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1"
                                    id="tongueFrontLeft-1"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueFrontLeft-1"
                                    className="text-lg"
                                  >
                                    1
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="2"
                                    id="tongueFrontLeft-2"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueFrontLeft-2"
                                    className="text-lg"
                                  >
                                    2
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="space-y-2 border p-4 rounded-lg">
                              <Label
                                htmlFor="tongueFrontCenter"
                                className="text-lg"
                              >
                                中央
                              </Label>
                              <RadioGroup
                                value={
                                  formData.oralHygiene.tongueFrontCenter || "0"
                                }
                                onValueChange={(value) =>
                                  handleChange(
                                    "oralHygiene",
                                    "tongueFrontCenter",
                                    value
                                  )
                                }
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="0"
                                    id="tongueFrontCenter-0"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueFrontCenter-0"
                                    className="text-lg"
                                  >
                                    0
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1"
                                    id="tongueFrontCenter-1"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueFrontCenter-1"
                                    className="text-lg"
                                  >
                                    1
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="2"
                                    id="tongueFrontCenter-2"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueFrontCenter-2"
                                    className="text-lg"
                                  >
                                    2
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="space-y-2 border p-4 rounded-lg">
                              <Label
                                htmlFor="tongueFrontRight"
                                className="text-lg"
                              >
                                右側
                              </Label>
                              <RadioGroup
                                value={
                                  formData.oralHygiene.tongueFrontRight || "0"
                                }
                                onValueChange={(value) =>
                                  handleChange(
                                    "oralHygiene",
                                    "tongueFrontRight",
                                    value
                                  )
                                }
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="0"
                                    id="tongueFrontRight-0"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueFrontRight-0"
                                    className="text-lg"
                                  >
                                    0
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1"
                                    id="tongueFrontRight-1"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueFrontRight-1"
                                    className="text-lg"
                                  >
                                    1
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="2"
                                    id="tongueFrontRight-2"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueFrontRight-2"
                                    className="text-lg"
                                  >
                                    2
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </div>

                        {/* 舌中央部 */}
                        <div className="space-y-2">
                          <h4 className="text-lg font-medium">舌中央部</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 border p-4 rounded-lg">
                              <Label
                                htmlFor="tongueMiddleLeft"
                                className="text-lg"
                              >
                                左側
                              </Label>
                              <RadioGroup
                                value={
                                  formData.oralHygiene.tongueMiddleLeft || "0"
                                }
                                onValueChange={(value) =>
                                  handleChange(
                                    "oralHygiene",
                                    "tongueMiddleLeft",
                                    value
                                  )
                                }
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="0"
                                    id="tongueMiddleLeft-0"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueMiddleLeft-0"
                                    className="text-lg"
                                  >
                                    0
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1"
                                    id="tongueMiddleLeft-1"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueMiddleLeft-1"
                                    className="text-lg"
                                  >
                                    1
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="2"
                                    id="tongueMiddleLeft-2"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueMiddleLeft-2"
                                    className="text-lg"
                                  >
                                    2
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="space-y-2 border p-4 rounded-lg">
                              <Label
                                htmlFor="tongueMiddleCenter"
                                className="text-lg"
                              >
                                中央
                              </Label>
                              <RadioGroup
                                value={
                                  formData.oralHygiene.tongueMiddleCenter || "0"
                                }
                                onValueChange={(value) =>
                                  handleChange(
                                    "oralHygiene",
                                    "tongueMiddleCenter",
                                    value
                                  )
                                }
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="0"
                                    id="tongueMiddleCenter-0"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueMiddleCenter-0"
                                    className="text-lg"
                                  >
                                    0
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1"
                                    id="tongueMiddleCenter-1"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueMiddleCenter-1"
                                    className="text-lg"
                                  >
                                    1
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="2"
                                    id="tongueMiddleCenter-2"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueMiddleCenter-2"
                                    className="text-lg"
                                  >
                                    2
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="space-y-2 border p-4 rounded-lg">
                              <Label
                                htmlFor="tongueMiddleRight"
                                className="text-lg"
                              >
                                右側
                              </Label>
                              <RadioGroup
                                value={
                                  formData.oralHygiene.tongueMiddleRight || "0"
                                }
                                onValueChange={(value) =>
                                  handleChange(
                                    "oralHygiene",
                                    "tongueMiddleRight",
                                    value
                                  )
                                }
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="0"
                                    id="tongueMiddleRight-0"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueMiddleRight-0"
                                    className="text-lg"
                                  >
                                    0
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1"
                                    id="tongueMiddleRight-1"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueMiddleRight-1"
                                    className="text-lg"
                                  >
                                    1
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="2"
                                    id="tongueMiddleRight-2"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueMiddleRight-2"
                                    className="text-lg"
                                  >
                                    2
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </div>

                        {/* 舌後方部 */}
                        <div className="space-y-2">
                          <h4 className="text-lg font-medium">舌後方部</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 border p-4 rounded-lg">
                              <Label
                                htmlFor="tongueBackLeft"
                                className="text-lg"
                              >
                                左側
                              </Label>
                              <RadioGroup
                                value={
                                  formData.oralHygiene.tongueBackLeft || "0"
                                }
                                onValueChange={(value) =>
                                  handleChange(
                                    "oralHygiene",
                                    "tongueBackLeft",
                                    value
                                  )
                                }
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="0"
                                    id="tongueBackLeft-0"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueBackLeft-0"
                                    className="text-lg"
                                  >
                                    0
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1"
                                    id="tongueBackLeft-1"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueBackLeft-1"
                                    className="text-lg"
                                  >
                                    1
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="2"
                                    id="tongueBackLeft-2"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueBackLeft-2"
                                    className="text-lg"
                                  >
                                    2
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="space-y-2 border p-4 rounded-lg">
                              <Label
                                htmlFor="tongueBackCenter"
                                className="text-lg"
                              >
                                中央
                              </Label>
                              <RadioGroup
                                value={
                                  formData.oralHygiene.tongueBackCenter || "0"
                                }
                                onValueChange={(value) =>
                                  handleChange(
                                    "oralHygiene",
                                    "tongueBackCenter",
                                    value
                                  )
                                }
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="0"
                                    id="tongueBackCenter-0"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueBackCenter-0"
                                    className="text-lg"
                                  >
                                    0
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1"
                                    id="tongueBackCenter-1"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueBackCenter-1"
                                    className="text-lg"
                                  >
                                    1
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="2"
                                    id="tongueBackCenter-2"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueBackCenter-2"
                                    className="text-lg"
                                  >
                                    2
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="space-y-2 border p-4 rounded-lg">
                              <Label
                                htmlFor="tongueBackRight"
                                className="text-lg"
                              >
                                右側
                              </Label>
                              <RadioGroup
                                value={
                                  formData.oralHygiene.tongueBackRight || "0"
                                }
                                onValueChange={(value) =>
                                  handleChange(
                                    "oralHygiene",
                                    "tongueBackRight",
                                    value
                                  )
                                }
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="0"
                                    id="tongueBackRight-0"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueBackRight-0"
                                    className="text-lg"
                                  >
                                    0
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1"
                                    id="tongueBackRight-1"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueBackRight-1"
                                    className="text-lg"
                                  >
                                    1
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="2"
                                    id="tongueBackRight-2"
                                    className="h-5 w-5"
                                  />
                                  <Label
                                    htmlFor="tongueBackRight-2"
                                    className="text-lg"
                                  >
                                    2
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-lg font-medium">
                              合計スコア:{" "}
                              {Number(
                                formData.oralHygiene.tongueFrontLeft || 0
                              ) +
                                Number(
                                  formData.oralHygiene.tongueFrontCenter || 0
                                ) +
                                Number(
                                  formData.oralHygiene.tongueFrontRight || 0
                                ) +
                                Number(
                                  formData.oralHygiene.tongueMiddleLeft || 0
                                ) +
                                Number(
                                  formData.oralHygiene.tongueMiddleCenter || 0
                                ) +
                                Number(
                                  formData.oralHygiene.tongueMiddleRight || 0
                                ) +
                                Number(
                                  formData.oralHygiene.tongueBackLeft || 0
                                ) +
                                Number(
                                  formData.oralHygiene.tongueBackCenter || 0
                                ) +
                                Number(
                                  formData.oralHygiene.tongueBackRight || 0
                                )}
                            </p>
                            <p className="text-lg font-medium">
                              TCI:{" "}
                              {(
                                ((Number(
                                  formData.oralHygiene.tongueFrontLeft || 0
                                ) +
                                  Number(
                                    formData.oralHygiene.tongueFrontCenter || 0
                                  ) +
                                  Number(
                                    formData.oralHygiene.tongueFrontRight || 0
                                  ) +
                                  Number(
                                    formData.oralHygiene.tongueMiddleLeft || 0
                                  ) +
                                  Number(
                                    formData.oralHygiene.tongueMiddleCenter || 0
                                  ) +
                                  Number(
                                    formData.oralHygiene.tongueMiddleRight || 0
                                  ) +
                                  Number(
                                    formData.oralHygiene.tongueBackLeft || 0
                                  ) +
                                  Number(
                                    formData.oralHygiene.tongueBackCenter || 0
                                  ) +
                                  Number(
                                    formData.oralHygiene.tongueBackRight || 0
                                  )) /
                                  18) *
                                100
                              ).toFixed(1)}
                              %
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              ※ TCI ≧ 50 → 低下（✕）、TCI ≦ 50 → 正常（〇）
                            </p>
                          </div>
                          <div className="text-xl font-bold">
                            判定:{" "}
                            {Number(formData.oralHygiene.tongueFrontLeft || 0) +
                              Number(
                                formData.oralHygiene.tongueFrontCenter || 0
                              ) +
                              Number(
                                formData.oralHygiene.tongueFrontRight || 0
                              ) +
                              Number(
                                formData.oralHygiene.tongueMiddleLeft || 0
                              ) +
                              Number(
                                formData.oralHygiene.tongueMiddleCenter || 0
                              ) +
                              Number(
                                formData.oralHygiene.tongueMiddleRight || 0
                              ) +
                              Number(formData.oralHygiene.tongueBackLeft || 0) +
                              Number(
                                formData.oralHygiene.tongueBackCenter || 0
                              ) +
                              Number(
                                formData.oralHygiene.tongueBackRight || 0
                              ) >=
                            18 * (50 / 100) ? (
                              <span className="text-red-500">低下（✕）</span>
                            ) : (
                              <span className="text-green-500">正常（〇）</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 口腔乾燥 */}
          <TabsContent value="oralDryness">
            <Card className="border-2">
              <CardHeader className="bg-blue-100 rounded-t-lg flex flex-row justify-between items-center">
                <CardTitle className="text-2xl">口腔乾燥の評価</CardTitle>
                <Sheet
                  open={openSheet === "oralDryness"}
                  onOpenChange={(open) =>
                    setOpenSheet(open ? "oralDryness" : null)
                  }
                >
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="text-base">
                      やり方を見る
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="!w-1/2 !max-w-none !min-w-none overflow-y-auto">
                    <SheetHeader className="mb-5">
                      <SheetTitle className="text-2xl">
                        口腔乾燥の評価方法
                      </SheetTitle>
                      <SheetDescription>
                        口腔乾燥を正確に評価するための手順を説明します
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold">
                          検査に必要な準備物
                        </h4>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-lg">
                          <li>滅菌ガーゼ（4cm×4cm）2枚</li>
                          <li>精密秤（0.01g単位）</li>
                          <li>タイマー</li>
                          <li>ビニール袋（使用済みガーゼ回収用）</li>
                          <li>使い捨て手袋</li>
                          <li>記録用紙</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold">
                          検査前の確認事項
                        </h4>
                        <ol className="list-decimal list-inside ml-4 space-y-2 text-lg">
                          <li>
                            <span className="font-medium">被検者へ説明：</span>{" "}
                            「ガーゼを噛んでいただき、唾液の量を測ります。痛みや苦しさはありません。」
                          </li>
                          <li>
                            <span className="font-medium">
                              飲食やうがいの影響排除：
                            </span>{" "}
                            検査前30分以内の飲食・歯磨き・うがいは避けてください。
                          </li>
                          <li>
                            <span className="font-medium">
                              安静に測定できる環境を整える：
                            </span>{" "}
                            座位でリラックスできるように配慮します。
                          </li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold">検査手順</h4>
                        <div className="space-y-4 ml-4">
                          <div>
                            <p className="font-medium">
                              Step 1：乾燥ガーゼの測定
                            </p>
                            <ul className="list-disc list-inside ml-4 text-lg">
                              <li>ガーゼ2枚を重ねて1セットとします。</li>
                              <li>
                                精密秤で乾燥前の重さ（W1）を測定・記録します。
                              </li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-medium">
                              Step 2：被検者による咀嚼
                            </p>
                            <ul className="list-disc list-inside ml-4 text-lg">
                              <li>
                                被検者に「口を閉じた状態で、このガーゼを軽く前歯で噛んでください」と指示します。
                              </li>
                              <li>
                                タイマーを5分にセットし、静かに噛んでもらいます。
                              </li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-medium">Step 3：回収と再計量</p>
                            <ul className="list-disc list-inside ml-4 text-lg">
                              <li>
                                終了後、ガーゼをビニール袋に入れ、湿潤後の重さ（W2）を測定します。
                              </li>
                              <li>唾液分泌量（g）＝ W2 − W1</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold">
                          結果の判定基準（参考）
                        </h4>
                        <table className="min-w-full border-collapse border border-gray-300 mt-2">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-4 py-2 text-lg">
                                分泌量（g/5分）
                              </th>
                              <th className="border border-gray-300 px-4 py-2 text-lg">
                                判定
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 text-lg">
                                2.0g以上
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-lg">
                                正常
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 text-lg">
                                1.0～1.9g
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-lg">
                                乾燥傾向あり
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 text-lg">
                                1.0g未満
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-lg">
                                異常（唾液分泌低下）
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                        <p className="text-lg font-medium">注意点</p>
                        <ul className="list-disc list-inside ml-4 text-lg">
                          <li>
                            測定後のガーゼは感染性廃棄物として処理します。
                          </li>
                          <li>
                            測定中に会話や動作があると結果に影響するため、安静を保ちます。
                          </li>
                          <li>
                            精密秤は風や振動のない平らな場所で使用してください。
                          </li>
                        </ul>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 bg-white">
                {/* 検査結果入力フォーム */}
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">検査結果入力</h3>
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <Label className="text-lg">評価方法の選択</Label>
                      <Select
                        value={formData.oralDryness.evaluationMethod}
                        onValueChange={(value) =>
                          handleChange("oralDryness", "evaluationMethod", value)
                        }
                      >
                        <SelectTrigger className="text-lg py-6">
                          <SelectValue placeholder="評価方法を選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="method1" className="text-lg">
                            評価方法１：口腔湿潤度測定器（Mucus等）
                          </SelectItem>
                          <SelectItem value="method2" className="text-lg">
                            評価方法２：唾液量測定（サクソンテスト）
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.oralDryness.evaluationMethod === "method1" ? (
                      <div className="space-y-4 mt-6 p-4 border rounded-lg">
                        <Label htmlFor="mucusValue" className="text-lg">
                          口腔湿潤度測定器の値
                        </Label>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Input
                              id="mucusValue"
                              type="number"
                              step="0.1"
                              value={formData.oralDryness.mucusValue}
                              onChange={(e) =>
                                handleChange(
                                  "oralDryness",
                                  "mucusValue",
                                  e.target.value
                                )
                              }
                              placeholder="例: 28.5"
                              className="text-lg py-6"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg text-muted-foreground">
                              基準値: 27.0以上が正常
                            </p>
                          </div>
                        </div>

                        {formData.oralDryness.mucusValue && (
                          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center">
                              <p className="text-lg font-medium">
                                湿潤度値: {formData.oralDryness.mucusValue}
                              </p>
                              <div className="text-xl font-bold">
                                判定:{" "}
                                {Number(formData.oralDryness.mucusValue) <
                                27.0 ? (
                                  <span className="text-red-500">
                                    低下（✕）
                                  </span>
                                ) : (
                                  <span className="text-green-500">
                                    正常（〇）
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4 mt-6 p-4 border rounded-lg">
                        <Label htmlFor="gauzeWeight" className="text-lg">
                          ガーゼ重量増加量 (g)
                        </Label>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Input
                              id="gauzeWeight"
                              type="number"
                              step="0.1"
                              value={formData.oralDryness.gauzeWeight}
                              onChange={(e) =>
                                handleChange(
                                  "oralDryness",
                                  "gauzeWeight",
                                  e.target.value
                                )
                              }
                              placeholder="例: 2.5"
                              className="text-lg py-6"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg text-muted-foreground">
                              基準値: 2g以上が正常
                            </p>
                          </div>
                        </div>

                        {formData.oralDryness.gauzeWeight && (
                          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center">
                              <p className="text-lg font-medium">
                                ガーゼ重量増加量:{" "}
                                {formData.oralDryness.gauzeWeight}g
                              </p>
                              <div className="text-xl font-bold">
                                判定:{" "}
                                {Number(formData.oralDryness.gauzeWeight) <
                                2 ? (
                                  <span className="text-red-500">
                                    低下（✕）
                                  </span>
                                ) : (
                                  <span className="text-green-500">
                                    正常（〇）
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 他の検査タブも同様に実装... */}
          <TabsContent value="bitingForce">
            <Card className="border-2">
              <CardHeader className="bg-blue-100 rounded-t-lg flex flex-row justify-between items-center">
                <CardTitle className="text-2xl">咬合力の評価</CardTitle>
                <Sheet
                  open={openSheet === "bitingForce"}
                  onOpenChange={(open) =>
                    setOpenSheet(open ? "bitingForce" : null)
                  }
                >
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="text-base">
                      やり方を見る
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="!w-1/2 !max-w-none !min-w-none overflow-y-auto">
                    <SheetHeader className="mb-5">
                      <SheetTitle className="text-2xl">
                        咬合力の評価方法
                      </SheetTitle>
                      <SheetDescription>
                        咬合力を正確に評価するための手順を説明します
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold">
                          検査に必要な準備物
                        </h4>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-lg">
                          <li>感圧フィルム（例：Dental Prescale® 50Hなど）</li>
                          <li>
                            キャリブレーション済みの読み取り装置（デンタルプレスケール分析システムなど）
                          </li>
                          <li>手袋</li>
                          <li>記録用紙またはチェックシート</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold">
                          検査前の確認事項
                        </h4>
                        <ol className="list-decimal list-inside ml-4 space-y-2 text-lg">
                          <li>
                            <span className="font-medium">被検者へ説明：</span>{" "}
                            「専用のフィルムを上下の歯で強く噛んでいただくことで、咬む力を調べます。痛みはありません。」
                          </li>
                          <li>
                            <span className="font-medium">
                              義歯装着者の場合：
                            </span>{" "}
                            常用義歯は装着したまま検査を行います。
                          </li>
                          <li>
                            <span className="font-medium">体調確認：</span>{" "}
                            顎関節症状や顎の痛みがある場合は無理に行わない。
                          </li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold">検査手順</h4>
                        <div className="space-y-4 ml-4">
                          <div>
                            <p className="font-medium">Step 1：準備</p>
                            <ul className="list-disc list-inside ml-4 text-lg">
                              <li>
                                検査者は手指消毒を行い、清潔な手袋を装着します。
                              </li>
                              <li>感圧フィルムを清潔に取り出します。</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-medium">
                              Step 2：フィルムの設置
                            </p>
                            <ul className="list-disc list-inside ml-4 text-lg">
                              <li>
                                被検者に「上下の歯で強く咬む準備をしてください」と伝えます。
                              </li>
                              <li>
                                フィルムを上下の歯列の間に正しく配置します（中央を基準に左右均等になるように）。
                              </li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-medium">Step 3：最大咬合</p>
                            <ul className="list-disc list-inside ml-4 text-lg">
                              <li>
                                「できるだけ強く奥歯で噛み締めてください」と指示します。
                              </li>
                              <li>約3秒間、最大咬合を保持させます。</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-medium">
                              Step 4：フィルムの取り出しと分析
                            </p>
                            <ul className="list-disc list-inside ml-4 text-lg">
                              <li>
                                フィルムを慎重に取り出し、読み取り装置で解析します。
                              </li>
                              <li>
                                解析結果（咬合力：Nまたはkgf単位）を記録します。
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold">
                          結果の判定基準（参考）
                        </h4>
                        <table className="min-w-full border-collapse border border-gray-300 mt-2">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-4 py-2 text-lg">
                                咬合力の合計値
                              </th>
                              <th className="border border-gray-300 px-4 py-2 text-lg">
                                判定
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 text-lg">
                                200N以上
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-lg">
                                正常
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 text-lg">
                                200N未満
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-lg">
                                咬合力低下の疑い
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p className="text-lg mt-2">
                          ※200Nはおおよそ20kgfに相当
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold">
                          評価方法２：残存歯数
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-lg font-medium">
                              検査に必要な準備物
                            </h5>
                            <ul className="list-disc list-inside ml-4 space-y-1 text-lg">
                              <li>口腔内診査器具（ミラー、ピンセット）</li>
                              <li>記録用紙またはチェックシート</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-lg font-medium">
                              検査前の確認事項
                            </h5>
                            <ol className="list-decimal list-inside ml-4 space-y-2 text-lg">
                              <li>
                                <span className="font-medium">
                                  被検者へ説明：
                                </span>{" "}
                                「現在残っている歯の本数と、どの歯で咬んでいるかを確認させていただきます。」
                              </li>
                              <li>
                                <span className="font-medium">
                                  義歯装着者の場合：
                                </span>{" "}
                                常用義歯は装着したままで残存歯として評価します（義歯が固定性である場合など）。
                              </li>
                            </ol>
                          </div>

                          <div>
                            <h5 className="text-lg font-medium">検査手順</h5>
                            <div className="space-y-4 ml-4">
                              <div>
                                <p className="font-medium">
                                  Step 1：視診と触診による歯の確認
                                </p>
                                <ul className="list-disc list-inside ml-4 text-lg">
                                  <li>
                                    検査者は手指消毒・手袋装着を行い、口腔内を観察します。
                                  </li>
                                  <li>
                                    歯列全体を確認し、
                                    <strong>
                                      咬合支持可能な歯（対合関係にある歯）
                                    </strong>
                                    の数をカウントします。
                                  </li>
                                </ul>
                              </div>

                              <div>
                                <p className="font-medium">Step 2：記録</p>
                                <ul className="list-disc list-inside ml-4 text-lg">
                                  <li>残存歯の本数を数え、記録します。</li>
                                  <li>
                                    義歯がある場合は、その咬合支持が可能かを判断の上カウントします。
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-lg font-medium">
                              結果の判定基準（参考）
                            </h5>
                            <table className="min-w-full border-collapse border border-gray-300 mt-2">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="border border-gray-300 px-4 py-2 text-lg">
                                    咬合支持歯数
                                  </th>
                                  <th className="border border-gray-300 px-4 py-2 text-lg">
                                    判定
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-gray-300 px-4 py-2 text-lg">
                                    20本以上
                                  </td>
                                  <td className="border border-gray-300 px-4 py-2 text-lg">
                                    咬合力十分
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-300 px-4 py-2 text-lg">
                                    19本以下
                                  </td>
                                  <td className="border border-gray-300 px-4 py-2 text-lg">
                                    咬合力低下の可能性あり
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                            <p className="text-lg font-medium">注意点</p>
                            <ul className="list-disc list-inside ml-4 text-lg">
                              <li>
                                ブリッジやインプラントも機能していれば支持歯としてカウント可
                              </li>
                              <li>
                                動揺歯や機能していない義歯は除外して考える
                              </li>
                              <li>
                                数値はあくまで咬合力の「目安」であり、可能であれば直接的な測定（感圧フィルム）を優先
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                        <p className="text-lg font-medium">注意点</p>
                        <ul className="list-disc list-inside ml-4 text-lg">
                          <li>
                            フィルムの再使用は禁止（正確性と衛生面の確保）
                          </li>
                          <li>
                            咬合力にばらつきが出る場合は2回測定し平均をとってもよい
                          </li>
                          <li>
                            正しい位置にフィルムを置かないと片側優位な結果となるため注意
                          </li>
                          <li>
                            残存歯数を評価する際は、残根と動揺度３の歯を除外してください
                          </li>
                        </ul>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 bg-white">
                {/* 検査結果入力フォーム */}
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">検査結果入力</h3>
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <Label className="text-lg">評価方法の選択</Label>
                      <Select
                        value={formData.bitingForce.evaluationMethod}
                        onValueChange={(value) =>
                          handleChange("bitingForce", "evaluationMethod", value)
                        }
                      >
                        <SelectTrigger className="text-lg py-6">
                          <SelectValue placeholder="評価方法を選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="method1" className="text-lg">
                            評価方法１：感圧フィルムによる咬合力測定
                          </SelectItem>
                          <SelectItem value="method2" className="text-lg">
                            評価方法２：残存歯数
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.bitingForce.evaluationMethod === "method1" ? (
                      <div className="space-y-4 mt-6 p-4 border rounded-lg">
                        <div className="space-y-4">
                          <Label className="text-lg">使用器具の選択</Label>
                          <Select
                            value={formData.bitingForce.pressureScaleType}
                            onValueChange={(value) =>
                              handleChange(
                                "bitingForce",
                                "pressureScaleType",
                                value
                              )
                            }
                          >
                            <SelectTrigger className="text-lg py-6">
                              <SelectValue placeholder="使用器具を選択してください" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value="pressScale2"
                                className="text-lg"
                              >
                                プレスケールⅡ
                              </SelectItem>
                              <SelectItem
                                value="pressScale"
                                className="text-lg"
                              >
                                プレスケール
                              </SelectItem>
                              <SelectItem value="oramo" className="text-lg">
                                Oramo
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* フィルタの使用フォームは"pressScale2"のときだけ絶対に表示 */}
                        {formData.bitingForce.pressureScaleType ===
                          "pressScale2" && (
                          <div className="space-y-4">
                            <Label className="text-lg">フィルタの使用</Label>
                            <Select
                              value={formData.bitingForce.useFilter}
                              onValueChange={(value) =>
                                handleChange("bitingForce", "useFilter", value)
                              }
                            >
                              <SelectTrigger className="text-lg py-6">
                                <SelectValue placeholder="フィルタの使用を選択してください" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  value="noFilter"
                                  className="text-lg"
                                >
                                  フィルタなし
                                </SelectItem>
                                <SelectItem
                                  value="withFilter"
                                  className="text-lg"
                                >
                                  フィルタあり
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="space-y-4">
                          <Label htmlFor="occlusionForce" className="text-lg">
                            咬合力 (N)
                          </Label>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Input
                                id="occlusionForce"
                                type="number"
                                step="1"
                                value={formData.bitingForce.occlusionForce}
                                onChange={(e) =>
                                  handleChange(
                                    "bitingForce",
                                    "occlusionForce",
                                    e.target.value
                                  )
                                }
                                placeholder="例: 400"
                                className="text-lg py-6"
                              />
                            </div>
                            <div className="space-y-2">
                              <p className="text-lg text-muted-foreground">
                                基準値:
                                {formData.bitingForce.pressureScaleType ===
                                "oramo"
                                  ? "375N以上が正常"
                                  : formData.bitingForce.pressureScaleType ===
                                    "pressScale2"
                                  ? formData.bitingForce.useFilter ===
                                    "withFilter"
                                    ? "350N以上が正常"
                                    : "500N以上が正常"
                                  : "200N以上が正常"}
                              </p>
                            </div>
                          </div>

                          {formData.bitingForce.occlusionForce && (
                            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                              <div className="flex justify-between items-center">
                                <p className="text-lg font-medium">
                                  咬合力: {formData.bitingForce.occlusionForce}N
                                </p>
                                <div className="text-xl font-bold">
                                  判定:{" "}
                                  {formData.bitingForce.pressureScaleType ===
                                  "oramo" ? (
                                    Number(
                                      formData.bitingForce.occlusionForce
                                    ) < 375 ? (
                                      <span className="text-red-500">
                                        低下（✕）
                                      </span>
                                    ) : (
                                      <span className="text-green-500">
                                        正常（〇）
                                      </span>
                                    )
                                  ) : formData.bitingForce.pressureScaleType ===
                                    "pressScale2" ? (
                                    formData.bitingForce.useFilter ===
                                    "withFilter" ? (
                                      Number(
                                        formData.bitingForce.occlusionForce
                                      ) < 500 ? (
                                        <span className="text-red-500">
                                          低下（✕）
                                        </span>
                                      ) : (
                                        <span className="text-green-500">
                                          正常（〇）
                                        </span>
                                      )
                                    ) : Number(
                                        formData.bitingForce.occlusionForce
                                      ) < 350 ? (
                                      <span className="text-red-500">
                                        低下（✕）
                                      </span>
                                    ) : (
                                      <span className="text-green-500">
                                        正常（〇）
                                      </span>
                                    )
                                  ) : Number(
                                      formData.bitingForce.occlusionForce
                                    ) < 200 ? (
                                    <span className="text-red-500">
                                      低下（✕）
                                    </span>
                                  ) : (
                                    <span className="text-green-500">
                                      正常（〇）
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 mt-6 p-4 border rounded-lg">
                        <Label htmlFor="remainingTeeth" className="text-lg">
                          残存歯数（残根と動揺度３の歯を除く）
                        </Label>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Input
                              id="remainingTeeth"
                              type="number"
                              step="1"
                              min="0"
                              max="32"
                              value={formData.bitingForce.remainingTeeth}
                              onChange={(e) =>
                                handleChange(
                                  "bitingForce",
                                  "remainingTeeth",
                                  e.target.value
                                )
                              }
                              placeholder="例: 24"
                              className="text-lg py-6"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg text-muted-foreground">
                              基準値: 20本以上が正常
                            </p>
                          </div>
                        </div>

                        {formData.bitingForce.remainingTeeth && (
                          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center">
                              <p className="text-lg font-medium">
                                残存歯数: {formData.bitingForce.remainingTeeth}
                                本
                              </p>
                              <div className="text-xl font-bold">
                                判定:{" "}
                                {Number(formData.bitingForce.remainingTeeth) <
                                20 ? (
                                  <span className="text-red-500">
                                    低下（✕）
                                  </span>
                                ) : (
                                  <span className="text-green-500">
                                    正常（〇）
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tongueMovement">
            <Card className="border-2">
              <CardHeader className="bg-blue-100 rounded-t-lg flex flex-row justify-between items-center">
                <CardTitle className="text-2xl">舌口唇運動の評価</CardTitle>
                <Sheet
                  open={openSheet === "tongueMovement"}
                  onOpenChange={(open) =>
                    setOpenSheet(open ? "tongueMovement" : null)
                  }
                >
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="text-base">
                      やり方を見る
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="!w-1/2 !max-w-none !min-w-none overflow-y-auto">
                    <SheetHeader className="mb-5">
                      <SheetTitle className="text-2xl">
                        舌口唇運動の評価方法
                      </SheetTitle>
                      <SheetDescription>
                        舌口唇運動を正確に評価するための手順を説明します
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold">
                          舌口唇運動機能（Oral Diadochokinesis：ODK）の測定方法
                        </h4>
                        <ol className="list-decimal list-inside ml-4 space-y-2 text-lg">
                          <li>
                            患者に1秒間にできるだけ早く「パ」「タ」「カ」の各音を繰り返し発音してもらいます
                          </li>
                          <li>
                            各音について、1秒間に発音できた回数を測定します
                          </li>
                          <li>
                            判定基準:
                            <ul className="list-disc list-inside ml-6 mt-1">
                              <li>
                                /pa/または/ta/または/ka/ &lt; 6.0 回/秒 →
                                低下（✕）
                              </li>
                              <li>全ての音が ≥ 6.0 回/秒 → 正常（〇）</li>
                            </ul>
                          </li>
                        </ol>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mt-4">
                        <p className="text-lg font-medium">注意事項</p>
                        <ul className="list-disc list-inside ml-4 text-lg">
                          <li>測定は静かな環境で行ってください</li>
                          <li>
                            患者に測定の目的と方法を十分に説明し、理解を得てから実施してください
                          </li>
                          <li>
                            必要に応じて複数回測定し、最も良い結果を記録してください
                          </li>
                        </ul>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 bg-white">
                {/* 検査結果入力フォーム */}
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">検査結果入力</h3>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      1秒間に「パ・タ・カ」各音を発音した回数を測定します。いずれか1音でも6.0回/秒未満の場合は低下と判定されます。
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-4 border p-4 rounded-lg">
                        <Label htmlFor="paSound" className="text-lg">
                          「パ」の発音回数（回/秒）
                        </Label>
                        <Input
                          id="paSound"
                          type="number"
                          step="0.1"
                          min="0"
                          value={formData.tongueMovement.paSound}
                          onChange={(e) =>
                            handleChange(
                              "tongueMovement",
                              "paSound",
                              e.target.value
                            )
                          }
                          placeholder="例: 7.0"
                          className="text-lg py-6"
                        />
                        {formData.tongueMovement.paSound && (
                          <div
                            className={`text-lg font-medium ${
                              Number(formData.tongueMovement.paSound) < 6.0
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {Number(formData.tongueMovement.paSound) < 6.0
                              ? "基準値未満"
                              : "正常範囲内"}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4 border p-4 rounded-lg">
                        <Label htmlFor="taSound" className="text-lg">
                          「タ」の発音回数（回/秒）
                        </Label>
                        <Input
                          id="taSound"
                          type="number"
                          step="0.1"
                          min="0"
                          value={formData.tongueMovement.taSound}
                          onChange={(e) =>
                            handleChange(
                              "tongueMovement",
                              "taSound",
                              e.target.value
                            )
                          }
                          placeholder="例: 7.0"
                          className="text-lg py-6"
                        />
                        {formData.tongueMovement.taSound && (
                          <div
                            className={`text-lg font-medium ${
                              Number(formData.tongueMovement.taSound) < 6.0
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {Number(formData.tongueMovement.taSound) < 6.0
                              ? "基準値未満"
                              : "正常範囲内"}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4 border p-4 rounded-lg">
                        <Label htmlFor="kaSound" className="text-lg">
                          「カ」の発音回数（回/秒）
                        </Label>
                        <Input
                          id="kaSound"
                          type="number"
                          step="0.1"
                          min="0"
                          value={formData.tongueMovement.kaSound}
                          onChange={(e) =>
                            handleChange(
                              "tongueMovement",
                              "kaSound",
                              e.target.value
                            )
                          }
                          placeholder="例: 7.0"
                          className="text-lg py-6"
                        />
                        {formData.tongueMovement.kaSound && (
                          <div
                            className={`text-lg font-medium ${
                              Number(formData.tongueMovement.kaSound) < 6.0
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {Number(formData.tongueMovement.kaSound) < 6.0
                              ? "基準値未満"
                              : "正常範囲内"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 判定ロジックは保持するが表示しない
                    {(formData.tongueMovement.paSound ||
                      formData.tongueMovement.taSound ||
                      formData.tongueMovement.kaSound) && (
                      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-lg font-medium">
                              パ: {formData.tongueMovement.paSound || "-"} 回/秒 | タ:{" "}
                              {formData.tongueMovement.taSound || "-"} 回/秒 | カ:{" "}
                              {formData.tongueMovement.kaSound || "-"} 回/秒
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              ※ いずれか1音でも6.0回/秒未満 → 低下（✕）、全ての音が6.0回/秒以上 → 正常（〇）
                            </p>
                          </div>
                          <div className="text-xl font-bold">
                            判定:{" "}
                            {Number(formData.tongueMovement.paSound || 0) < 6.0 ||
                            Number(formData.tongueMovement.taSound || 0) < 6.0 ||
                            Number(formData.tongueMovement.kaSound || 0) < 6.0 ? (
                              <span className="text-red-500">低下（✕）</span>
                            ) : formData.tongueMovement.paSound &&
                              formData.tongueMovement.taSound &&
                              formData.tongueMovement.kaSound ? (
                              <span className="text-green-500">正常（〇）</span>
                            ) : (
                              <span className="text-gray-400">未評価</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tonguePressure">
            <Card className="border-2">
              <CardHeader className="bg-blue-100 rounded-t-lg flex flex-row justify-between items-center">
                <CardTitle className="text-2xl">舌圧の評価</CardTitle>
                <Sheet
                  open={openSheet === "tonguePressure"}
                  onOpenChange={(open) =>
                    setOpenSheet(open ? "tonguePressure" : null)
                  }
                >
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="text-base">
                      やり方を見る
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="!w-1/2 !max-w-none !min-w-none overflow-y-auto">
                    <SheetHeader className="mb-5">
                      <SheetTitle className="text-2xl">
                        舌圧の評価方法
                      </SheetTitle>
                      <SheetDescription>
                        舌圧を正確に評価するための手順を説明します
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">舌圧の測定方法</h4>
                      <p className="text-lg">
                        舌圧の評価方法については、ここに説明を記述します。
                      </p>
                    </div>
                  </SheetContent>
                </Sheet>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 bg-white">
                {/* 検査結果入力フォーム */}
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">検査結果入力</h3>
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <Label className="text-lg">舌圧</Label>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Input
                            type="number"
                            value={formData.tonguePressure.value}
                            onChange={(e) =>
                              handleChange(
                                "tonguePressure",
                                "value",
                                e.target.value
                              )
                            }
                            placeholder="舌圧を入力"
                            className="text-lg py-6"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg text-muted-foreground">
                            基準値: 30kPa以上が正常
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chewingFunction">
            <Card className="border-2">
              <CardHeader className="bg-blue-100 rounded-t-lg flex flex-row justify-between items-center">
                <CardTitle className="text-2xl">咀嚼機能の評価</CardTitle>
                <Sheet
                  open={openSheet === "chewingFunction"}
                  onOpenChange={(open) =>
                    setOpenSheet(open ? "chewingFunction" : null)
                  }
                >
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="text-base">
                      やり方を見る
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="!w-1/2 !max-w-none !min-w-none overflow-y-auto">
                    <SheetHeader className="mb-5">
                      <SheetTitle className="text-2xl">
                        咀嚼機能の評価方法
                      </SheetTitle>
                      <SheetDescription>
                        咀嚼機能を正確に評価するための手順を説明します
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold">
                          評価方法１：グルコース含有ゼリー法
                        </h4>
                        <ol className="list-decimal list-inside ml-4 space-y-2 text-lg">
                          <li>
                            グルコース含有ゼリーを患者に咀嚼してもらいます
                          </li>
                          <li>吐出液のグルコース濃度を測定します</li>
                          <li>
                            判定基準:
                            <ul className="list-disc list-inside ml-6 mt-1">
                              <li>グルコース濃度 &lt; 100 mg/dL → 低下（✕）</li>
                              <li>グルコース濃度 ≥ 100 mg/dL → 正常（〇）</li>
                            </ul>
                          </li>
                        </ol>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-lg font-semibold">
                          評価方法２：咀嚼能率スコア法
                        </h4>
                        <ol className="list-decimal list-inside ml-4 space-y-2 text-lg">
                          <li>
                            専用のスコアシートを用いて咀嚼能率を評価します
                          </li>
                          <li>スコアは0〜9の範囲で評価します</li>
                          <li>
                            判定基準:
                            <ul className="list-disc list-inside ml-6 mt-1">
                              <li>スコア ≦ 2 → 低下（✕）</li>
                              <li>スコア ≧ 3 → 正常（〇）</li>
                            </ul>
                          </li>
                        </ol>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mt-4">
                        <p className="text-lg font-medium">注意事項</p>
                        <ul className="list-disc list-inside ml-4 text-lg">
                          <li>
                            検査前に患者に検査方法を十分に説明してください
                          </li>
                          <li>
                            義歯を装着している場合は、装着した状態で検査を行ってください
                          </li>
                        </ul>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 bg-white">
                {/* 検査結果入力フォーム */}
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">検査結果入力</h3>
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <Label className="text-lg">評価方法の選択</Label>
                      <Select
                        value={formData.chewingFunction.evaluationMethod}
                        onValueChange={(value) =>
                          handleChange(
                            "chewingFunction",
                            "evaluationMethod",
                            value
                          )
                        }
                      >
                        <SelectTrigger className="text-lg py-6">
                          <SelectValue placeholder="評価方法を選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="method1" className="text-lg">
                            評価方法１：グルコース含有ゼリー法
                          </SelectItem>
                          <SelectItem value="method2" className="text-lg">
                            評価方法２：咀嚼能率スコア法
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.chewingFunction.evaluationMethod === "method1" ? (
                      <div className="space-y-4 mt-6 p-4 border rounded-lg">
                        <Label
                          htmlFor="glucoseConcentration"
                          className="text-lg"
                        >
                          グルコース濃度 (mg/dL)
                        </Label>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Input
                              id="glucoseConcentration"
                              type="number"
                              step="1"
                              min="0"
                              value={
                                formData.chewingFunction.glucoseConcentration
                              }
                              onChange={(e) =>
                                handleChange(
                                  "chewingFunction",
                                  "glucoseConcentration",
                                  e.target.value
                                )
                              }
                              placeholder="例: 120"
                              className="text-lg py-6"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg text-muted-foreground">
                              基準値: 100 mg/dL以上が正常
                            </p>
                          </div>
                        </div>

                        {formData.chewingFunction.glucoseConcentration && (
                          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center">
                              <p className="text-lg font-medium">
                                グルコース濃度:{" "}
                                {formData.chewingFunction.glucoseConcentration}{" "}
                                mg/dL
                              </p>
                              <div className="text-xl font-bold">
                                判定:{" "}
                                {Number(
                                  formData.chewingFunction.glucoseConcentration
                                ) < 100 ? (
                                  <span className="text-red-500">
                                    低下（✕）
                                  </span>
                                ) : (
                                  <span className="text-green-500">
                                    正常（〇）
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4 mt-6 p-4 border rounded-lg">
                        <Label htmlFor="masticatoryScore" className="text-lg">
                          咀嚼能率スコア (0〜9)
                        </Label>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Input
                              id="masticatoryScore"
                              type="number"
                              step="1"
                              min="0"
                              max="9"
                              value={formData.chewingFunction.masticatoryScore}
                              onChange={(e) =>
                                handleChange(
                                  "chewingFunction",
                                  "masticatoryScore",
                                  e.target.value
                                )
                              }
                              placeholder="例: 5"
                              className="text-lg py-6"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg text-muted-foreground">
                              基準値: 3以上が正常
                            </p>
                          </div>
                        </div>

                        {formData.chewingFunction.masticatoryScore && (
                          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center">
                              <p className="text-lg font-medium">
                                咀嚼能率スコア:{" "}
                                {formData.chewingFunction.masticatoryScore}
                              </p>
                              <div className="text-xl font-bold">
                                判定:{" "}
                                {Number(
                                  formData.chewingFunction.masticatoryScore
                                ) <= 2 ? (
                                  <span className="text-red-500">
                                    低下（✕）
                                  </span>
                                ) : (
                                  <span className="text-green-500">
                                    正常（〇）
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="swallowingFunction">
            <Card className="border-2">
              <CardHeader className="bg-blue-100 rounded-t-lg flex flex-row justify-between items-center">
                <CardTitle className="text-2xl">嚥下機能の評価</CardTitle>
                <Sheet
                  open={openSheet === "swallowingFunction"}
                  onOpenChange={(open) =>
                    setOpenSheet(open ? "swallowingFunction" : null)
                  }
                >
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="text-base">
                      やり方を見る
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="!w-1/2 !max-w-none !min-w-none overflow-y-auto">
                    <SheetHeader className="mb-5">
                      <SheetTitle className="text-2xl">
                        嚥下機能の評価方法
                      </SheetTitle>
                      <SheetDescription>
                        嚥下機能を正確に評価するための手順を説明します
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold">
                          評価方法１：EAT-10（Eating Assessment Tool-10）
                        </h4>
                        <ol className="list-decimal list-inside ml-4 space-y-2 text-lg">
                          <li>患者に10項目の質問に回答してもらいます</li>
                          <li>
                            各項目は0〜4点で評価します（0: 問題なし、4:
                            重度の問題あり）
                          </li>
                          <li>10項目の合計点数を算出します</li>
                          <li>
                            判定基準:
                            <ul className="list-disc list-inside ml-6 mt-1">
                              <li>合計スコア ≥ 3点 → 低下（✕）</li>
                              <li>合計スコア &lt; 3点 → 正常（〇）</li>
                            </ul>
                          </li>
                        </ol>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-lg font-semibold">
                          評価方法２：聖隷式嚥下質問紙
                        </h4>
                        <ol className="list-decimal list-inside ml-4 space-y-2 text-lg">
                          <li>患者に自記式質問票に回答してもらいます</li>
                          <li>
                            各質問項目の回答に基づいて合計点数を算出します
                          </li>
                          <li>
                            判定基準:
                            <ul className="list-disc list-inside ml-6 mt-1">
                              <li>合計スコア ≥ 2点 → 低下（✕）</li>
                              <li>合計スコア &lt; 2点 → 正常（〇）</li>
                            </ul>
                          </li>
                        </ol>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mt-4">
                        <p className="text-lg font-medium">注意事項</p>
                        <ul className="list-disc list-inside ml-4 text-lg">
                          <li>
                            患者の認知機能に応じて、適切な質問方法を選択してください
                          </li>
                          <li>
                            必要に応じて家族や介護者からの情報も参考にしてください
                          </li>
                        </ul>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 bg-white">
                {/* 検査結果入力フォーム */}
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">検査結果入力</h3>
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <Label className="text-lg">評価方法の選択</Label>
                      <Select
                        value={formData.swallowingFunction.evaluationMethod}
                        onValueChange={(value) =>
                          handleChange(
                            "swallowingFunction",
                            "evaluationMethod",
                            value
                          )
                        }
                      >
                        <SelectTrigger className="text-lg py-6">
                          <SelectValue placeholder="評価方法を選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eat10" className="text-lg">
                            評価方法１：EAT-10（Eating Assessment Tool-10）
                          </SelectItem>
                          <SelectItem value="seirei" className="text-lg">
                            評価方法２：聖隷式嚥下質問紙
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.swallowingFunction.evaluationMethod ===
                    "eat10" ? (
                      <div className="space-y-4 mt-6 p-4 border rounded-lg">
                        <Label htmlFor="eat10Score" className="text-lg">
                          EAT-10 スコア
                        </Label>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Input
                              id="eat10Score"
                              type="number"
                              step="1"
                              min="0"
                              max="40"
                              value={formData.swallowingFunction.eat10Score}
                              onChange={(e) =>
                                handleChange(
                                  "swallowingFunction",
                                  "eat10Score",
                                  e.target.value
                                )
                              }
                              placeholder="例: 5"
                              className="text-lg py-6"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg text-muted-foreground">
                              基準値: 3点未満が正常
                            </p>
                          </div>
                        </div>

                        {formData.swallowingFunction.eat10Score && (
                          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center">
                              <p className="text-lg font-medium">
                                EAT-10 スコア:{" "}
                                {formData.swallowingFunction.eat10Score}
                              </p>
                              <div className="text-xl font-bold">
                                判定:{" "}
                                {Number(
                                  formData.swallowingFunction.eat10Score
                                ) >= 3 ? (
                                  <span className="text-red-500">
                                    低下（✕）
                                  </span>
                                ) : (
                                  <span className="text-green-500">
                                    正常（〇）
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4 mt-6 p-4 border rounded-lg">
                        <Label htmlFor="seireiScore" className="text-lg">
                          聖隷式嚥下質問紙 スコア
                        </Label>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Input
                              id="seireiScore"
                              type="number"
                              step="1"
                              min="0"
                              value={formData.swallowingFunction.seireiScore}
                              onChange={(e) =>
                                handleChange(
                                  "swallowingFunction",
                                  "seireiScore",
                                  e.target.value
                                )
                              }
                              placeholder="例: 1"
                              className="text-lg py-6"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg text-muted-foreground">
                              基準値: 2点未満が正常
                            </p>
                          </div>
                        </div>

                        {formData.swallowingFunction.seireiScore && (
                          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center">
                              <p className="text-lg font-medium">
                                聖隷式嚥下質問紙 スコア:{" "}
                                {formData.swallowingFunction.seireiScore}
                              </p>
                              <div className="text-xl font-bold">
                                判定:{" "}
                                {Number(
                                  formData.swallowingFunction.seireiScore
                                ) >= 2 ? (
                                  <span className="text-red-500">
                                    低下（✕）
                                  </span>
                                ) : (
                                  <span className="text-green-500">
                                    正常（〇）
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end gap-4">
          <Button
            type="submit"
            size="lg"
            className="text-lg py-6 px-12"
            disabled={loading}
          >
            {loading ? (
              <>
                記録中...
                <svg
                  className="animate-spin ml-2 h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </>
            ) : (
              "更新する"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
