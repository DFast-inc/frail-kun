import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import NumericKeyboard from "@/components/ui/NumericKeyboard";
import { useIsMobile } from "@/components/ui/use-mobile";
const VALID_NUMERIC = /^(?:0|[1-9]\d*)(?:\.\d*)?$|^$/;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BitingForceValue = {
  evaluationMethod: string;
  pressureScaleType: string;
  useFilter: string;
  occlusionForce: string;
  remainingTeeth: string;
  notes: string;
};

type Props = {
  value: BitingForceValue;
  onChange: (field: keyof BitingForceValue, value: string) => void;
  openSheet: string | null;
  setOpenSheet: (sheet: string | null) => void;
};

const OralBitingForceSection: React.FC<Props> = ({
  value,
  onChange,
  openSheet,
  setOpenSheet,
}) => {
  const [focusedField, setFocusedField] = useState<
    "occlusionForce" | "remainingTeeth" | null
  >(null);
  const isMobile = useIsMobile();
  return (
    <Card className="border-2">
      <CardHeader className="bg-blue-100 rounded-t-lg flex flex-row justify-between items-center">
        <CardTitle className="text-2xl">咬合力の評価</CardTitle>
        <Sheet
          open={openSheet === "bitingForce"}
          onOpenChange={(open) => setOpenSheet(open ? "bitingForce" : null)}
        >
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="text-base">
              やり方を見る
            </Button>
          </SheetTrigger>
          <SheetContent className="!w-1/2 !max-w-none !min-w-none overflow-y-auto">
            <SheetHeader className="mb-5">
              <SheetTitle className="text-2xl">咬合力の評価方法</SheetTitle>
              <SheetDescription>
                咬合力を正確に評価するための手順を説明します
              </SheetDescription>
            </SheetHeader>
            {/* ...説明部分は省略。必要に応じて移植... */}
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 bg-white">
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-3">検査結果入力</h3>
          <div className="space-y-4">
            <Label className="text-lg">評価方法の選択</Label>
            <Select
              value={value.evaluationMethod}
              onValueChange={(v) => onChange("evaluationMethod", v)}
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

            {value.evaluationMethod === "method1" ? (
              <div className="space-y-4 mt-6 p-4 border rounded-lg">
                <div className="space-y-4">
                  <Label className="text-lg">使用器具の選択</Label>
                  <Select
                    value={value.pressureScaleType}
                    onValueChange={(v) => onChange("pressureScaleType", v)}
                  >
                    <SelectTrigger className="text-lg py-6">
                      <SelectValue placeholder="使用器具を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pressScale2" className="text-lg">
                        プレスケールⅡ
                      </SelectItem>
                      <SelectItem value="pressScale" className="text-lg">
                        プレスケール
                      </SelectItem>
                      <SelectItem value="oramo" className="text-lg">
                        Oramo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {value.pressureScaleType === "pressScale2" && (
                  <div className="space-y-4">
                    <Label className="text-lg">フィルタの使用</Label>
                    <Select
                      value={value.useFilter}
                      onValueChange={(v) => onChange("useFilter", v)}
                    >
                      <SelectTrigger className="text-lg py-6">
                        <SelectValue placeholder="フィルタの使用を選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="noFilter" className="text-lg">
                          フィルタなし
                        </SelectItem>
                        <SelectItem value="withFilter" className="text-lg">
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
                  <Input
                    id="occlusionForce"
                    type="text"
                    value={value.occlusionForce}
                    readOnly
                    onChange={(e) => {
                      const v = e.target.value;
                      if (VALID_NUMERIC.test(v)) {
                        onChange("occlusionForce", v);
                      }
                    }}
                    onFocus={() => setFocusedField("occlusionForce")}
                    placeholder="例: 400"
                    className="text-lg py-6"
                  />
                  <p className="text-lg text-muted-foreground">
                    基準値:
                    {value.pressureScaleType === "oramo"
                      ? "375N以上が正常"
                      : value.pressureScaleType === "pressScale2"
                      ? value.useFilter === "withFilter"
                        ? "350N以上が正常"
                        : "500N以上が正常"
                      : "200N以上が正常"}
                  </p>
                  {value.occlusionForce && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-medium">
                          咬合力: {value.occlusionForce}N
                        </p>
                        <div className="text-xl font-bold">
                          判定:{" "}
                          {value.pressureScaleType === "oramo" ? (
                            Number(value.occlusionForce) < 375 ? (
                              <span className="text-red-500">低下（✕）</span>
                            ) : (
                              <span className="text-green-500">正常（〇）</span>
                            )
                          ) : value.pressureScaleType === "pressScale2" ? (
                            value.useFilter === "withFilter" ? (
                              Number(value.occlusionForce) < 500 ? (
                                <span className="text-red-500">低下（✕）</span>
                              ) : (
                                <span className="text-green-500">
                                  正常（〇）
                                </span>
                              )
                            ) : Number(value.occlusionForce) < 350 ? (
                              <span className="text-red-500">低下（✕）</span>
                            ) : (
                              <span className="text-green-500">正常（〇）</span>
                            )
                          ) : Number(value.occlusionForce) < 200 ? (
                            <span className="text-red-500">低下（✕）</span>
                          ) : (
                            <span className="text-green-500">正常（〇）</span>
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
                <Input
                  id="remainingTeeth"
                  type="text"
                  value={value.remainingTeeth}
                  readOnly
                  onChange={(e) => {
                    const v = e.target.value;
                    if (VALID_NUMERIC.test(v)) {
                      onChange("remainingTeeth", v);
                    }
                  }}
                  onFocus={() => setFocusedField("remainingTeeth")}
                  placeholder="例: 24"
                  className="text-lg py-6"
                />
                <p className="text-lg text-muted-foreground">
                  基準値: 20本以上が正常
                </p>
                {value.remainingTeeth && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium">
                        残存歯数: {value.remainingTeeth}本
                      </p>
                      <div className="text-xl font-bold">
                        判定:{" "}
                        {Number(value.remainingTeeth) < 20 ? (
                          <span className="text-red-500">低下（✕）</span>
                        ) : (
                          <span className="text-green-500">正常（〇）</span>
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
      {!isMobile && (
        <NumericKeyboard
          onInput={(key: string) => {
            if (!focusedField) return;
            const field = focusedField;
            const current = value[field] || "";
            let newVal: string;
            if (key === "backspace") {
              newVal = current.slice(0, -1);
            } else if (/^[1-9]$/.test(key) && current === "0") {
              newVal = key;
            } else {
              newVal = current + key;
            }
            if (VALID_NUMERIC.test(newVal)) {
              onChange(field, newVal);
            }
          }}
          className="mt-4"
        />
      )}
    </Card>
  );
};

export default OralBitingForceSection;
