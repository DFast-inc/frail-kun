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
  name: string;
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
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">患者一覧</h1>
        <div className="flex flex-col">
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
                <TableHead className="text-lg">患者ID</TableHead>
                <TableHead className="text-lg">氏名</TableHead>
                <TableHead className="text-lg">年齢</TableHead>
                <TableHead className="text-lg">性別</TableHead>
                <TableHead className="text-lg">最終来院日</TableHead>
                <TableHead className="text-lg">状態</TableHead>
                <TableHead className="text-lg">診断</TableHead>
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
                filteredPatients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className="cursor-pointer hover:bg-accent transition"
                    onClick={() => router.push(`/patients/${patient.id}`)}
                    tabIndex={0}
                    role="button"
                    aria-label={`患者 ${patient.name} の詳細ページへ`}
                  >
                    <TableCell className="text-lg font-medium">{patient.id}</TableCell>
                    <TableCell className="text-lg">{patient.name}</TableCell>
                    <TableCell className="text-lg">
                      {patient.age !== null ? `${patient.age}歳` : "-"}
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
