// الدستور اليمني الكامل - المواد الأساسية
export interface ConstitutionArticle {
  number: number
  title: string
  text: string
  chapter: string
  relevantCases: string[]
}

export const yemeniConstitutionArticles: ConstitutionArticle[] = [
  {
    number: 1,
    title: "طبيعة الدولة",
    text: "الجمهورية اليمنية دولة عربية إسلامية مستقلة ذات سيادة، وحدتها لا تتجزأ، ولا يجوز التنازل عن أي جزء منها، والشعب اليمني جزء من الأمة العربية والإسلامية.",
    chapter: "الأحكام العامة",
    relevantCases: ["قضايا السيادة", "النزاعات الحدودية"],
  },
  {
    number: 2,
    title: "الدين والشريعة",
    text: "الإسلام دين الدولة، والشريعة الإسلامية مصدر جميع التشريعات.",
    chapter: "الأحكام العامة",
    relevantCases: ["الأحوال الشخصية", "المعاملات المالية", "الجرائم الحدية"],
  },
  {
    number: 15,
    title: "حق التقاضي",
    text: "التقاضي حق مصون ومكفول للناس كافة، ولكل مواطن حق الالتجاء إلى قاضيه الطبيعي، والدفاع عن حقوقه وحرياته بكافة الوسائل المشروعة، والقانون يحدد إجراءات التقاضي ويكفل سرعة الفصل في القضايا.",
    chapter: "الحقوق والحريات العامة",
    relevantCases: ["جميع القضايا المدنية والجنائية", "حق الدفاع", "سرعة التقاضي"],
  },
  {
    number: 47,
    title: "الملكية الخاصة",
    text: "الملكية الخاصة مصونة، ولا يجوز المساس بها إلا للمصلحة العامة ومقابل تعويض عادل وفقاً للقانون، ولا يجوز نزع الملكية إلا بحكم قضائي.",
    chapter: "الحقوق الاقتصادية والاجتماعية",
    relevantCases: ["نزاعات الملكية", "نزع الملكية للمنفعة العامة", "التعويضات"],
  },
  {
    number: 48,
    title: "حق الإرث",
    text: "الإرث حق تكفله الشريعة الإسلامية والقانون.",
    chapter: "الحقوق الاقتصادية والاجتماعية",
    relevantCases: ["قضايا الميراث", "النزاعات العائلية", "تقسيم التركات"],
  },
  {
    number: 25,
    title: "المساواة أمام القانون",
    text: "المواطنون متساوون أمام القانون، وهم متساوون في الحقوق والواجبات العامة، ولا تمييز بينهم في ذلك بسبب الجنس أو اللون أو الأصل أو اللغة أو المهنة أو المركز الاجتماعي أو العقيدة الدينية.",
    chapter: "الحقوق والحريات العامة",
    relevantCases: ["التمييز", "المساواة", "حقوق الإنسان"],
  },
  {
    number: 31,
    title: "حرمة المسكن",
    text: "للمساكن حرمة، فلا يجوز دخولها أو تفتيشها إلا في الأحوال المبينة في القانون وبالكيفية المنصوص عليها فيه.",
    chapter: "الحقوق والحريات العامة",
    relevantCases: ["انتهاك حرمة المسكن", "التفتيش غير القانوني", "الحماية الجنائية"],
  },
  {
    number: 149,
    title: "استقلال القضاء",
    text: "السلطة القضائية مستقلة، وتتولاها المحاكم على اختلاف أنواعها ودرجاتها، وتصدر أحكامها وفقاً للقانون، ولا يجوز لأية سلطة التدخل في القضايا أو في شؤون العدالة.",
    chapter: "السلطة القضائية",
    relevantCases: ["استقلال القضاء", "التدخل في القضايا", "ضمانات المحاكمة"],
  },
]

// البحث في مواد الدستور
export function searchConstitutionArticles(query: string): ConstitutionArticle[] {
  const searchTerms = query.toLowerCase().split(" ")

  return yemeniConstitutionArticles.filter((article) => {
    const articleText = (article.title + " " + article.text + " " + article.relevantCases.join(" ")).toLowerCase()

    return searchTerms.some(
      (term) =>
        articleText.includes(term) || article.relevantCases.some((caseType) => caseType.toLowerCase().includes(term)),
    )
  })
}

// الحصول على المواد ذات الصلة بنوع القضية
export function getRelevantArticlesByCaseType(caseType: string): ConstitutionArticle[] {
  const caseTypeMapping: { [key: string]: number[] } = {
    "civil-property": [47, 15, 25],
    "civil-contract": [47, 15, 2],
    "personal-marriage": [2, 48, 15],
    "personal-inheritance": [2, 48, 15],
    criminal: [15, 25, 31, 149],
    administrative: [15, 25, 149],
    commercial: [47, 15, 2],
  }

  const relevantNumbers = caseTypeMapping[caseType] || [15, 25]
  return yemeniConstitutionArticles.filter((article) => relevantNumbers.includes(article.number))
}
