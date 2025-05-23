"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Building, Phone, Mail, Clock, User, MapPin, Upload } from "lucide-react"

export default function SettingsPage() {
  // サンプルデータ（実際はデータベースから取得）
  const [clinicInfo, setClinicInfo] = useState({
    name: "フレイルくん歯科医院",
    address: "東京都千代田区丸の内1-1-1",
    phone: "03-1234-5678",
    email: "info@frailkun-dental.jp",
    website: "https://frailkun-dental.jp",
    director: "山田 太郎",
    businessHours: "平日 9:00-18:00、土曜 9:00-13:00",
    description: "口腔機能低下症の専門治療を行っています。",
    logo: null,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(clinicInfo)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // 実際はここでAPIリクエストを行う
    setClinicInfo(formData)
    setIsEditing(false)
    toast({
      title: "設定を保存しました",
      description: "歯科医院の基本情報が更新されました。",
    })
  }

  const handleCancel = () => {
    setFormData(clinicInfo)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">設定</h1>

      <Tabs defaultValue="clinic" className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-4">
          <TabsTrigger value="clinic" className="text-lg py-3">
            歯科医院情報
          </TabsTrigger>
          <TabsTrigger value="system" className="text-lg py-3">
            システム設定
          </TabsTrigger>
          <TabsTrigger value="users" className="text-lg py-3">
            ユーザー管理
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clinic">
          <Card className="border-2">
            <CardHeader className="bg-blue-100 rounded-t-lg flex flex-row justify-between items-center">
              <CardTitle className="text-2xl">歯科医院基本情報</CardTitle>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} size="sm" className="text-base">
                  編集
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-lg flex items-center">
                      <Building className="mr-2 h-5 w-5" />
                      医院名 <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="text-lg py-6"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-lg flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      住所 <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="text-lg py-6"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-lg flex items-center">
                        <Phone className="mr-2 h-5 w-5" />
                        電話番号 <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="text-lg py-6"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-lg flex items-center">
                        <Mail className="mr-2 h-5 w-5" />
                        メールアドレス
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="text-lg py-6"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-lg flex items-center">
                      ウェブサイト
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="text-lg py-6"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="director" className="text-lg flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      院長名 <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="director"
                      name="director"
                      value={formData.director}
                      onChange={handleChange}
                      required
                      className="text-lg py-6"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessHours" className="text-lg flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      診療時間
                    </Label>
                    <Input
                      id="businessHours"
                      name="businessHours"
                      value={formData.businessHours}
                      onChange={handleChange}
                      className="text-lg py-6"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-lg">
                      医院紹介
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="text-lg min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo" className="text-lg">
                      医院ロゴ
                    </Label>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" className="text-lg py-6">
                        <Upload className="mr-2 h-5 w-5" />
                        ロゴをアップロード
                      </Button>
                      <p className="text-sm text-muted-foreground">推奨サイズ: 300x100px、最大ファイルサイズ: 2MB</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-muted-foreground flex items-center">
                          <Building className="mr-2 h-5 w-5" />
                          医院名
                        </h3>
                        <p className="text-xl">{clinicInfo.name}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-muted-foreground flex items-center">
                          <MapPin className="mr-2 h-5 w-5" />
                          住所
                        </h3>
                        <p className="text-xl">{clinicInfo.address}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-muted-foreground flex items-center">
                          <Phone className="mr-2 h-5 w-5" />
                          電話番号
                        </h3>
                        <p className="text-xl">{clinicInfo.phone}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-muted-foreground flex items-center">
                          <Mail className="mr-2 h-5 w-5" />
                          メールアドレス
                        </h3>
                        <p className="text-xl">{clinicInfo.email}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-muted-foreground">ウェブサイト</h3>
                        <p className="text-xl">{clinicInfo.website}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-muted-foreground flex items-center">
                          <User className="mr-2 h-5 w-5" />
                          院長名
                        </h3>
                        <p className="text-xl">{clinicInfo.director}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-muted-foreground flex items-center">
                          <Clock className="mr-2 h-5 w-5" />
                          診療時間
                        </h3>
                        <p className="text-xl">{clinicInfo.businessHours}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-muted-foreground">医院紹介</h3>
                    <p className="text-xl">{clinicInfo.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-muted-foreground">医院ロゴ</h3>
                    {clinicInfo.logo ? (
                      <div className="mt-2 border p-4 rounded-lg inline-block">
                        <img src={clinicInfo.logo || "/placeholder.svg"} alt="医院ロゴ" className="max-h-20" />
                      </div>
                    ) : (
                      <p className="text-muted-foreground">ロゴは設定されていません</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-between pt-6">
                <Button variant="outline" size="lg" className="text-lg py-6 px-8" onClick={handleCancel}>
                  キャンセル
                </Button>
                <Button size="lg" className="text-lg py-6 px-8" onClick={handleSave}>
                  保存
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card className="border-2 mt-6">
            <CardHeader className="bg-blue-100 rounded-t-lg">
              <CardTitle className="text-2xl">印刷設定</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="headerText" className="text-lg">
                    帳票ヘッダーテキスト
                  </Label>
                  <Input
                    id="headerText"
                    placeholder="例: フレイルくん歯科医院 - 口腔機能低下症検査記録"
                    className="text-lg py-6"
                  />
                  <p className="text-sm text-muted-foreground">
                    検査結果や管理計画を印刷する際のヘッダーに表示されるテキストです
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footerText" className="text-lg">
                    帳票フッターテキスト
                  </Label>
                  <Input
                    id="footerText"
                    placeholder="例: 〒100-0001 東京都千代田区丸の内1-1-1 Tel: 03-1234-5678"
                    className="text-lg py-6"
                  />
                  <p className="text-sm text-muted-foreground">
                    検査結果や管理計画を印刷する際のフッターに表示されるテキストです
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Button variant="outline" className="text-lg py-6">
                    <Upload className="mr-2 h-5 w-5" />
                    印刷用ロゴをアップロード
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    印刷時に使用されるロゴです。推奨サイズ: 300x100px、最大ファイルサイズ: 2MB
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-6">
              <Button size="lg" className="text-lg py-6 px-8">
                印刷設定を保存
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="border-2">
            <CardHeader className="bg-blue-100 rounded-t-lg">
              <CardTitle className="text-2xl">システム設定</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg text-center py-8">
                システム設定は現在開発中です。今後のアップデートをお待ちください。
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border-2">
            <CardHeader className="bg-blue-100 rounded-t-lg">
              <CardTitle className="text-2xl">ユーザー管理</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg text-center py-8">
                ユーザー管理機能は現在開発中です。今後のアップデートをお待ちください。
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
