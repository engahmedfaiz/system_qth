import { PDFReader } from "./pdf-reader"
import { ImageOCR } from "./image-ocr"

// محلل المستندات الحقيقي
export interface DocumentAnalysisResult {
  extractedText: string
  documentType: string
  parties: {
    plaintiff?: string
    defendant?: string
    witnesses?: string[]
  }
  dates: string[]
  amounts: string[]
  locations: string[]
  legalReferences: string[]
  keyTerms: string[]
  confidence: number
}

export class DocumentAnalyzer {
  // استخراج النص من الملفات الحقيقية
  static async extractTextFromFile(file: File): Promise<string> {
    try {
      if (file.type === "application/pdf") {
        return await PDFReader.extractTextFromPDF(file)
      } else if (file.type.startsWith("image/")) {
        return await ImageOCR.extractTextFromImage(file)
      } else if (file.type.includes("word") || file.type.includes("document")) {
        // قراءة ملفات Word
        return await this.extractTextFromWord(file)
      } else if (file.type === "text/plain") {
        // قراءة الملفات النصية
        return await this.extractTextFromTextFile(file)
      } else {
        return "نوع الملف غير مدعوم"
      }
    } catch (error) {
      console.error("خطأ في استخراج النص:", error)
      return "خطأ في قراءة الملف"
    }
  }

  // قراءة ملفات Word
  private static async extractTextFromWord(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)

