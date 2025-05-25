"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type React from "react"

export type PatientFormData = {
  name: string
  birthday: string
  gender: string
  address: string
  phone: string
  email: string
  notes: string
  karte_no: string
}

type PatientFormProps = {
  initialValues?: PatientFormData
  onSubmit: (data: PatientFormData) => Promise<boolean>
  onCancel?: () => void
  submitLabel?: string
}

export function PatientForm({
  initialValues = {
    name: "",
    birthday: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    notes: "",
    karte_no: "",
  },
  onSubmit,
  onCancel,
  submitLabel = "登録",
}: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>(initialValues)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.gender) {
      toast({
        title: "入力エラー",
        description: "必須項目をすべて入力してください",
        variant: "destructive",
      })
      return
    }
    setLoading(true)
    const success = await onSubmit(formData)
    setLoading(false)
    if (success) {
      toast({
        title: submitLabel === "登録" ? "患者登録完了" : "患者情報を更新しました",
        description: `${formData.name}さんの${submitLabel === "登録" ? "登録" : "更新"}が完了しました`,
      })
    } else {
      toast({
        title: "エラー",
        description: "処理に失敗しました",
        variant: "destructive",
      })
    }
  }

  return (
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
            <div className="space-y-2">
              <Label htmlFor="karte_no">
                カルテ番号
              </Label>
              <Input
                id="karte_no"
                name="karte_no"
                value={formData.karte_no}
                onChange={handleChange}
                placeholder="例: 12345"
                className="text-sm sm:text-base"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="birthday">
                生年月日
              </Label>
              <Input
                id="birthday"
                name="birthday"
                type="date"
                value={formData.birthday}
                onChange={handleChange}
                placeholder="例: 1958-04-01"
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
          {onCancel && (
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onCancel}>
              キャンセル
            </Button>
          )}
          <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
            {submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
