import { DocumentAnalyzer, type DocumentAnalysisResult } from "./document-analyzer"
import {
  searchConstitutionArticles,
  getRelevantArticlesByCaseType,
  type ConstitutionArticle,
} from "./yemeni-constitution"
import { searchLegalArticles, searchPrecedents, type LegalArticle, type LegalPrecedent } from "./legal-database"

export interface RealAnalysisResult {
  caseId: string
  documentAnalysis: DocumentAnalysisResult[]
  caseSummary: string
  extractedParties: {
    plaintiff: string
    defendant: string
    witnesses: string[]
  }
  disputeType: string
  extractedDates: string[]
  extractedAmounts: string[]
  extractedLocations: string[]
  claims: string[]
  defenses: string[]
  keyDocuments: string[]
  constitutionalBasis: ConstitutionArticle[]
  applicableLaws: LegalArticle[]
  precedents: LegalPrecedent[]
  legalAnalysis: string
  recommendedActions: string[]
  confidenceScore: number
  analysisNotes: string[]
}

export class LegalAnalyzer {
  static async analyzeCase(files: File[], caseDescription: string, caseType: string): Promise<RealAnalysisResult> {
    // 1. تحليل المستندات المرفوعة
    const documentAnalyses: DocumentAnalysisResult[] = []

    for (const file of files) {
      try {
        const extractedText = await DocumentAnalyzer.extractTextFromFile(file)
        const analysis = DocumentAnalyzer.analyzeExtractedText(extractedText)
        documentAnalyses.push(analysis)
      } catch (error) {
        console.error(`خطأ في تحليل الملف ${file.name}:`, error)
      }
    }

    // 2. دمج البيانات المستخرجة
    const mergedData = this.mergeDocumentData(documentAnalyses, caseDescription)

    // 3. البحث في الدستور اليمني
    const constitutionalBasis = this.findConstitutionalBasis(mergedData, caseType)

    // 4. البحث في القوانين ذات الصلة
    const applicableLaws = this.findApplicableLaws(mergedData, caseType)

    // 5. البحث في السوابق القضائية
    const precedents = this.findRelevantPrecedents(mergedData, caseType)

    // 6. تحليل قانوني شامل
    const legalAnalysis = this.generateLegalAnalysis(mergedData, constitutionalBasis, applicableLaws, precedents)

    // 7. تقييم قوة القضية
    const confidenceScore = this.calculateConfidenceScore(mergedData, constitutionalBasis, applicableLaws, precedents)

    // 8. توصيات قانونية
    const recommendedActions = this.generateRecommendations(mergedData, constitutionalBasis, applicableLaws)

    return {
      caseId: `YL-${Date.now()}`,
      documentAnalysis: documentAnalyses,
      caseSummary: this.generateCaseSummary(mergedData),
      extractedParties: mergedData.parties,
      disputeType: this.determineDisputeType(mergedData, caseType),
      extractedDates: mergedData.dates,
      extractedAmounts: mergedData.amounts,
      extractedLocations: mergedData.locations,
      claims: this.extractClaims(mergedData),
      defenses: this.extractDefenses(mergedData),
      keyDocuments: documentAnalyses.map((doc) => doc.documentType),
      constitutionalBasis,
      applicableLaws,
      precedents,
      legalAnalysis,
      recommendedActions,
      confidenceScore,
      analysisNotes: this.generateAnalysisNotes(mergedData, documentAnalyses),
    }
  }

