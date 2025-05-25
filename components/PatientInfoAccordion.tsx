"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Edit, User } from "lucide-react";

type PatientData = {
  id: string;
  name?: string;
  kana?: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  address?: string;
  medicalHistory?: string;
  medications?: string;
  allergies?: string;
  notes?: string;
  karte_no?: string | number;
};

export default function PatientInfoAccordion({
  patientData,
}: {
  patientData: PatientData;
}) {
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  // 年齢計算
  const getAge = (birthday?: string) => {
    if (!birthday) return "";
    const today = new Date();
    const birth = new Date(birthday);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return isNaN(age) ? "" : `${age}歳`;
  };

  return (
    <Card className="border-2">
      <CardHeader
        className="bg-white rounded-t-lg border-b flex flex-row items-center justify-between cursor-pointer"
        onClick={() => setIsInfoExpanded((v) => !v)}
      >
        <div className="flex items-center">
          <User className="mr-2 h-5 w-5 text-gray-500" />
          <CardTitle className="text-2xl">患者基本情報</CardTitle>
        </div>
        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
          {isInfoExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </CardHeader>
      {isInfoExpanded ? (
        <CardContent className="pt-6 transition-all duration-300 ease-in-out">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">氏名</h3>
                <p className="text-xl">{patientData.name ?? ""}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">フリガナ</h3>
                <p className="text-xl">{patientData.kana ?? ""}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">生年月日</h3>
                <p className="text-xl">
                  {patientData.birthday
                    ? `${patientData.birthday} (${getAge(patientData.birthday)})`
                    : ""}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">性別</h3>
                <p className="text-xl">
  {patientData.gender === "male"
    ? "男性"
    : patientData.gender === "female"
      ? "女性"
      : patientData.gender ?? ""}
</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">カルテ番号</h3>
                <p className="text-xl">{patientData.karte_no ?? "-"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">電話番号</h3>
                <p className="text-xl">{patientData.phone ?? ""}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">住所</h3>
                <p className="text-xl">{patientData.address ?? ""}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-muted-foreground">既往歴</h3>
              <p className="text-xl">{patientData.medicalHistory || "なし"}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-muted-foreground">服用中の薬</h3>
              <p className="text-xl">{patientData.medications || "なし"}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-muted-foreground">アレルギー</h3>
              <p className="text-xl">{patientData.allergies || "なし"}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-muted-foreground">備考</h3>
              <p className="text-xl">{patientData.notes || "なし"}</p>
            </div>
          </div>
          <div className="mt-8">
            <Link href={`/patients/${patientData.id}/edit`}>
              <Button variant="outline" size="lg" className="text-lg py-6 px-6">
                <Edit className="mr-2 h-4 w-4" />
                患者情報を編集
              </Button>
            </Link>
          </div>
        </CardContent>
      ) : (
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500 mr-2">カルテ番号:</span>
              <span className="text-lg">{patientData.karte_no ?? "-"}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500 mr-2">年齢:</span>
              <span className="text-lg">{getAge(patientData.birthday)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500 mr-2">性別:</span>
              <span className="text-lg">
  {patientData.gender === "male"
    ? "男性"
    : patientData.gender === "female"
      ? "女性"
      : patientData.gender ?? ""}
</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500 mr-2">電話:</span>
              <span className="text-lg">{patientData.phone ?? ""}</span>
            </div>
            {patientData.medicalHistory && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 mr-2">既往歴:</span>
                <span className="text-lg">{patientData.medicalHistory}</span>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
