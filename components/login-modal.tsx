"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Scale, User, Phone, Mail, Lock, UserCheck } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: { name: string; type: "lawyer" | "citizen"; id: string }) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [loginType, setLoginType] = useState<"lawyer" | "citizen">("citizen")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    licenseNumber: "", // للمحامين
    specialization: "", // للمحامين
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // محاكاة تسجيل الدخول
    const user = {
      name: formData.name,
      type: loginType,
      id: `${loginType}_${Date.now()}`,
    }

    onLogin(user)
    onClose()

    // إعادة تعيين النموذج
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      licenseNumber: "",
      specialization: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="h-5 w-5 ml-2 text-blue-600" />
            تسجيل الدخول
          </DialogTitle>
          <DialogDescription>اختر نوع الحساب وأدخل بياناتك للوصول إلى النظام</DialogDescription>
        </DialogHeader>

        <Tabs value={loginType} onValueChange={(value) => setLoginType(value as "lawyer" | "citizen")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="citizen" className="flex items-center">
              <User className="h-4 w-4 ml-2" />
              مواطن
            </TabsTrigger>
            <TabsTrigger value="lawyer" className="flex items-center">
              <Scale className="h-4 w-4 ml-2" />
              محامي
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <TabsContent value="citizen" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <User className="h-4 w-4 ml-2 text-blue-600" />
                    تسجيل دخول المواطنين
                  </CardTitle>
                  <CardDescription>للمواطنين الذين يحتاجون استشارة قانونية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="citizen-name">الاسم الكامل</Label>
                    <Input
                      id="citizen-name"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="citizen-email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="citizen-email"
                        type="email"
                        placeholder="example@email.com"
                        className="pr-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="citizen-phone">رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="citizen-phone"
                        type="tel"
                        placeholder="7xxxxxxxx"
                        className="pr-10"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="citizen-password">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="citizen-password"
                        type="password"
                        placeholder="أدخل كلمة المرور"
                        className="pr-10"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lawyer" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Scale className="h-4 w-4 ml-2 text-blue-600" />
                    تسجيل دخول المحامين
                  </CardTitle>
                  <CardDescription>للمحامين المرخصين لتقديم الاستشارات</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="lawyer-name">الاسم الكامل</Label>
                    <Input
                      id="lawyer-name"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lawyer-license">رقم الترخيص</Label>
                    <div className="relative">
                      <UserCheck className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="lawyer-license"
                        type="text"
                        placeholder="رقم ترخيص المحاماة"
                        className="pr-10"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lawyer-specialization">التخصص</Label>
                    <Select
                      value={formData.specialization}
                      onValueChange={(value) => handleInputChange("specialization", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر تخصصك" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="civil">القانون المدني</SelectItem>
                        <SelectItem value="criminal">القانون الجنائي</SelectItem>
                        <SelectItem value="commercial">القانون التجاري</SelectItem>
                        <SelectItem value="personal">الأحوال الشخصية</SelectItem>
                        <SelectItem value="administrative">القانون الإداري</SelectItem>
                        <SelectItem value="labor">قانون العمل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="lawyer-email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="lawyer-email"
                        type="email"
                        placeholder="example@email.com"
                        className="pr-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lawyer-phone">رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="lawyer-phone"
                        type="tel"
                        placeholder="7xxxxxxxx"
                        className="pr-10"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lawyer-password">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="lawyer-password"
                        type="password"
                        placeholder="أدخل كلمة المرور"
                        className="pr-10"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex space-x-2 space-x-reverse pt-4">
              <Button type="submit" className="flex-1">
                تسجيل الدخول
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                إلغاء
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
