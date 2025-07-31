import { DocumentAnalyzer, type DocumentAnalysisResult } from "./document-analyzer"
import {
  searchConstitutionArticles,
  getRelevantArticlesByCaseType,
  type ConstitutionArticle,
  type LegalArticle,
} from "./yemeni-constitution"
import { searchLegalArticles, searchPrecedents, type LegalPrecedent } from "./legal-database"

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
    // 1. تحليل المستندات المرفوعة لاستخراج البيانات الأولية
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

    // 2. دمج البيانات المستخرجة من جميع المستندات
    const mergedData = this.mergeDocumentData(documentAnalyses, caseDescription)

    // 3. البحث في الدستور اليمني والقوانين والسوابق القضائية (قواعد بيانات محاكاة)
    const constitutionalBasis = this.findConstitutionalBasis(mergedData, caseType)
    const applicableLaws = this.findApplicableLaws(mergedData, caseType)
    const precedents = this.findRelevantPrecedents(mergedData, caseType)

    // 4. استخدام الذكاء الاصطناعي للتحليل القانوني الشامل
    const aiAnalysis = await this.performAIAnalysis(
      mergedData,
      caseDescription,
      caseType,
      constitutionalBasis,
      applicableLaws,
      precedents,
    )

    // 5. حساب درجة الثقة الكلية
    const confidenceScore = this.calculateOverallConfidence(mergedData, aiAnalysis.confidenceScore)

    return {
      caseId: `YL-${Date.now()}`,
      documentAnalysis: documentAnalyses,
      caseSummary: aiAnalysis.caseSummary,
      extractedParties: mergedData.parties,
      disputeType: aiAnalysis.disputeType,
      extractedDates: mergedData.dates,
      extractedAmounts: mergedData.amounts,
      extractedLocations: mergedData.locations,
      claims: aiAnalysis.claims,
      defenses: aiAnalysis.defenses,
      keyDocuments: documentAnalyses.map((doc) => doc.documentType),
      constitutionalBasis,
      applicableLaws,
      precedents,
      legalAnalysis: aiAnalysis.legalAnalysis,
      recommendedActions: aiAnalysis.recommendedActions,
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
      confidence: 0, // Will be updated later
    }

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

    // حساب متوسط درجة الثقة من المستندات
    const totalDocConfidence = analyses.reduce((sum, analysis) => sum + analysis.confidence, 0)
    merged.confidence = analyses.length > 0 ? totalDocConfidence / analyses.length : 0

    return merged
  }

  // البحث عن الأساس الدستوري (محاكاة قاعدة بيانات)
  private static findConstitutionalBasis(data: DocumentAnalysisResult, caseType: string): ConstitutionArticle[] {
    const relevantArticles = getRelevantArticlesByCaseType(caseType)
    const searchResults = searchConstitutionArticles(data.keyTerms.join(" ") + " " + data.extractedText)

    const combined = [...relevantArticles, ...searchResults]
    const unique = combined.filter(
      (article, index, self) => index === self.findIndex((a) => a.number === article.number),
    )

    return unique.slice(0, 5)
  }

  // البحث عن القوانين المطبقة (محاكاة قاعدة بيانات)
  private static findApplicableLaws(data: DocumentAnalysisResult, caseType: string): LegalArticle[] {
    const searchQuery = data.keyTerms.join(" ") + " " + data.extractedText
    return searchLegalArticles(searchQuery).slice(0, 5)
  }

  // البحث عن السوابق القضائية (محاكاة قاعدة بيانات)
  private static findRelevantPrecedents(data: DocumentAnalysisResult, caseType: string): LegalPrecedent[] {
    const searchQuery = data.keyTerms.join(" ") + " " + data.extractedText
    return searchPrecedents(searchQuery).slice(0, 3)
  }

  // التحليل القانوني الشامل باستخدام الذكاء الاصطناعي
  private static async performAIAnalysis(
    mergedData: DocumentAnalysisResult,
    caseDescription: string,
    caseType: string,
    constitutionalBasis: ConstitutionArticle[],
    applicableLaws: LegalArticle[],
    precedents: LegalPrecedent[],
  ): Promise<{
    caseSummary: string
    disputeType: string
    claims: string[]
    defenses: string[]
    legalAnalysis: string
    recommendedActions: string[]
    confidenceScore: number
  }> {
    const prompt = `
      بصفتك خبيرًا قانونيًا يمنيًا متخصصًا، قم بتحليل القضية التالية بناءً على المستندات المستخرجة، وصف القضية، والمواد القانونية والسوابق القضائية ذات الصلة.
      قدم تحليلًا شاملًا في تنسيق JSON.

      **البيانات المستخرجة من المستندات:**
      - النص الكامل المستخرج (أول 1000 حرف): ${mergedData.extractedText.substring(0, 1000)}
      - نوع المستند (المحدد بواسطة النظام): ${mergedData.documentType}
      - الأطراف: المدعي: ${mergedData.parties.plaintiff || "غير محدد"}، المدعى عليه: ${
      mergedData.parties.defendant || "غير محدد"
    }، الشهود: ${mergedData.parties.witnesses?.join(", ") || "لا يوجد"}
      - التواريخ: ${mergedData.dates.join(", ") || "لا يوجد"}
      - المبال
