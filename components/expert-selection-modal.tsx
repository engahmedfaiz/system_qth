"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MessageCircle, Phone, Mail, Clock, CheckCircle, Users } from "lucide-react"

interface Expert {
  id: string
  name: string
  specialization: string
  rating: number
  reviewsCount: number
  experience: number
  isOnline: boolean
  responseTime: string
  hourlyRate: number
  avatar?: string
  bio: string
  cases: number
}

interface ExpertSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectExpert: (expert: Expert) => void
  caseType: string
}

const mockExperts: Expert[] = [
  {
    id: "expert_1",
    name: "د. أحمد محمد الشامي",
    specialization: "القانون المدني والعقاري",
    rating: 4.9,
    reviewsCount: 127,
    experience: 15,
    isOnline: true,
    responseTime: "خلال 10 دقائق",
    hourlyRate: 50,
    bio: "خبير في القانون المدني والعقاري مع خبرة 15 عاماً في المحاكم اليمنية. متخصص في قضايا الملكية والإخلاء.",
    cases: 450,
  },
  {
    id: "expert_2",
    name: "أ. فاطمة سالم الحداد",
    specialization: "الأحوال الشخصية",
    rating: 4.8,
    reviewsCount: 89,
    experience: 12,
    isOnline: true,
    responseTime: "خلال 15 دقيقة",
    hourlyRate: 45,
    bio: "محامية متخصصة في قضايا الأحوال الشخصية والميراث. حاصلة على ماجستير في القانون من جامعة صنعاء.",
    cases: 320,
  },
  {
    id: "expert_3",
    name: "أ. محمد علي الزبيري",
    specialization: "القانون التجاري والشركات",
    rating: 4.7,
    reviewsCount: 156,
    experience: 18,
    isOnline: false,
    responseTime: "خلال ساعة",
    hourlyRate: 60,
    bio: "خبير في القانون التجاري وقانون الشركات. مستشار قانوني لعدة شركات كبرى في اليمن.",
    cases: 580,
  },
  {
    id: "expert_4",
    name: "د. سارة أحمد المقطري",
    specialization: "القانون الجنائي",
    rating: 4.9,
    reviewsCount: 203,
    experience: 20,
    isOnline: true,
    responseTime: "خلال 5 دقائق",
    hourlyRate: 70,
    bio: "أستاذة القانون الجنائي بجامعة صنعاء ومحامية ممارسة. خبرة واسعة في القضايا الجنائية المعقدة.",
    cases: 720,
  },
]

export function ExpertSelectionModal({ isOpen, onClose, onSelectExpert, caseType }: ExpertSelectionModalProps) {
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null)

  const handleSelectExpert = () => {
    const expert = mockExperts.find((e) => e.id === selectedExpertId)
    if (expert) {
      onSelectExpert(expert)
      onClose()
    }
  }

  const getSpecializationMatch = (expertSpec: string) => {
    const matches: { [key: string]: string[] } = {
      "civil-property": ["القانون المدني والعقاري", "القانون المدني"],
      "civil-contract": ["القانون المدني والعقاري", "القانون التجاري والشركات"],
      "personal-marriage": ["الأحوال الشخصية"],
      "personal-inheritance": ["الأحوال الشخصية"],
      criminal: ["القانون الجنائي"],
      commercial: ["القانون التجاري والشركات"],
    }

    return matches[caseType]?.includes(expertSpec) || false
  }

  const sortedExperts = [...mockExperts].sort((a, b) => {
    const aMatch = getSpecializationMatch(a.specialization)
    const bMatch = getSpecializationMatch(b.specialization)

    if (aMatch && !bMatch) return -1
    if (!aMatch && bMatch) return 1
    if (a.isOnline && !b.isOnline) return -1
    if (!a.isOnline && b.isOnline) return 1
    return b.rating - a.rating
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="h-5 w-5 ml-2 text-blue-600" />
            اختيار خبير قانوني
          </DialogTitle>
          <DialogDescription>اختر الخبير المناسب لمراجعة قضيتك وتقديم المشورة القانونية</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {sortedExperts.map((expert) => (
            <Card
              key={expert.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedExpertId === expert.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => setSelectedExpertId(expert.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={expert.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                      {expert.name.split(" ")[0][0]}
                      {expert.name.split(" ")[1]?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{expert.name}</h3>
                        <p className="text-blue-600 font-medium">{expert.specialization}</p>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {expert.isOnline && (
                          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
                            متاح الآن
                          </Badge>
                        )}
                        {getSpecializationMatch(expert.specialization) && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                            متخصص في قضيتك
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">{expert.bio}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 ml-1" />
                        <span className="font-medium">{expert.rating}</span>
                        <span className="text-gray-500 mr-1">({expert.reviewsCount} تقييم)</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <CheckCircle className="h-4 w-4 ml-1" />
                        <span>{expert.experience} سنة خبرة</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 ml-1" />
                        <span>{expert.responseTime}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MessageCircle className="h-4 w-4 ml-1" />
                        <span>{expert.cases} قضية</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-lg font-semibold text-green-600">${expert.hourlyRate}/ساعة</div>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 ml-1" />
                          اتصال
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 ml-1" />
                          رسالة
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end space-x-2 space-x-reverse pt-4 border-t">
          <Button onClick={handleSelectExpert} disabled={!selectedExpertId} className="bg-blue-600 hover:bg-blue-700">
            <MessageCircle className="h-4 w-4 ml-2" />
            بدء المحادثة مع الخبير
          </Button>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
