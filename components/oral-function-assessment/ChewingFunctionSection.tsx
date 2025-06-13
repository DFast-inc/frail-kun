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

type ChewingFunctionValue = {
  evaluationMethod: string;
  glucoseConcentration: string;
  masticatoryScore: string;
  notes: string;
};

type Props = {
  value: ChewingFunctionValue;
  onChange: (field: keyof ChewingFunctionValue, value: string) => void;
  openSheet: string | null;
  setOpenSheet: (sheet: string | null) => void;
};

const ChewingFunctionSection: React.FC<Props> = ({
  value,
  onChange,
  openSheet,
  setOpenSheet,
}) => {
  const [focusedField, setFocusedField] = useState<
    "glucoseConcentration" | "masticatoryScore" | null
  >("glucoseConcentration");
  const isMobile = useIsMobile();
  return (
    <Card className="border-2">
      <CardHeader className="bg-blue-100 rounded-t-lg flex flex-row justify-between items-center">
        <CardTitle className="text-2xl">咀嚼機能の評価</CardTitle>
        <Sheet
          open={openSheet === "chewingFunction"}
          onOpenChange={(open) => setOpenSheet(open ? "chewingFunction" : null)}
        >
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="text-base">
              やり方を見る
            </Button>
          </SheetTrigger>
          <SheetContent className="!w-1/2 !max-w-none !min-w-none overflow-y-auto">
            <SheetHeader className="mb-5">
              <SheetTitle className="text-2xl">咀嚼機能の評価方法</SheetTitle>
              <SheetDescription>
                咀嚼機能を正確に評価するための手順を説明します
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
                  評価方法１：グルコース含有ゼリー法
                </SelectItem>
                <SelectItem value="method2" className="text-lg">
                  評価方法２：咀嚼能率スコア法
                </SelectItem>
              </SelectContent>
            </Select>

            {value.evaluationMethod === "method1" ? (
              <div className="space-y-4 mt-6 p-4 border rounded-lg">
                <Label htmlFor="glucoseConcentration" className="text-lg">
                  グルコース濃度 (mg/dL)
                </Label>
                <Input
                  id="glucoseConcentration"
                  type="text"
                  value={value.glucoseConcentration}
                  readOnly
                  onChange={(e) => {
                    const v = e.target.value;
                    if (VALID_NUMERIC.test(v)) {
                      onChange("glucoseConcentration", v);
                    }
                  }}
                  onFocus={() => setFocusedField("glucoseConcentration")}
                  placeholder="例: 120"
                  className="text-lg py-6"
                />
                <p className="text-lg text-muted-foreground">
                  基準値: 100 mg/dL以上が正常
                </p>
                {value.glucoseConcentration && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium">
                        グルコース濃度: {value.glucoseConcentration} mg/dL
                      </p>
                      <div className="text-xl font-bold">
                        判定:{" "}
                        {Number(value.glucoseConcentration) < 100 ? (
                          <span className="text-red-500">低下（✕）</span>
                        ) : (
                          <span className="text-green-500">正常（〇）</span>
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
                <Input
                  id="masticatoryScore"
                  type="text"
                  value={value.masticatoryScore}
                  readOnly
                  onChange={(e) => {
                    const v = e.target.value;
                    if (VALID_NUMERIC.test(v)) {
                      onChange("masticatoryScore", v);
                    }
                  }}
                  onFocus={() => setFocusedField("masticatoryScore")}
                  placeholder="例: 5"
                  className="text-lg py-6"
                />
                <p className="text-lg text-muted-foreground">
                  基準値: 3以上が正常
                </p>
                {value.masticatoryScore && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium">
                        咀嚼能率スコア: {value.masticatoryScore}
                      </p>
                      <div className="text-xl font-bold">
                        判定:{" "}
                        {Number(value.masticatoryScore) <= 2 ? (
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

export default ChewingFunctionSection;
