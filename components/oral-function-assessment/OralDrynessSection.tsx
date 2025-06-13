import React, { useState, useEffect } from "react";
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

type OralDrynessValue = {
  evaluationMethod: string;
  mucus1: string;
  mucus2: string;
  mucus3: string;
  mucusValue: string;
  gauzeWeight: string;
  notes: string;
};

type Props = {
  value: OralDrynessValue;
  onChange: (field: keyof OralDrynessValue, value: string) => void;
  openSheet: string | null;
  setOpenSheet: (sheet: string | null) => void;
};

const OralDrynessSection: React.FC<Props> = ({
  value,
  onChange,
  openSheet,
  setOpenSheet,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>("mucus1");

  const [mucusAvg, setMucusAvg] = useState<string>("");
  useEffect(() => {
    const nums = [
      parseFloat(value.mucus1) || 0,
      parseFloat(value.mucus2) || 0,
      parseFloat(value.mucus3) || 0,
    ];
    const avg = nums.reduce((a, b) => a + b, 0) / 3;
    const avgStr = isNaN(avg) ? "" : avg.toFixed(1);
    setMucusAvg(avgStr);
    if (avgStr) onChange("mucusValue", avgStr);
  }, [value.mucus1, value.mucus2, value.mucus3]);
  const isMobile = useIsMobile();
  return (
    <Card className="border-2">
      <CardHeader className="bg-blue-100 rounded-t-lg flex flex-row justify-between items-center">
        <CardTitle className="text-2xl">口腔乾燥の評価</CardTitle>
        <Sheet
          open={openSheet === "oralDryness"}
          onOpenChange={(open) => setOpenSheet(open ? "oralDryness" : null)}
        >
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="text-base">
              やり方を見る
            </Button>
          </SheetTrigger>
          <SheetContent className="!w-1/2 !max-w-none !min-w-none overflow-y-auto">
            <SheetHeader className="mb-5">
              <SheetTitle className="text-2xl">口腔乾燥の評価方法</SheetTitle>
              <SheetDescription>
                口腔乾燥を正確に評価するための手順を説明します
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
                  評価方法１：口腔湿潤度測定器（Mucus等）
                </SelectItem>
                <SelectItem value="method2" className="text-lg">
                  評価方法２：唾液量測定（サクソンテスト）
                </SelectItem>
              </SelectContent>
            </Select>

            {value.evaluationMethod === "method1" ? (
              <div className="space-y-4 mt-6 p-4 border rounded-lg">
                <Label className="text-lg">口腔湿潤度測定器の値（3回）</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {[
                    { label: "1回目", val: value.mucus1 },
                    { label: "2回目", val: value.mucus2 },
                    { label: "3回目", val: value.mucus3 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col space-y-2">
                      <Label className="text-base">{item.label}</Label>
                      <Input
                        type="text"
                        value={item.val || ""}
                        readOnly
                        onChange={(e) => {
                          const v = e.target.value;
                          if (VALID_NUMERIC.test(v)) {
                            onChange(`mucus${idx + 1}`, v);
                          }
                        }}
                        onFocus={() =>
                          setFocusedField(
                            idx === 0
                              ? "mucus1"
                              : idx === 1
                              ? "mucus2"
                              : "mucus3"
                          )
                        }
                        placeholder="数値を入力"
                        className="text-lg py-4"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Label className="text-lg">平均値</Label>
                  {/* <Input
                    type="text"
                    value={mucusAvg}
                    readOnly
                    hidden
                    className="text-lg py-6"
                  /> */}
                  <p className="text-lg text-muted-foreground">
                    基準値: 27.0以上が正常
                  </p>
                  {mucusAvg && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-medium">
                          湿潤度平均値: {mucusAvg}
                        </p>
                        <div className="text-xl font-bold">
                          判定:{" "}
                          {Number(mucusAvg) < 27.0 ? (
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
                <Label htmlFor="gauzeWeight" className="text-lg">
                  ガーゼ重量増加量 (g)
                </Label>
                <Input
                  id="gauzeWeight"
                  type="text"
                  value={value.gauzeWeight}
                  readOnly
                  onChange={(e) => {
                    const v = e.target.value;
                    if (VALID_NUMERIC.test(v)) {
                      onChange("gauzeWeight", v);
                    }
                  }}
                  onFocus={() => setFocusedField("gauzeWeight")}
                  placeholder="例: 2.5"
                  className="text-lg py-6"
                />
                <p className="text-lg text-muted-foreground">
                  基準値: 2g以上が正常
                </p>
                {value.gauzeWeight && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium">
                        ガーゼ重量増加量: {value.gauzeWeight}g
                      </p>
                      <div className="text-xl font-bold">
                        判定:{" "}
                        {Number(value.gauzeWeight) < 2 ? (
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

            let current = "";
            let setter: (v: string) => void;
            if (focusedField === "gauzeWeight") {
              current = value.gauzeWeight || "";
              setter = (v) => onChange("gauzeWeight", v);
            } else if (focusedField === "mucus1") {
              console.log(value.mucus1);
              current = value.mucus1 || "";
              setter = (v) => onChange("mucus1", v);
            } else if (focusedField === "mucus2") {
              current = value.mucus2 || "";
              setter = (v) => onChange("mucus2", v);
            } else if (focusedField === "mucus3") {
              current = value.mucus3 || "";
              setter = (v) => onChange("mucus3", v);
            } else {
              return;
            }
            let newVal: string;
            if (key === "backspace") {
              newVal = current.slice(0, -1);
            } else if (/^[1-9]$/.test(key) && current === "0") {
              newVal = key;
            } else {
              newVal = current + key;
            }
            console.log("Key pressed:", newVal);
            if (VALID_NUMERIC.test(newVal)) {
              setter(newVal);
            }
          }}
          className="mt-4"
        />
      )}
    </Card>
  );
};

export default OralDrynessSection;
