"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Search } from "lucide-react";
import type React from "react";

type Patient = {
  id: number;
  karte_no: string | number;
  name: string;
  birthday: string | null | undefined;
  age: number | null;
  gender: string;
  lastVisit: string;
  status: string;
  diagnosis: string;
};

import { useState } from "react";

type PatientsListProps = {
  patients: Patient[];
  loading: boolean;
};

export default function PatientsList({
  patients,
  loading,
}: PatientsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 年齢計算関数
  function calcAge(birthday: string | null | undefined): number | null {
    if (!birthday) return null;
    const today = new Date();
    const birth = new Date(birthday);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold whitespace-nowrap min-w-[8rem] flex-shrink-0">患者一覧</h1>
        <div className="flex flex-row justify-end items-center w-full max-w-[480px]">
          <div className="flex flex-col items-end w-full">
            <Link href="/patients/new">
              <Button size="lg" className="text-lg py-6 px-6">
                <UserPlus className="mr-2 h-5 w-5" />
                新規患者登録
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs text-right">
              基本情報の登録に加えて身長・体重、全身疾患の既往歴など全身状態の記録を登録できます
            </p>
          </div>
        </div>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>患者検索</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="患者名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-lg py-6"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>登録患者一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg">カルテ番号</TableHead>
                <TableHead className="text-lg">氏名</TableHead>
                <TableHead className="text-lg">年齢</TableHead>
                <TableHead className="text-lg">性別</TableHead>
                <TableHead className="text-lg">最終来院日</TableHead>
                <TableHead className="text-lg">状態</TableHead>
                <TableHead className="text-lg">診断</TableHead>
                <TableHead className="text-lg"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-lg">
                    読み込み中...
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient, index) => (
                  <TableRow
                    key={patient.id ?? patient.karte_no ?? `no_karte_${patient.name}_${index}`}
                    className="cursor-pointer hover:bg-accent transition"
                    onClick={() => patient.id ? router.push(`/patients/${patient.id}`) : undefined}
                    tabIndex={0}
                    role="button"
                    aria-label={`患者 ${patient.name} の詳細ページへ`}
                  >
                    <TableCell className="text-lg font-medium">{patient.karte_no}</TableCell>
                    <TableCell className="text-lg">{patient.name}</TableCell>
                    <TableCell className="text-lg">
                      {calcAge(patient.birthday) !== null ? `${calcAge(patient.birthday)}歳` : "-"}
                    </TableCell>
                    <TableCell className="text-lg">{patient.gender}</TableCell>
                    <TableCell className="text-lg">{patient.lastVisit}</TableCell>
                    <TableCell className="text-lg">
                      <span
                        className={`px-2 py-1 rounded ${
                          patient.status === "要管理"
                            ? "bg-red-100 text-red-800"
                            : patient.status === "経過観察"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-lg">
                      {patient.diagnosis || "-"}
                    </TableCell>
                    <TableCell className="text-lg text-right">
                      <span className="inline-block align-middle">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