      // البحث عن النصوص في ملف Word
      const decoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: false })
      const rawText = decoder.decode(uint8Array)

      // استخراج النصوص العربية
      const arabicTextMatches = rawText.match(
        /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\d.,:\-/$$$$]+/g,
      )

      if (arabicTextMatches) {
        return arabicTextMatches
          .filter((text) => text.trim().length > 3)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim()
      }

      return "لم يتم العثور على نص قابل للقراءة في ملف Word"
    } catch (error) {
      return "خطأ في قراءة ملف Word"
    }
  }

  // قراءة الملفات النصية
  private static async extractTextFromTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsText(file, "utf-8")
    })
  }

  // تحليل النص المستخرج الحقيقي
  static analyzeExtractedText(text: string): DocumentAnalysisResult {
    if (!text || text.trim().length === 0) {
      return {
        extractedText: "",
        documentType: "مستند فارغ",
        parties: {},
        dates: [],
        amounts: [],
        locations: [],
        legalReferences: [],
        keyTerms: [],
        confidence: 0,
      }
    }

    const result: DocumentAnalysisResult = {
      extractedText: text,
      documentType: this.detectDocumentType(text),
      parties: this.extractParties(text),
      dates: this.extractDates(text),
      amounts: this.extractAmounts(text),
      locations: this.extractLocations(text),
      legalReferences: this.extractLegalReferences(text),
      keyTerms: this.extractKeyTerms(text),
      confidence: this.calculateExtractionConfidence(text),
    }

    return result
  }

  // حساب درجة الثقة في الاستخراج
  private static calculateExtractionConfidence(text: string): number {
    let confidence = 0

    // طول النص
    if (text.length > 100) confidence += 20
    if (text.length > 500) confidence += 10
    if (text.length > 1000) confidence += 10

    // وجود كلمات عربية
    const arabicWords = text.match(/[\u0600-\u06FF]+/g)
    if (arabicWords && arabicWords.length > 10) confidence += 20

    // وجود تواريخ
    const dates = this.extractDates(text)
    if (dates.length > 0) confidence += 15

    // وجود أسماء
    const parties = this.extractParties(text)
    if (parties.plaintiff || parties.defendant) confidence += 15

    // وجود مصطلحات قانونية
    const legalTerms = this.extractKeyTerms(text)
    if (legalTerms.length > 0) confidence += 10

    return Math.min(confidence, 100)
  }

  // تحديد نوع المستند من النص الحقيقي
  private static detectDocumentType(text: string): string {
    const patterns = {
      "صحيفة دعوى": /صحيفة\s*دعوى|دعوى\s*مدنية|دعوى\s*جنائية|المدعي|المدعى\s*عليه/gi,
      "عقد بيع": /عقد\s*بيع|بيع\s*وشراء|البائع|المشتري|الثمن|المبيع/gi,
      "عقد إيجار": /عقد\s*إيجار|إيجار|المؤجر|المستأجر|الأجرة|المأجور/gi,
      "حكم قضائي": /حكم|قضت\s*المحكمة|تقرر|باسم\s*الشعب|المحكمة\s*العليا/gi,
      "إنذار عدلي": /إنذار\s*عدلي|إنذار|كاتب\s*العدل|ينذر|المنذر/gi,
      وكالة: /وكالة|وكيل|موكل|ينيب|بالوكالة/gi,
      شهادة: /شهادة|يشهد|الشاهد|نشهد/gi,
      "عقد زواج": /عقد\s*زواج|زواج|الزوج|الزوجة|المهر|الصداق/gi,
      وصية: /وصية|الموصي|الموصى\s*له|أوصي|وصيتي/gi,
    }

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return type
      }
    }

    return "مستند قانوني عام"
  }

  // استخراج أسماء الأطراف من النص الحقيقي
  private static extractParties(text: string): { plaintiff?: string; defendant?: string; witnesses?: string[] } {
    const parties: { plaintiff?: string; defendant?: string; witnesses?: string[] } = {}

    // أنماط متعددة لاستخراج المدعي
    const plaintiffPatterns = [
      /المدعي\s*:?\s*([أ-ي\s]{5,50}?)(?=\n|العنوان|الهاتف|المدعى|$)/gi,
      /المشتري\s*:?\s*([أ-ي\s]{5,50}?)(?=\n|العنوان|الهاتف|البائع|$)/gi,
      /المؤجر\s*:?\s*([أ-ي\s]{5,50}?)(?=\n|العنوان|الهاتف|المستأجر|$)/gi,
      /الموكل\s*:?\s*([أ-ي\s]{5,50}?)(?=\n|العنوان|الهاتف|الوكيل|$)/gi,
    ]

    for (const pattern of plaintiffPatterns) {
      const matches = [...text.matchAll(pattern)]
      if (matches.length > 0) {
        parties.plaintiff = matches[0][1].trim()
        break
      }
    }

    // أنماط متعددة لاستخراج المدعى عليه
    const defendantPatterns = [
      /المدعى\s*عليه\s*:?\s*([أ-ي\s]{5,50}?)(?=\n|العنوان|الهاتف|موضوع|$)/gi,
      /البائع\s*:?\s*([أ-ي\s]{5,50}?)(?=\n|العنوان|الهاتف|المشتري|$)/gi,
      /المستأجر\s*:?\s*([أ-ي\s]{5,50}?)(?=\n|العنوان|الهاتف|المؤجر|$)/gi,
      /الوكيل\s*:?\s*([أ-ي\s]{5,50}?)(?=\n|العنوان|الهاتف|الموكل|$)/gi,
    ]

    for (const pattern of defendantPatterns) {
      const matches = [...text.matchAll(pattern)]
      if (matches.length > 0) {
        parties.defendant = matches[0][1].trim()
        break
      }
    }

    // استخراج الشهود
    const witnessPatterns = [
      /الشاهد\s*الأول\s*:?\s*([أ-ي\s]{5,50}?)(?=\n|الشاهد|$)/gi,
      /الشاهد\s*الثاني\s*:?\s*([أ-ي\s]{5,50}?)(?=\n|الشاهد|$)/gi,
      /شاهد\s*:?\s*([أ-ي\s]{5,50}?)(?=\n|شاهد|$)/gi,
    ]

    const witnesses: string[] = []
    witnessPatterns.forEach((pattern) => {
      const matches = [...text.matchAll(pattern)]
      matches.forEach((match) => {
        const witness = match[1].trim()
        if (witness && !witnesses.includes(witness)) {
          witnesses.push(witness)
        }
      })
    })

    if (witnesses.length > 0) {
      parties.witnesses = witnesses
    }

    return parties
  }

  // استخراج التواريخ من النص الحقيقي
  private static extractDates(text: string): string[] {
    const datePatterns = [
      /\d{1,2}\/\d{1,2}\/\d{4}/g,
      /\d{4}\/\d{1,2}\/\d{1,2}/g,
      /\d{1,2}-\d{1,2}-\d{4}/g,
      /\d{1,2}\.\d{1,2}\.\d{4}/g,
      /في\s*يوم\s*\w*\s*الموافق\s*(\d{1,2}\/\d{1,2}\/\d{4})/g,
      /بتاريخ\s*(\d{1,2}\/\d{1,2}\/\d{4})/g,
      /مؤرخ\s*في\s*(\d{1,2}\/\d{1,2}\/\d{4})/g,
      /التاريخ\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{4})/g,
    ]

    const dates: string[] = []
    datePatterns.forEach((pattern) => {
      const matches = [...text.matchAll(pattern)]
      matches.forEach((match) => {
        const dateStr = match[1] || match[0]
        const cleanDate = dateStr.match(
          /\d{1,2}\/\d{1,2}\/\d{4}|\d{4}\/\d{1,2}\/\d{1,2}|\d{1,2}-\d{1,2}-\d{4}|\d{1,2}\.\d{1,2}\.\d{4}/,
        )
        if (cleanDate && !dates.includes(cleanDate[0])) {
          dates.push(cleanDate[0])
        }
      })
    })

    return dates
  }

  // استخراج المبالغ المالية من النص الحقيقي
  private static extractAmounts(text: string): string[] {
    const amountPatterns = [
      /\d{1,3}(?:[,،]\d{3})*\s*ريال/g,
      /\d+\s*ريال/g,
      /\d{1,3}(?:[,،]\d{3})*\s*دولار/g,
      /مبلغ\s*:?\s*(\d{1,3}(?:[,،]\d{3})*)\s*ريال/g,
      /الثمن\s*:?\s*(\d{1,3}(?:[,،]\d{3})*)\s*ريال/g,
      /أجرة\s*المثل\s*:?\s*(\d{1,3}(?:[,،]\d{3})*)\s*ريال/g,
      /بواقع\s*(\d{1,3}(?:[,،]\d{3})*)\s*ريال/g,
      /المهر\s*:?\s*(\d{1,3}(?:[,،]\d{3})*)\s*ريال/g,
      /الصداق\s*:?\s*(\d{1,3}(?:[,،]\d{3})*)\s*ريال/g,
    ]

    const amounts: string[] = []
    amountPatterns.forEach((pattern) => {
      const matches = [...text.matchAll(pattern)]
      matches.forEach((match) => {
        if (!amounts.includes(match[0])) {
          amounts.push(match[0])
        }
      })
    })

    return amounts
  }

  // استخراج المواقع من النص الحقيقي
  private static extractLocations(text: string): string[] {
    const yemeniCities = [
      "صنعاء",
      "عدن",
      "تعز",
      "الحديدة",
      "إب",
      "ذمار",
      "المكلا",
      "سيئون",
      "زبيد",
      "يريم",
      "جبلة",
      "رداع",
      "عمران",
      "صعدة",
      "مأرب",
      "الجوف",
      "حضرموت",
      "شبوة",
      "أبين",
      "لحج",
      "الضالع",
      "البيضاء",
      "ريمة",
      "محويت",
    ]

    const locations: string[] = []

    // البحث عن المدن اليمنية
    yemeniCities.forEach((city) => {
      if (text.includes(city) && !locations.includes(city)) {
        locations.push(city)
      }
    })

    // البحث عن الأحياء والمناطق
    const areaPatterns = [
      /حي\s*([أ-ي\s]+?)(?=\s*-|\s*،|\s*\.|\n|$)/g,
      /منطقة\s*([أ-ي\s]+?)(?=\s*-|\s*،|\s*\.|\n|$)/g,
      /شارع\s*([أ-ي\s]+?)(?=\s*-|\s*،|\s*\.|\n|$)/g,
      /العنوان\s*:?\s*([أ-ي\s-]+?)(?=\n|الهاتف|$)/g,
    ]

    areaPatterns.forEach((pattern) => {
      const matches = [...text.matchAll(pattern)]
      matches.forEach((match) => {
        const location = match[1].trim()
        if (location && location.length > 2 && location.length < 50 && !locations.includes(location)) {
          locations.push(location)
        }
      })
    })

    return locations
  }

  // استخراج المراجع القانونية من النص الحقيقي
  private static extractLegalReferences(text: string): string[] {
    const legalPatterns = [
      /المادة\s*\d+/g,
      /القانون\s*رقم\s*\d+/g,
      /الدستور/g,
      /قانون\s*[أ-ي\s]+/g,
      /المرسوم\s*رقم\s*\d+/g,
      /القرار\s*رقم\s*\d+/g,
      /اللائحة\s*رقم\s*\d+/g,
    ]

    const references: string[] = []
    legalPatterns.forEach((pattern) => {
      const matches = text.match(pattern)
      if (matches) {
        matches.forEach((match) => {
          if (!references.includes(match)) {
            references.push(match)
          }
        })
      }
    })

    return references
  }

  // استخراج المصطلحات القانونية من النص الحقيقي
  private static extractKeyTerms(text: string): string[] {
    const legalTerms = [
      "ملكية",
      "إخلاء",
      "تعويض",
      "أجرة المثل",
      "عقد",
      "دعوى",
      "حكم",
      "استئناف",
      "نقض",
      "تنفيذ",
      "حجز",
      "رهن",
      "ضمان",
      "كفالة",
      "وراثة",
      "ميراث",
      "وصية",
      "طلاق",
      "نفقة",
      "حضانة",
      "زواج",
      "مهر",
      "صداق",
      "خلع",
      "فسخ",
      "بطلان",
      "إبطال",
      "تصديق",
      "توثيق",
      "تسجيل",
      "شهر",
      "إعلان",
      "تبليغ",
      "حضور",
      "غياب",
    ]

    const foundTerms: string[] = []
    legalTerms.forEach((term) => {
      if (text.includes(term) && !foundTerms.includes(term)) {
        foundTerms.push(term)
      }
    })

    return foundTerms
  }
}
