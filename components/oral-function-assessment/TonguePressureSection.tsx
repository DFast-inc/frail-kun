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
            <Label className="text-lg">舌圧</Label>
            <Input
              type="number"
              value={value.value}
              onChange={(e) => onChange("value", e.target.value)}
              placeholder="舌圧を入力"
              className="text-lg py-6"
            />
            <p className="text-lg text-muted-foreground">
              基準値: 30kPa以上が正常
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TonguePressureSection;
