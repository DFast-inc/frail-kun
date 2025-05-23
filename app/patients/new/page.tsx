"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type React from "react"
import { useCreatePatient } from "@/hooks/useCreatePatient"

export default function NewPatientPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    notes: "",
  })
  const { createPatient, loading, error } = useCreatePatient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // バリデーション
    if ( !formData.name || !formData.gender) {
      toast({
        title: "入力エラー",
        description: "必須項目をすべて入力してください",
        variant: "destructive",
      })
      return
    }

    const success = await createPatient(formData);

    if (success) {
      toast({
        title: "患者登録完了",
        description: `${formData.name}さんの登録が完了しました`,
      })
      router.push("/patients")
    } else {
      toast({
        title: "登録エラー",
        description: error || "登録に失敗しました",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">新規患者登録</h1>
        <Button variant="outline" size="sm" className="self-start sm:self-auto" onClick={() => router.push("/")}>
          ホームに戻る
        </Button>
      </div>

      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="bg-blue-50">
          <CardTitle>患者基本情報</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  氏名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="例: 山田 太郎"
                  required
                  className="text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">
                  年齢
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="例: 65"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  性別 <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={handleGenderChange}
                  className="flex flex-col sm:flex-row gap-2 sm:gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">男性</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">女性</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">住所</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="例: 東京都千代田区..."
                className="text-sm sm:text-base"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">電話番号</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="例: 090-1234-5678"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="例: yamada@example.com"
                  className="text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">備考</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="その他特記事項があればご記入ください"
                className="min-h-[100px] text-sm sm:text-base"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-4 sm:pt-6">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/")}>
              キャンセル
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              登録
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
