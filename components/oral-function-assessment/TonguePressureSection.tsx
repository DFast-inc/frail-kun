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

type TonguePressureValue = {
  value: string;
  notes: string;
};

type Props = {
  value: TonguePressureValue;
  onChange: (field: keyof TonguePressureValue, value: string) => void;
  openSheet: string | null;
  setOpenSheet: (sheet: string | null) => void;
};

const TonguePressureSection: React.FC<Props> = ({
  value,
  onChange,
  openSheet,
  setOpenSheet,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [press1, setPress1] = useState<string>("");
  const [press2, setPress2] = useState<string>("");
  const [press3, setPress3] = useState<string>("");
  const [pressAvg, setPressAvg] = useState<string>("");
  useEffect(() => {
    const nums = [
      parseFloat(press1) || 0,
      parseFloat(press2) || 0,
      parseFloat(press3) || 0,
    ];
    const avg = nums.reduce((a, b) => a + b, 0) / 3;
    const avgStr = isNaN(avg) ? "" : avg.toFixed(1);
    setPressAvg(avgStr);
    if (avgStr) onChange("value", avgStr);
  }, [press1, press2, press3]);
  const isMobile = useIsMobile();
  return (
    <Card className="border-2">
      <CardHeader className="bg-blue-100 rounded-t-lg flex flex-row justify-between items-center">
        <CardTitle className="text-2xl">舌圧の評価</CardTitle>
        <Sheet
          open={openSheet === "tonguePressure"}
          onOpenChange={(open) => setOpenSheet(open ? "tonguePressure" : null)}
        >
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="text-base">
              やり方を見る
            </Button>
          </SheetTrigger>
          <SheetContent className="!w-1/2 !max-w-none !min-w-none overflow-y-auto">
            <SheetHeader className="mb-5">
              <SheetTitle className="text-2xl">舌圧の評価方法</SheetTitle>
              <SheetDescription>
                舌圧を正確に評価するための手順を説明します
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
            <Label className="text-lg">舌圧（3回）</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {[
                { label: "1回目", val: press1, setter: setPress1 },
                { label: "2回目", val: press2, setter: setPress2 },
                { label: "3回目", val: press3, setter: setPress3 },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col space-y-2">
                  <Label className="text-base">{item.label}</Label>
                  <Input
                    type="text"
                    value={item.val}
                    readOnly
                    onChange={(e) => {
                      const v = e.target.value;
                      if (VALID_NUMERIC.test(v)) {
                        item.setter(v);
                      }
                    }}
                    onFocus={() =>
                      setFocusedField(
                        idx === 0 ? "press1" : idx === 1 ? "press2" : "press3"
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
                value={pressAvg}
                readOnly
                className="text-lg py-6"
              /> */}
              <p className="text-lg text-muted-foreground">
                基準値: 30kPa以上が正常
              </p>
              {pressAvg && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-medium">平均舌圧: {pressAvg}</p>
                    <div className="text-xl font-bold">
                      判定:{" "}
                      {Number(pressAvg) < 30 ? (
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
        </div>
      </CardContent>
      {!isMobile && (
        <NumericKeyboard
          onInput={(key: string) => {
            if (!focusedField) return;
            let current = "";
            let setter: (v: string) => void;
            if (focusedField === "press1") {
              current = press1;
              setter = setPress1;
            } else if (focusedField === "press2") {
              current = press2;
              setter = setPress2;
            } else if (focusedField === "press3") {
              current = press3;
              setter = setPress3;
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

export default TonguePressureSection;
