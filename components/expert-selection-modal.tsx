"use client"

import { Badge } from "@/components/ui/badge"

import { CardContent } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, CheckCircle } from "lucide-react"

interface ExpertSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectExpert: (expert: any) => void
  caseType: string
}

const mockExperts = [
  {
    id: "1",
    name: "أ.د. علي الحمادي",
    specialty: "قانون دستوري وإداري",
    rating: 4.9,
    avatar: "/placeholder-user.jpg",
    bio: "أستاذ القانون الدستوري والإداري بجامعة صنعاء، خبرة 25 عامًا في القضايا الإدارية والدستورية.",
    expertise: ["دستوري", "إداري", "منازعات إدارية", "قانون عام"],
  },
  {
    id: "2",
    name: "المحامية فاطمة الزهراء",
    specialty: "قانون أحوال شخصية وميراث",
    rating: 4.8,
    avatar: "/placeholder-user.jpg",
    bio: "متخصصة في قضايا الأحوال الشخصية والميراث، بخبرة 18 عامًا في المحاكم اليمنية.",
    expertise: ["أحوال شخصية", "ميراث", "طلاق", "زواج", "نفقة", "حضانة"],
  },
  {
    id: "3",
    name: "المستشار خالد اليمني",
    specialty: "قانون تجاري وعقود",
    rating: 4.7,
    avatar: "/placeholder-user.jpg",
    bio: "مستشار قانوني للعديد من الشركات، متخصص في صياغة العقود والنزاعات التجارية.",
    expertise: ["تجاري", "عقود", "شركات", "ملكية فكرية", "تحكيم تجاري"],
  },
  {
    id: "4",
    name: "القاضي المتقاعد أحمد سعيد",
    specialty: "قانون مدني وعقاري",
    rating: 4.9,
    avatar: "/placeholder-user.jpg",
    bio: "قاضي سابق بخبرة 30 عامًا في القضايا المدنية والعقارية، يقدم استشارات دقيقة.",
    expertise: ["مدني", "عقاري", "ملكية", "إخلاء", "تعويضات", "نزاعات مدنية"],
  },
]

export function ExpertSelectionModal({ isOpen, onClose, onSelectExpert, caseType }: ExpertSelectionModalProps) {
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null)

  const getFilteredExperts = () => {
    if (!caseType) return mockExperts

    const lowerCaseCaseType = caseType.toLowerCase()
    return mockExperts.filter((expert) => expert.expertise.some((exp) => lowerCaseCaseType.includes(exp.toLowerCase())))
  }

  const filteredExperts = getFilteredExperts()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">اختر خبيرًا قانونيًا</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            اختر الخبير الأنسب لقضيتك بناءً على تخصصه وتقييماته.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {filteredExperts.length > 0 ? (
            filteredExperts.map((expert) => (
              <Card
                key={expert.id}
                className={`cursor-pointer hover:border-blue-500 transition-all ${
                  selectedExpertId === expert.id ? "border-2 border-blue-600 shadow-lg" : ""
                }`}
                onClick={() => setSelectedExpertId(expert.id)}
              >
                <CardContent className="flex items-center p-4 space-x-4 space-x-reverse">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={expert.avatar || "/placeholder.svg"} alt={expert.name} />
                    <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{expert.name}</h3>
                    <p className="text-sm text-muted-foreground">{expert.specialty}</p>
                    <div className="flex items-center text-sm text-yellow-500 mt-1">
                      <Star className="h-4 w-4 ml-1 fill-yellow-500" />
                      <span>{expert.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {expert.expertise.map((exp, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {selectedExpertId === expert.id && <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-8">
              لا يوجد خبراء متاحون لهذا النوع من القضايا حاليًا.
            </div>
          )}
        </div>
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => onSelectExpert(mockExperts.find((e) => e.id === selectedExpertId))}
            disabled={!selectedExpertId}
            className="w-full max-w-xs bg-blue-600 hover:bg-blue-700"
          >
            تأكيد الاختيار وبدء الاستشارة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