  // دمج البيانات من جميع المستندات
  private static mergeDocumentData(analyses: DocumentAnalysisResult[], description: string): DocumentAnalysisResult {
    const merged: DocumentAnalysisResult = {
      extractedText: analyses.map((a) => a.extractedText).join("\n\n") + "\n\n" + description,
      documentType: "مجموعة مستندات",
      parties: { plaintiff: "", defendant: "", witnesses: [] },
      dates: [],
      amounts: [],
      locations: [],
      legalReferences: [],
      keyTerms: [],
    }

    // دمج البيانات من جميع المستندات
    analyses.forEach((analysis) => {
      if (analysis.parties.plaintiff && !merged.parties.plaintiff) {
        merged.parties.plaintiff = analysis.parties.plaintiff
      }
      if (analysis.parties.defendant && !merged.parties.defendant) {
        merged.parties.defendant = analysis.parties.defendant
      }
      if (analysis.parties.witnesses) {
        merged.parties.witnesses = [...(merged.parties.witnesses || []), ...analysis.parties.witnesses]
      }

      merged.dates.push(...analysis.dates)
      merged.amounts.push(...analysis.amounts)
      merged.locations.push(...analysis.locations)
      merged.legalReferences.push(...analysis.legalReferences)
      merged.keyTerms.push(...analysis.keyTerms)
    })

    // إزالة التكرار
    merged.dates = [...new Set(merged.dates)]
    merged.amounts = [...new Set(merged.amounts)]
    merged.locations = [...new Set(merged.locations)]
    merged.legalReferences = [...new Set(merged.legalReferences)]
    merged.keyTerms = [...new Set(merged.keyTerms)]
    merged.parties.witnesses = [...new Set(merged.parties.witnesses || [])]

    return merged
  }

  // البحث عن الأساس الدستوري
  private static findConstitutionalBasis(data: DocumentAnalysisResult, caseType: string): ConstitutionArticle[] {
    const relevantArticles = getRelevantArticlesByCaseType(caseType)
    const searchResults = searchConstitutionArticles(data.keyTerms.join(" "))

    // دمج النتائج وإزالة التكرار
    const combined = [...relevantArticles, ...searchResults]
    const unique = combined.filter(
      (article, index, self) => index === self.findIndex((a) => a.number === article.number),
    )

    return unique.slice(0, 5) // أهم 5 مواد
  }

  // البحث عن القوانين المطبقة
  private static findApplicableLaws(data: DocumentAnalysisResult, caseType: string): LegalArticle[] {
    const searchQuery = data.keyTerms.join(" ")
    return searchLegalArticles(searchQuery).slice(0, 5)
  }

  // البحث عن السوابق القضائية
  private static findRelevantPrecedents(data: DocumentAnalysisResult, caseType: string): LegalPrecedent[] {
    const searchQuery = data.keyTerms.join(" ")
    return searchPrecedents(searchQuery).slice(0, 3)
  }

  // توليد التحليل القانوني
  private static generateLegalAnalysis(
    data: DocumentAnalysisResult,
    constitutional: ConstitutionArticle[],
    laws: LegalArticle[],
    precedents: LegalPrecedent[],
  ): string {
    let analysis = "التحليل القانوني المبني على المستندات المرفوعة:\n\n"

    analysis += "1. الأساس الدستوري:\n"
    constitutional.forEach((article) => {
      analysis += `- المادة ${article.number}: ${article.title}\n`
      analysis += `  ${article.text.substring(0, 100)}...\n\n`
    })

    analysis += "2. القوانين المطبقة:\n"
    laws.forEach((law) => {
      analysis += `- ${law.law} - ${law.article}\n`
      analysis += `  ${law.text.substring(0, 100)}...\n\n`
    })

    analysis += "3. السوابق القضائية:\n"
    precedents.forEach((precedent) => {
      analysis += `- قضية رقم ${precedent.caseNumber} لسنة ${precedent.year}\n`
      analysis += `  ${precedent.summary.substring(0, 100)}...\n\n`
    })

    return analysis
  }

  // حساب درجة الثقة
  private static calculateConfidenceScore(
    data: DocumentAnalysisResult,
    constitutional: ConstitutionArticle[],
    laws: LegalArticle[],
    precedents: LegalPrecedent[],
  ): number {
    let score = 30 // نقطة البداية

    // نقاط للبيانات المستخرجة
    if (data.parties.plaintiff && data.parties.defendant) score += 20
    if (data.parties.plaintiff && !data.parties.defendant) score += 10
    if (data.dates.length > 0) score += 15
    if (data.dates.length > 2) score += 5
    if (data.amounts.length > 0) score += 10
    if (data.locations.length > 0) score += 10
    if (data.legalReferences.length > 0) score += 15
    if (data.keyTerms.length >= 3) score += 10
    if (data.keyTerms.length >= 5) score += 5

    // نقاط للتحليل القانوني
    if (constitutional.length > 0) score += 10
    if (laws.length > 0) score += 10
    if (precedents.length > 0) score += 10

    // نقاط إضافية لجودة البيانات
    if (data.extractedText.length > 500) score += 5
    if (data.documentType !== "مستند عام") score += 5

    // تقليل النقاط للنواقص
    if (!data.parties.plaintiff && !data.parties.defendant) score -= 25
    if (data.keyTerms.length < 2) score -= 15
    if (data.extractedText.length < 100) score -= 20

    return Math.min(Math.max(score, 0), 100)
  }

