import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "النظام القانوني الذكي - نظام الذكاء الاصطناعي القانوني لليمن",
  description:
    "نظام ذكاء اصطناعي متطور لتحليل القضايا القانونية وتقديم المشورة القانونية المساعدة بناءً على الدستور والقوانين اليمنية",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
