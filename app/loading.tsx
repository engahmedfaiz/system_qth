import { Brain } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <div className="animate-pulse">
          <Brain className="h-20 w-20 text-blue-600 mx-auto mb-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">جاري تحميل النظام القانوني الذكي...</h2>
        <p className="text-gray-600 mb-6">يرجى الانتظار بينما نقوم بتهيئة بيئة التحليل.</p>
        <Progress value={75} className="w-full h-3 bg-blue-200" />
        <p className="text-sm text-gray-500 mt-3">هذه العملية قد تستغرق بضع ثوانٍ.</p>
      </div>
    </div>
  )
}
