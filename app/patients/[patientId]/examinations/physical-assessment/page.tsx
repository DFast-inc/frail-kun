"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, Search, Edit, FileText, Dumbbell } from "lucide-react"

// サンプルデータ
const sampleAssessments = [
  {
    id: 1,
    patientId: 1,
    patientName: "山田 太郎",
    age: 75,
    gender: "男性",
    date: "2023-04-15",
    height: "165.0",
    weight: "58.5",
    bmi: "21.5",
    frailtyStatus: "プレフレイル",
  },
  {
    id: 2,
    patientId: 2,
    patientName: "佐藤 花子",
    age: 68,
    gender: "女性",
    date: "2023-04-10",
    height: "155.0",
    weight: "50.0",
    bmi: "20.8",
    frailtyStatus: "健常",
  },
  {
    id: 3,
    patientId: 3,
    patientName: "鈴木 一郎",
    age: 82,
    gender: "男性",
    date: "2023-04-05",
    height: "170.0",
    weight: "65.0",
    bmi: "22.5",
    frailtyStatus: "フレイル",
  },
  {
    id: 4,
    patientId: 4,
    patientName: "田中 美智子",
    age: 71,
    gender: "女性",
    date: "2023-04-01",
    height: "158.0",
    weight: "48.0",
    bmi: "19.2",
    frailtyStatus: "プレフレイル",
  },
]

export default function PhysicalAssessmentPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAssessments = sampleAssessments.filter((assessment) =>
    assessment.patientName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">全身機能検査一覧</h1>
        <div className="flex flex-col">
          <Link href="/patients">
            <Button size="lg" className="text-lg py-6 px-6">
              <UserPlus className="mr-2 h-5 w-5" />
              患者選択へ
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs text-right">
            患者を選択してから新規検査を実施できます
          </p>
        </div>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>検査検索</CardTitle>
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
          <CardTitle>全身機能検査履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg">検査ID</TableHead>
                <TableHead className="text-lg">患者名</TableHead>
                <TableHead className="text-lg">年齢</TableHead>
                <TableHead className="text-lg">性別</TableHead>
                <TableHead className="text-lg">検査日</TableHead>
                <TableHead className="text-lg">身長/体重/BMI</TableHead>
                <TableHead className="text-lg">フレイル状態</TableHead>
                <TableHead className="text-lg">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell className="text-lg font-medium">{assessment.id}</TableCell>
                  <TableCell className="text-lg">{assessment.patientName}</TableCell>
                  <TableCell className="text-lg">{assessment.age}歳</TableCell>
                  <TableCell className="text-lg">{assessment.gender}</TableCell>
                  <TableCell className="text-lg">{assessment.date}</TableCell>
                  <TableCell className="text-lg">
                    {assessment.height}cm / {assessment.weight}kg / BMI: {assessment.bmi}
                  </TableCell>
                  <TableCell className="text-lg">
                    <span
                      className={`px-2 py-1 rounded ${
                        assessment.frailtyStatus === "フレイル"
                          ? "bg-red-100 text-red-800"
                          : assessment.frailtyStatus === "プレフレイル"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {assessment.frailtyStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/patients/${assessment.patientId}`}>
                        <Button variant="outline" size="sm" className="text-base">
                          <Edit className="mr-1 h-4 w-4" />
                          患者詳細
                        </Button>
                      </Link>
                      <Link href={`/physical-assessment/${assessment.id}`}>
                        <Button variant="outline" size="sm" className="text-base">
                          <FileText className="mr-1 h-4 w-4" />
                          検査詳細
                        </Button>
                      </Link>
                      <Link href={`/physical-assessment/new?patientId=${assessment.patientId}`}>
                        <Button variant="outline" size="sm" className="text-base">
                          <Dumbbell className="mr-1 h-4 w-4" />
                          新規検査
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