  // توليد التوصيات
  private static generateRecommendations(
    data: DocumentAnalysisResult,
    constitutional: ConstitutionArticle[],
    laws: LegalArticle[],
  ): string[] {
    const recommendations: string[] = []

    if (!data.parties.plaintiff || !data.parties.defendant) {
      recommendations.push("يجب تحديد أسماء جميع أطراف القضية بوضوح")
    }

    if (data.dates.length === 0) {
      recommendations.push("يُنصح بإرفاق المستندات التي تحتوي على تواريخ مهمة")
    }

    if (data.legalReferences.length === 0) {
      recommendations.push("يجب الاستناد إلى نصوص قانونية محددة لتقوية القضية")
    }

    if (constitutional.length > 0) {
      recommendations.push(`الاستناد إلى المادة ${constitutional[0].number} من الدستور اليمني`)
    }

    if (laws.length > 0) {
      recommendations.push(`تطبيق أحكام ${laws[0].law} - ${laws[0].article}`)
    }

    return recommendations
  }

  // توليد ملخص القضية
  private static generateCaseSummary(data: DocumentAnalysisResult): string {
    let summary = ""

    // إذا كانت هناك أطراف محددة
    if (data.parties.plaintiff && data.parties.defendant) {
      summary += `قدم المدعي ${data.parties.plaintiff} دعوى قضائية ضد المدعى عليه ${data.parties.defendant}. `
    }

    // إضافة نوع المستند
    if (data.documentType && data.documentType !== "مستند عام") {
      summary += `المستند المحلل هو ${data.documentType}. `
    }

    // إضافة المواقع
    if (data.locations.length > 0) {
      summary += `القضية تتعلق بعقار/موقع في ${data.locations.join("، ")}. `
    }

    // إضافة التواريخ المهمة
    if (data.dates.length > 0) {
      summary += `التواريخ المهمة في القضية تشمل: ${data.dates.slice(0, 3).join("، ")}. `
    }

    // إضافة المبالغ المالية
    if (data.amounts.length > 0) {
      summary += `المبالغ المالية المذكورة: ${data.amounts.slice(0, 2).join("، ")}. `
    }

    // إضافة المصطلحات القانونية
    if (data.keyTerms.length > 0) {
      summary += `القضية تتضمن المصطلحات القانونية التالية: ${data.keyTerms.slice(0, 5).join("، ")}. `
    }

    // إضافة المراجع القانونية إن وجدت
    if (data.legalReferences.length > 0) {
      summary += `تم العثور على المراجع القانونية التالية في المستندات: ${data.legalReferences.join("، ")}. `
    }

    return summary || "تم تحليل المستندات المرفوعة واستخراج المعلومات المتاحة منها."
  }

  // تحديد نوع النزاع
  private static determineDisputeType(data: DocumentAnalysisResult, caseType: string): string {
    const keyTerms = data.keyTerms.join(" ").toLowerCase()

    if (keyTerms.includes("ملكية") || keyTerms.includes("إخلاء")) {
      return "نزاع على الملكية العقارية"
    } else if (keyTerms.includes("عقد") || keyTerms.includes("اتفاق")) {
      return "نزاع تعاقدي"
    } else if (keyTerms.includes("ميراث") || keyTerms.includes("وراثة")) {
      return "نزاع في الميراث"
    } else if (keyTerms.includes("زواج") || keyTerms.includes("طلاق")) {
      return "نزاع في الأحوال الشخصية"
    }

    return "نزاع قانوني عام"
  }

