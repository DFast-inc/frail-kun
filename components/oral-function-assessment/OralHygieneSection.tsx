import React from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type OralHygieneValue = {
  tongueFrontLeft: string;
  tongueFrontCenter: string;
  tongueFrontRight: string;
  tongueMiddleLeft: string;
  tongueMiddleCenter: string;
  tongueMiddleRight: string;
  tongueBackLeft: string;
  tongueBackCenter: string;
  tongueBackRight: string;
  plaqueControl: string;
  notes: string;
};

type Props = {
  value: OralHygieneValue;
  onChange: (field: keyof OralHygieneValue, value: string) => void;
  openSheet: string | null;
  setOpenSheet: (sheet: string | null) => void;
};

const OralHygieneSection: React.FC<Props> = ({
  value,
  onChange,
  openSheet,
  setOpenSheet,
}) => {
  // 合計スコア・TCI計算
  const totalScore =
    Number(value.tongueFrontLeft || 0) +
    Number(value.tongueFrontCenter || 0) +
    Number(value.tongueFrontRight || 0) +
    Number(value.tongueMiddleLeft || 0) +
    Number(value.tongueMiddleCenter || 0) +
    Number(value.tongueMiddleRight || 0) +
    Number(value.tongueBackLeft || 0) +
    Number(value.tongueBackCenter || 0) +
    Number(value.tongueBackRight || 0);

  const tci = ((totalScore / 18) * 100).toFixed(1);

  return (
    <Card className="border-2">
      <CardHeader className="bg-blue-100 rounded-t-lg flex flex-row justify-between items-center">
        <CardTitle className="text-2xl">口腔衛生状態の評価</CardTitle>
        <Sheet
          open={openSheet === "oralHygiene"}
          onOpenChange={(open) => setOpenSheet(open ? "oralHygiene" : null)}
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
            {/* ...説明部分は省略。必要に応じて移植... */}
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 bg-white">
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-3">検査結果入力</h3>
          <div className="space-y-6">
            {/* 舌後方部 */}
            <div className="space-y-2">
              <h4 className="text-lg font-medium">舌後方部</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["tongueBackLeft", "tongueBackCenter", "tongueBackRight"].map(
                  (field, idx) => (
                    <div
                      key={field}
                      className="space-y-2 border p-4 rounded-lg"
                    >
                      <Label className="text-lg">
                        {["左側", "中央", "右側"][idx]}
                      </Label>
                      <div className="flex flex-row gap-2 w-full">
                        {[0, 1, 2].map((score) => {
                          const checked =
                            value[field as keyof OralHygieneValue] ===
                            String(score);
                          return (
                            <label
                              key={score}
                              className={`flex-1 w-full text-center cursor-pointer px-4 py-2 rounded-lg border transition select-none text-lg
          ${
            checked
              ? "bg-blue-600 text-white shadow-inner"
              : "bg-white border-gray-300"
          }
          active:scale-95
        `}
                            >
                              <input
                                type="radio"
                                name={field}
                                value={score}
                                checked={checked}
                                onChange={() =>
                                  onChange(
                                    field as keyof OralHygieneValue,
                                    String(score)
                                  )
                                }
                                className="sr-only"
                              />
                              {score}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            {/* 舌中央部 */}
            <div className="space-y-2">
              <h4 className="text-lg font-medium">舌中央部</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  "tongueMiddleLeft",
                  "tongueMiddleCenter",
                  "tongueMiddleRight",
                ].map((field, idx) => (
                  <div key={field} className="space-y-2 border p-4 rounded-lg">
                    <Label className="text-lg">
                      {["左側", "中央", "右側"][idx]}
                    </Label>
                    <div className="flex flex-row gap-2 w-full">
                      {[0, 1, 2].map((score) => {
                        const checked =
                          value[field as keyof OralHygieneValue] ===
                          String(score);
                        return (
                          <label
                            key={score}
                            className={`flex-1 w-full text-center cursor-pointer px-4 py-2 rounded-lg border transition select-none text-lg
          ${
            checked
              ? "bg-blue-600 text-white shadow-inner"
              : "bg-white border-gray-300"
          }
          active:scale-95
        `}
                          >
                            <input
                              type="radio"
                              name={field}
                              value={score}
                              checked={checked}
                              onChange={() =>
                                onChange(
                                  field as keyof OralHygieneValue,
                                  String(score)
                                )
                              }
                              className="sr-only"
                            />
                            {score}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 舌前方部 */}
            <div className="space-y-2">
              <h4 className="text-lg font-medium">舌前方部</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  "tongueFrontLeft",
                  "tongueFrontCenter",
                  "tongueFrontRight",
                ].map((field, idx) => (
                  <div key={field} className="space-y-2 border p-4 rounded-lg">
                    <Label className="text-lg">
                      {["左側", "中央", "右側"][idx]}
                    </Label>
                    <div className="flex flex-row gap-2 w-full">
                      {[0, 1, 2].map((score) => {
                        const checked =
                          value[field as keyof OralHygieneValue] ===
                          String(score);
                        return (
                          <label
                            key={score}
                            className={`flex-1 w-full text-center cursor-pointer px-4 py-2 rounded-lg border transition select-none text-lg
          ${
            checked
              ? "bg-blue-600 text-white shadow-inner"
              : "bg-white border-gray-300"
          }
          active:scale-95
        `}
                          >
                            <input
                              type="radio"
                              name={field}
                              value={score}
                              checked={checked}
                              onChange={() =>
                                onChange(
                                  field as keyof OralHygieneValue,
                                  String(score)
                                )
                              }
                              className="sr-only"
                            />
                            {score}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 合計スコア・TCI・判定 */}
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">
                    合計スコア: {totalScore}
                  </p>
                  <p className="text-lg font-medium">
                    TCI: {tci}%{" "}
                    <span className="text-sm text-muted-foreground ml-2">
                      {"※ TCI ≧ 50 → 低下（✕）、TCI < 50 → 正常（〇）"}
                    </span>
                  </p>
                </div>
                <div className="text-xl font-bold">
                  判定:{" "}
                  {totalScore >= 9 ? (
                    <span className="text-red-500">低下（✕）</span>
                  ) : (
                    <span className="text-green-500">正常（〇）</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OralHygieneSection;
