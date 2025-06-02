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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SwallowingFunctionValue = {
  evaluationMethod: string;
  eat10Score: string;
  seireiScore: string;
  notes: string;
};

type Props = {
  value: SwallowingFunctionValue;
  onChange: (field: keyof SwallowingFunctionValue, value: string) => void;
  openSheet: string | null;
  setOpenSheet: (sheet: string | null) => void;
};

const SwallowingFunctionSection: React.FC<Props> = ({
  value,
  onChange,
  openSheet,
  setOpenSheet,
}) => {
  return (
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
              <SheetTitle className="text-2xl">嚥下機能の評価方法</SheetTitle>
              <SheetDescription>
                嚥下機能を正確に評価するための手順を説明します
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
                <SelectItem value="eat10" className="text-lg">
                  評価方法１：EAT-10（Eating Assessment Tool-10）
                </SelectItem>
                <SelectItem value="seirei" className="text-lg">
                  評価方法２：聖隷式嚥下質問紙
                </SelectItem>
              </SelectContent>
            </Select>

            {value.evaluationMethod === "eat10" ? (
              <div className="space-y-4 mt-6 p-4 border rounded-lg">
                <Label htmlFor="eat10Score" className="text-lg">
                  EAT-10 スコア
                </Label>
                <Input
                  id="eat10Score"
                  type="number"
                  step="1"
                  min="0"
                  max="40"
                  value={value.eat10Score}
                  onChange={(e) => onChange("eat10Score", e.target.value)}
                  placeholder="例: 5"
                  className="text-lg py-6"
                />
                <p className="text-lg text-muted-foreground">
                  基準値: 3点未満が正常
                </p>
                {value.eat10Score && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium">
                        EAT-10 スコア: {value.eat10Score}
                      </p>
                      <div className="text-xl font-bold">
                        判定:{" "}
                        {Number(value.eat10Score) >= 3 ? (
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
                <Label htmlFor="seireiScore" className="text-lg">
                  聖隷式嚥下質問紙 スコア
                </Label>
                <Input
                  id="seireiScore"
                  type="number"
                  step="1"
                  min="0"
                  value={value.seireiScore}
                  onChange={(e) => onChange("seireiScore", e.target.value)}
                  placeholder="例: 1"
                  className="text-lg py-6"
                />
                <p className="text-lg text-muted-foreground">
                  基準値: 2点未満が正常
                </p>
                {value.seireiScore && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium">
                        聖隷式嚥下質問紙 スコア: {value.seireiScore}
                      </p>
                      <div className="text-xl font-bold">
                        判定:{" "}
                        {Number(value.seireiScore) >= 2 ? (
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
    </Card>
  );
};

export default SwallowingFunctionSection;
