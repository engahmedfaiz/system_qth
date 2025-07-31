"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Send, Paperclip, Phone, Video, MoreVertical, Star, Clock, CheckCircle, FileText, Download } from "lucide-react"

interface Message {
  id: string
  sender: "user" | "expert"
  content: string
  timestamp: Date
  type: "text" | "file" | "case-summary"
  fileUrl?: string
  fileName?: string
}

interface ExpertChatProps {
  isOpen: boolean
  onClose: () => void
  expert: any
  user: any
  caseData: any
}

export function ExpertChat({ isOpen, onClose, expert, user, caseData }: ExpertChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Add null checks
  if (!expert || !user) {
    return null
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && caseData && user && expert) {
      // إرسال ملخص القضية تلقائياً عند بدء المحادثة
      const caseSummaryMessage: Message = {
        id: `case_summary_${Date.now()}`,
        sender: "user",
        content: `تم إرسال ملخص القضية للمراجعة`,
        timestamp: new Date(),
        type: "case-summary",
      }

      setMessages([caseSummaryMessage])

      // رد تلقائي من الخبير
      setTimeout(() => {
        const expertReply: Message = {
          id: `expert_welcome_${Date.now()}`,
          sender: "expert",
          content: `مرحباً ${user?.name || "عزيزي المستخدم"}، تم استلام ملخص قضيتك وسأقوم بمراجعتها الآن. سأعود إليك خلال دقائق قليلة بتحليل مفصل.`,
          timestamp: new Date(),
          type: "text",
        }
        setMessages((prev) => [...prev, expertReply])
      }, 2000)

      // تحليل الخبير
      setTimeout(() => {
        const expertAnalysis: Message = {
          id: `expert_analysis_${Date.now()}`,
          sender: "expert",
          content: `بعد مراجعة قضيتك، أرى أن لديك قضية قوية. النقاط الإيجابية:
          
• وجود عقد بيع مسجل لدى كاتب العدل
• تطابق السوابق القضائية مع موقفك
• وضوح النصوص القانونية المطبقة

النقاط التي تحتاج تقوية:
• الحصول على مسح رسمي للأرض
• إحضار شهود عيان على واقعة الشغل
• توثيق جميع المراسلات مع المدعى عليه

هل تريد مناقشة أي نقطة بالتفصيل؟`,
          timestamp: new Date(),
          type: "text",
        }
        setMessages((prev) => [...prev, expertAnalysis])
      }, 8000)
    }
  }, [isOpen, caseData, user, expert])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: `msg_${Date.now()}`,
      sender: "user",
      content: newMessage,
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
    setIsTyping(true)

    // محاكاة رد الخبير
    setTimeout(
      () => {
        setIsTyping(false)
        const expertReply: Message = {
          id: `expert_${Date.now()}`,
          sender: "expert",
          content: getExpertResponse(newMessage),
          timestamp: new Date(),
          type: "text",
        }
        setMessages((prev) => [...prev, expertReply])
      },
      2000 + Math.random() * 3000,
    )
  }

  const getExpertResponse = (userMessage: string): string => {
    const responses = [
      "شكراً لسؤالك. بناءً على خبرتي، أنصحك بـ...",
      "هذه نقطة مهمة جداً. من الناحية القانونية...",
      "أفهم قلقك. دعني أوضح لك الوضع القانوني...",
      "هذا سؤال ممتاز. وفقاً للقانون اليمني...",
      "بالتأكيد يمكنني مساعدتك في هذا الأمر...",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ar-YE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0" dir="rtl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {expert?.name?.split(" ")[0]?.[0] || "خ"}
                    {expert.name.split(" ")[1]?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-lg">{expert?.name || "خبير قانوني"}</DialogTitle>
                  <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
                      {expert?.isOnline ? "متاح الآن" : "غير متاح"}
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 ml-1" />
                      {expert?.rating || 0}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
                  {message.sender === "expert" && (
                    <div className="flex items-center mb-1">
                      <Avatar className="h-6 w-6 ml-2">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                          {expert?.name?.split(" ")[0]?.[0] || "خ"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600">{expert.name}</span>
                    </div>
                  )}

                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : message.type === "case-summary"
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {message.type === "case-summary" ? (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-green-600 ml-2" />
                          <span className="font-medium text-green-800">ملخص القضية</span>
                        </div>
                        <div className="text-sm text-gray-700">
                          <p>
                            <strong>نوع القضية:</strong> {caseData?.disputeType}
                          </p>
                          <p>
                            <strong>الأطراف:</strong> {caseData?.parties?.plaintiff} ضد {caseData?.parties?.defendant}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Download className="h-4 w-4 ml-2" />
                          تحميل التفاصيل الكاملة
                        </Button>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line">{message.content}</p>
                    )}
                  </div>

                  <div
                    className={`text-xs text-gray-500 mt-1 ${message.sender === "user" ? "text-left" : "text-right"}`}
                  >
                    {formatTime(message.timestamp)}
                    {message.sender === "user" && <CheckCircle className="h-3 w-3 inline mr-1 text-blue-600" />}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                      {expert?.name?.split(" ")[0]?.[0] || "خ"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder="اكتب رسالتك..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <div className="flex items-center">
                <Clock className="h-3 w-3 ml-1" />
                متوسط الرد: {expert?.responseTime || "غير محدد"}
              </div>
              <div>${expert?.hourlyRate || 0}/ساعة • الجلسة نشطة</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
