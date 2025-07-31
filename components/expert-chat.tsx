"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, X } from "lucide-react"
import type { RealAnalysisResult } from "@/lib/legal-analyzer"
import { LegalAnalyzer } from "@/lib/legal-analyzer"

interface ExpertChatProps {
  isOpen: boolean
  onClose: () => void
  expert: {
    id: string
    name: string
    specialty: string
    rating: number
    avatar: string
  }
  user: {
    name: string
    type: "lawyer" | "citizen"
    id: string
  }
  caseData: RealAnalysisResult | null
}

interface Message {
  id: string
  sender: "user" | "expert"
  text: string
  timestamp: string
}

export function ExpertChat({ isOpen, onClose, expert, user, caseData }: ExpertChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSending, setIsSending] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial welcome message from expert
      const initialMessage: Message = {
        id: `msg-${Date.now()}-expert`,
        sender: "expert",
        text: `مرحباً ${user.name}! أنا ${expert.name}، خبير في ${expert.specialty}. كيف يمكنني مساعدتك بخصوص قضيتك؟`,
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([initialMessage])
    }
  }, [isOpen, messages.length, expert, user])

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return

    const newMessage: Message = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")
    setIsSending(true)

    try {
      // Prepare context for AI advice
      let context = ""
      if (caseData) {
        context += `ملخص القضية: ${caseData.caseSummary}\n`
        context += `الأطراف: المدعي ${caseData.extractedParties.plaintiff || "غير محدد"}، المدعى عليه ${
          caseData.extractedParties.defendant || "غير محدد"
        }\n`
        context += `المصطلحات الرئيسية: ${caseData.documentAnalysis[0]?.keyTerms.join(", ")}\n`
        context += `التحليل القانوني السابق: ${caseData.legalAnalysis}\n`
        context += `التوصيات السابقة: ${caseData.recommendedActions.join(", ")}\n`
      } else {
        context += "لا توجد بيانات قضية سابقة متاحة."
      }

      // Call AI for legal advice
      const aiResponseText = await LegalAnalyzer.getLegalAdvice(newMessage.text, context)

      const expertResponse: Message = {
        id: `msg-${Date.now()}-expert`,
        sender: "expert",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, expertResponse])
    } catch (error) {
      console.error("Error getting AI advice:", error)
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        sender: "expert",
        text: "عذرًا، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة لاحقًا.",
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] flex flex-col h-[80vh] max-h-[800px] p-0">
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Avatar className="h-10 w-10">
              <AvatarImage src={expert.avatar || "/placeholder.svg"} alt={expert.name} />
              <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-lg font-bold">{expert.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{expert.specialty}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className={`block text-xs mt-1 ${msg.sender === "user" ? "text-blue-200" : "text-gray-500"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 border-t flex items-center space-x-2 space-x-reverse">
          <Input
            placeholder="اكتب رسالتك هنا..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isSending) {
                handleSendMessage()
              }
            }}
            className="flex-1"
            disabled={isSending}
          />
          <Button onClick={handleSendMessage} disabled={isSending || inputMessage.trim() === ""}>
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
