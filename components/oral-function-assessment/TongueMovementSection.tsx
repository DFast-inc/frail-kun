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

type TongueMovementValue = {
  paSound: string;
  taSound: string;
  kaSound: string;
  notes: string;
};

type Props = {
  value: TongueMovementValue;
  onChange: (field: keyof TongueMovementValue, value: string) => void;
  openSheet: string | null;
  setOpenSheet: (sheet: string | null) => void;
};

const TongueMovementSection: React.FC<Props> = ({
  value,
  onChange,
  openSheet,
  setOpenSheet,
}) => {
  const [focusedField, setFocusedField] = useState<
    keyof TongueMovementValue | null
  >("paSound");
  const isMobile = useIsMobile();
  return (
    <Card className="border-2">
      <CardHeader className="bg-blue-100 rounded-t-lg flex flex-row justify-between items-center">
        <CardTitle className="text-2xl">舌口唇運動の評価</CardTitle>
        <Sheet
          open={openSheet === "tongueMovement"}
          onOpenChange={(open) => setOpenSheet(open ? "tongueMovement" : null)}
        >
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="text-base">
              やり方を見る
            </Button>
          </SheetTrigger>
          <SheetContent className="!w-1/2 !max-w-none !min-w-none overflow-y-auto">
            <SheetHeader className="mb-5">
              <SheetTitle className="text-2xl">舌口唇運動の評価方法</SheetTitle>
              <SheetDescription>
                舌口唇運動を正確に評価するための手順を説明します
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
                  type="text"
                  value={value.paSound}
                  readOnly
                  onChange={(e) => {
                    const v = e.target.value;
                    if (VALID_NUMERIC.test(v)) {
                      onChange("paSound", v);
                    }
                  }}
                  onFocus={() => setFocusedField("paSound")}
                  placeholder="例: 7.0"
                  className="text-lg py-6"
                />
                {value.paSound && (
                  <div
                    className={`text-lg font-medium ${
                      Number(value.paSound) < 6.0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {Number(value.paSound) < 6.0 ? "基準値未満" : "正常範囲内"}
                  </div>
                )}
              </div>
              <div className="space-y-4 border p-4 rounded-lg">
                <Label htmlFor="taSound" className="text-lg">
                  「タ」の発音回数（回/秒）
                </Label>
                <Input
                  id="taSound"
                  type="text"
                  value={value.taSound}
                  readOnly
                  onChange={(e) => {
                    const v = e.target.value;
                    if (VALID_NUMERIC.test(v)) {
                      onChange("taSound", v);
                    }
                  }}
                  onFocus={() => setFocusedField("taSound")}
                  placeholder="例: 7.0"
                  className="text-lg py-6"
                />
                {value.taSound && (
                  <div
                    className={`text-lg font-medium ${
                      Number(value.taSound) < 6.0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {Number(value.taSound) < 6.0 ? "基準値未満" : "正常範囲内"}
                  </div>
                )}
              </div>
              <div className="space-y-4 border p-4 rounded-lg">
                <Label htmlFor="kaSound" className="text-lg">
                  「カ」の発音回数（回/秒）
                </Label>
                <Input
                  id="kaSound"
                  type="text"
                  value={value.kaSound}
                  readOnly
                  onChange={(e) => {
                    const v = e.target.value;
                    if (VALID_NUMERIC.test(v)) {
                      onChange("kaSound", v);
                    }
                  }}
                  onFocus={() => setFocusedField("kaSound")}
                  placeholder="例: 7.0"
                  className="text-lg py-6"
                />
                {value.kaSound && (
                  <div
                    className={`text-lg font-medium ${
                      Number(value.kaSound) < 6.0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {Number(value.kaSound) < 6.0 ? "基準値未満" : "正常範囲内"}
                  </div>
                )}
              </div>
            </div>
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

export default TongueMovementSection;
