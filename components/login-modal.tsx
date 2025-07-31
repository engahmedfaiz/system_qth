"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Lock, LogIn } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: { name: string; type: "lawyer" | "citizen"; id: string }) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<"lawyer" | "citizen">("citizen")
  const [error, setError] = useState<string | null>(null)

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (username.trim() === "" || password.trim() === "") {
      setError("الرجاء إدخال اسم المستخدم وكلمة المرور.")
      return
    }

    // Mock authentication logic
    if (username === "user" && password === "password") {
      onLogin({ name: "مستخدم تجريبي", type: userType, id: "mock-user-123" })
      onClose()
    } else if (username === "lawyer" && password === "password") {
      onLogin({ name: "محامي تجريبي", type: "lawyer", id: "mock-lawyer-456" })
      onClose()
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">تسجيل الدخول</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            سجل الدخول للوصول إلى جميع ميزات النظام.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLoginSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">اسم المستخدم</Label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="username"
                placeholder="اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="password"
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="user-type">نوع المستخدم</Label>
            <Select value={userType} onValueChange={(value: "lawyer" | "citizen") => setUserType(value)}>
              <SelectTrigger id="user-type">
                <SelectValue placeholder="اختر نوع المستخدم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="citizen">مواطن</SelectItem>
                <SelectItem value="lawyer">محامي / خبير</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            <LogIn className="h-4 w-4 ml-2" />
            تسجيل الدخول
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