  // استخراج المطالبات
  private static extractClaims(data: DocumentAnalysisResult): string[] {
    const claims: string[] = []
    const text = data.extractedText.toLowerCase()

    // البحث عن المطالبات الصريحة
    if (text.includes("إخلاء") || text.includes("طلب إخلاء")) {
      claims.push("طلب إخلاء العقار المتنازع عليه")
    }
    if (text.includes("تعويض") || text.includes("التعويض")) {
      claims.push("المطالبة بالتعويض عن الأضرار")
    }
    if (text.includes("أجرة المثل") || text.includes("اجرة المثل")) {
      claims.push("المطالبة بأجرة المثل عن فترة الشغل غير المشروع")
    }
    if (text.includes("إثبات ملكية") || text.includes("ملكية")) {
      claims.push("إثبات الملكية للعقار محل النزاع")
    }
    if (text.includes("مصروفات") || text.includes("أتعاب")) {
      claims.push("إلزام المدعى عليه بالمصروفات والأتعاب")
    }
    if (text.includes("فسخ العقد") || text.includes("فسخ")) {
      claims.push("طلب فسخ العقد")
    }
    if (text.includes("تنفيذ العقد") || text.includes("تنفيذ")) {
      claims.push("إلزام المدعى عليه بتنفيذ العقد")
    }

    // إذا لم نجد مطالبات محددة، نستخرج من السياق
    if (claims.length === 0) {
      if (data.keyTerms.includes("ملكية")) {
        claims.push("مطالبات متعلقة بالملكية العقارية")
      }
      if (data.keyTerms.includes("عقد")) {
        claims.push("مطالبات تعاقدية")
      }
      if (data.keyTerms.includes("ميراث")) {
        claims.push("مطالبات في الميراث")
      }
    }

    return claims.length > 0 ? claims : ["مطالبات قانونية مستخرجة من المستندات"]
  }

  // استخراج الدفوع
  private static extractDefenses(data: DocumentAnalysisResult): string[] {
    const defenses: string[] = []
    const text = data.extractedText.toLowerCase()

    if (text.includes("إنكار") || text.includes("ينكر")) {
      defenses.push("إنكار الادعاءات الواردة في صحيفة الدعوى")
    }
    if (text.includes("عدم صحة") || text.includes("غير صحيح")) {
      defenses.push("الطعن في صحة المستندات المقدمة")
    }
    if (text.includes("تقادم") || text.includes("التقادم")) {
      defenses.push("الدفع بالتقادم")
    }
    if (text.includes("عدم الاختصاص")) {
      defenses.push("الدفع بعدم اختصاص المحكمة")
    }
    if (text.includes("سبق الفصل")) {
      defenses.push("الدفع بسبق الفصل في الموضوع")
    }

    // دفوع افتراضية بناءً على نوع القضية
    if (data.keyTerms.includes("ملكية")) {
      defenses.push("الدفع بعدم ثبوت الملكية للمدعي")
      defenses.push("إثبات حق الانتفاع أو الإيجار")
    }
    if (data.keyTerms.includes("عقد")) {
      defenses.push("الدفع بعدم صحة العقد أو بطلانه")
      defenses.push("عدم تنفيذ المدعي لالتزاماته التعاقدية")
    }

    return defenses.length > 0 ? defenses : ["دفوع قانونية محتملة بناءً على طبيعة القضية"]
  }

  // توليد ملاحظات التحليل
  private static generateAnalysisNotes(data: DocumentAnalysisResult, analyses: DocumentAnalysisResult[]): string[] {
    const notes: string[] = []

    notes.push(`تم تحليل ${analyses.length} مستند`)
    notes.push(`استُخرج ${data.keyTerms.length} مصطلح قانوني`)
    notes.push(`تم العثور على ${data.dates.length} تاريخ مهم`)
    notes.push(`تم تحديد ${data.locations.length} موقع`)

    if (data.legalReferences.length > 0) {
      notes.push(`تم العثور على ${data.legalReferences.length} مرجع قانوني`)
    }

    return notes
  }
}
