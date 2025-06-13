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
  eat10Answers: string[];
  seireiScore: string;
  notes: string;
};

type Props = {
  value: SwallowingFunctionValue;
  onChange: (
    field: keyof SwallowingFunctionValue,
    value: string | string[]
  ) => void;
  openSheet: string | null;
  setOpenSheet: (sheet: string | null) => void;
};

const SwallowingFunctionSection: React.FC<Props> = ({
  value,
  onChange,
  openSheet,
  setOpenSheet,
}) => {
  const eat10Questions = [
    "この3ヵ月の間に、飲み込みの問題が原因で、体重が減少しましたか？",
    "この3ヵ月の間に、飲み込みの問題が原因で、自宅や病院／施設での食事以外は食べたくないと思ったことはありますか？",
    "液体を飲み込む時に、余分な努力が必要だ",
    "固形物を飲み込む時に、余分な努力が必要だ",
    "錠剤を飲み込む時に、余分な努力が必要だ",
    "飲み込むことが苦痛だ",
    "食べる喜びが飲み込みによって影響を受けている",
    "飲み込む時に、食べ物がのどに引っかかる",
    "食べる時に咳が出る",
    "飲み込むことはストレスが多い",
  ];
  const eat10OptionsDefault = [
    "【0点】\n全くそうは感じないまたは、そういう問題はない",
    "【1点】\nめったにそうは思わなかった",
    "【2点】\nときどきそう思うことがあった",
    "【3点】\nよくそう思った",
    "【4点】\nいつもそう思った",
  ];
  const eat10OptionsWeight = [
    "【0点】\n体重は減少していない",
    "【1点】\nよくわからない",
    "【2点】\nこの3ヵ月間で、0～1kg体重が減少した",
    "【3点】\nこの3ヵ月間で、1～3kg体重が減少した",
    "【4点】\nこの3ヵ月で、3kg以上体重が減少した",
  ];
  const eat10OptionsCough = [
    "【0点】\n全く出ない",
    "【1点】\n滅多に出ない",
    "【2点】\nときどき出ることがある",
    "【3点】\nよく出る",
    "【4点】\nいつも出る",
  ];

  // 回答変更時は親に伝える
  const handleEat10Change = (index: number, score: number) => {
    const answers = Array.isArray(value.eat10Answers)
      ? [...value.eat10Answers]
      : Array(10).fill("0");
    answers[index] = score.toString();
    onChange("eat10Answers", answers);
    const total = answers.reduce((sum, v) => sum + Number(v), 0);
    onChange("eat10Score", total.toString());
  };

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
                {eat10Questions.map((question, idx) => (
                  <div key={idx} className="mb-4">
                    <p className="text-lg font-medium mb-2">
                      Q{idx + 1}. {question}
                    </p>
                    <div className="flex space-x-4">
                      {/* 質問番号1,9のみ別選択肢 */}
                      {(idx === 0
                        ? eat10OptionsWeight
                        : idx === 8
                        ? eat10OptionsCough
                        : eat10OptionsDefault
                      ).map((label, optIdx) => (
                        <label
                          key={optIdx}
                          className={`flex-1 w-full text-center cursor-pointer px-4 py-2 rounded-lg border transition select-none text-lg ${
                            Number((value.eat10Answers?.[idx]) ?? "0") === optIdx
                              ? "bg-blue-600 text-white shadow-inner"
                              : "bg-white border-gray-300"
                          } active:scale-95`}
                        >
                          <input
                            type="radio"
                            name={`eat10-${idx}`}
                            value={optIdx}
                            checked={Number((value.eat10Answers?.[idx]) ?? "0") === optIdx}
                            onChange={() => handleEat10Change(idx, optIdx)}
                            className="sr-only"
                          />
                          <span className="text-lg whitespace-pre-line">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-medium">
                      EAT-10 合計スコア:{" "}
                      {(value.eat10Answers ?? []).reduce((sum, v) => sum + Number(v), 0)}
                    </p>
                    <div className="text-xl font-bold">
                      判定:{" "}
                      {(value.eat10Answers ?? []).reduce((sum, v) => sum + Number(v), 0) >= 3 ? (
                        <span className="text-red-500">低下（✕）</span>
                      ) : (
                        <span className="text-green-500">正常（〇）</span>
                      )}
                    </div>
                  </div>
                </div>
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
