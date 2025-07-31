// قاعدة البيانات القانونية اليمنية
export interface LegalArticle {
  id: string
  law: string
  article: string
  text: string
  category: string
  keywords: string[]
}

export interface LegalPrecedent {
  id: string
  caseNumber: string
  year: string
  court: string
  summary: string
  ruling: string
  keywords: string[]
  category: string
}

// الدستور اليمني - مواد مختارة
export const yemeniConstitution: LegalArticle[] = [
  {
    id: "const_1",
    law: "الدستور اليمني",
    article: "المادة 1",
    text: "الجمهورية اليمنية دولة عربية إسلامية مستقلة ذات سيادة، وحدتها لا تتجزأ، ولا يجوز التنازل عن أي جزء منها، والشعب اليمني جزء من الأمة العربية والإسلامية.",
    category: "أحكام عامة",
    keywords: ["دولة", "سيادة", "وحدة", "عربية", "إسلامية"],
  },
  {
    id: "const_15",
    law: "الدستور اليمني",
    article: "المادة 15",
    text: "التقاضي حق مصون ومكفول للناس كافة، ولكل مواطن حق الالتجاء إلى قاضيه الطبيعي، والدفاع عن حقوقه وحرياته بكافة الوسائل المشروعة.",
    category: "حقوق وحريات",
    keywords: ["تقاضي", "قاضي طبيعي", "دفاع", "حقوق", "حريات"],
  },
  {
    id: "const_47",
    law: "الدستور اليمني",
    article: "المادة 47",
    text: "الملكية الخاصة مصونة، ولا يجوز المساس بها إلا للمصلحة العامة ومقابل تعويض عادل وفقاً للقانون.",
    category: "حقوق اقتصادية",
    keywords: ["ملكية خاصة", "مصونة", "مصلحة عامة", "تعويض"],
  },
]

// القانون المدني اليمني - مواد مختارة
export const yemeniCivilLaw: LegalArticle[] = [
  {
    id: "civil_674",
    law: "القانون المدني اليمني",
    article: "المادة 674",
    text: "للمالك الحق في استعمال ملكه والتصرف فيه واستغلاله في حدود القانون، وله أن يسترد ملكه من يد الغير.",
    category: "حق الملكية",
    keywords: ["مالك", "استعمال", "تصرف", "استغلال", "استرداد"],
  },
  {
    id: "civil_675",
    law: "القانون المدني اليمني",
    article: "المادة 675",
    text: "لا يجوز لأحد أن يغتصب ملك الغير أو يعتدي عليه، ومن فعل ذلك وجب عليه رد الملك إلى صاحبه مع التعويض عن الأضرار.",
    category: "حق الملكية",
    keywords: ["اغتصاب", "اعتداء", "رد", "تعويض", "أضرار"],
  },
  {
    id: "civil_147",
    law: "القانون المدني اليمني",
    article: "المادة 147",
    text: "العقد شريعة المتعاقدين، فلا يجوز نقضه ولا تعديله إلا باتفاق الطرفين أو للأسباب التي يقررها القانون.",
    category: "العقود",
    keywords: ["عقد", "شريعة المتعاقدين", "نقض", "تعديل", "اتفاق"],
  },
]

// قانون المرافعات اليمني - مواد مختارة
export const yemeniProcedureLaw: LegalArticle[] = [
  {
    id: "proc_3",
    law: "قانون المرافعات اليمني",
    article: "المادة 3",
    text: "لا يجوز لأحد أن يتقاضى عن حق ليس له أو ينوب عن غيره في الخصومة إلا بوكالة صحيحة أو بصفة نظامية.",
    category: "أحكام عامة",
    keywords: ["تقاضي", "حق", "نيابة", "وكالة", "صفة نظامية"],
  },
  {
    id: "proc_45",
    law: "قانون المرافعات اليمني",
    article: "المادة 45",
    text: "يجب أن تشتمل صحيفة الدعوى على بيان المحكمة المرفوعة إليها الدعوى وأسماء الخصوم وصفاتهم وموطن كل منهم وموضوع الدعوى وأسانيدها والطلبات.",
    category: "إجراءات المحاكمة",
    keywords: ["صحيفة الدعوى", "محكمة", "خصوم", "موضوع", "أسانيد", "طلبات"],
  },
]

// السوابق القضائية اليمنية - أمثلة
export const yemeniPrecedents: LegalPrecedent[] = [
  {
    id: "prec_156_2019",
    caseNumber: "156/2019",
    year: "2019",
    court: "المحكمة العليا",
    summary:
      "قضت المحكمة العليا بأن عقد البيع المسجل لدى كاتب العدل يعتبر حجة قاطعة على الملكية ولا يجوز الطعن فيه إلا بالتزوير.",
    ruling: "الحكم لصالح المدعي بإثبات الملكية",
    keywords: ["عقد بيع", "كاتب العدل", "حجة قاطعة", "ملكية", "تزوير"],
    category: "ملكية عقارية",
  },
  {
    id: "prec_89_2021",
    caseNumber: "89/2021",
    year: "2021",
    court: "محكمة الاستئناف",
    summary: "حكمت محكمة الاستئناف بأن الشغل بدون سند قانوني يوجب الإخلاء وأجرة المثل عن فترة الشغل غير المشروع.",
    ruling: "إلزام الشاغل بالإخلاء ودفع أجرة المثل",
    keywords: ["شغل", "سند قانوني", "إخلاء", "أجرة المثل", "غير مشروع"],
    category: "إخلاء عقاري",
  },
  {
    id: "prec_234_2020",
    caseNumber: "234/2020",
    year: "2020",
    court: "المحكمة العليا",
    summary: "أكدت المحكمة العليا أن الإنذار العدلي شرط أساسي قبل رفع دعوى الإخلاء، وأن عدم توجيه الإنذار يبطل الدعوى.",
    ruling: "بطلان دعوى الإخلاء لعدم توجيه إنذار مسبق",
    keywords: ["إنذار عدلي", "شرط أساسي", "إخلاء", "بطلان", "دعوى"],
    category: "إجراءات قانونية",
  },
]

// دالة البحث في القوانين
export function searchLegalArticles(query: string, category?: string): LegalArticle[] {
  const allArticles = [...yemeniConstitution, ...yemeniCivilLaw, ...yemeniProcedureLaw]

  return allArticles.filter((article) => {
    const matchesQuery =
      article.keywords.some((keyword) => keyword.includes(query) || query.includes(keyword)) ||
      article.text.includes(query)

    const matchesCategory = !category || article.category === category

    return matchesQuery && matchesCategory
  })
}

// دالة البحث في السوابق القضائية
export function searchPrecedents(query: string, category?: string): LegalPrecedent[] {
  return yemeniPrecedents.filter((precedent) => {
    const matchesQuery =
      precedent.keywords.some((keyword) => keyword.includes(query) || query.includes(keyword)) ||
      precedent.summary.includes(query)

    const matchesCategory = !category || precedent.category === category

    return matchesQuery && matchesCategory
  })
}

// دالة تحليل نوع القضية
export function analyzeCaseType(description: string): {
  type: string
  confidence: number
  suggestedLaws: string[]
} {
  const keywords = {
    ملكية: { type: "civil-property", laws: ["القانون المدني", "قانون التسجيل العقاري"] },
    عقد: { type: "civil-contract", laws: ["القانون المدني", "القانون التجاري"] },
    إخلاء: { type: "civil-property", laws: ["القانون المدني", "قانون المرافعات"] },
    جريمة: { type: "criminal", laws: ["قانون العقوبات", "قانون الإجراءات الجزائية"] },
    زواج: { type: "personal-status", laws: ["قانون الأحوال الشخصية"] },
    ميراث: { type: "personal-status", laws: ["قانون الأحوال الشخصية"] },
    تجاري: { type: "commercial", laws: ["القانون التجاري", "قانون الشركات"] },
  }

  for (const [keyword, info] of Object.entries(keywords)) {
    if (description.includes(keyword)) {
      return {
        type: info.type,
        confidence: 0.8,
        suggestedLaws: info.laws,
      }
    }
  }

  return {
    type: "general",
    confidence: 0.3,
    suggestedLaws: ["القانون المدني", "قانون المرافعات"],
  }
}
