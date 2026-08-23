export const EXAM_TYPES = ['CIRCULACIÓN', 'MANIOBRAS', 'TEÓRICO', 'TEÓRICO EN PAPEL'] as const
export const EXAM_GRADES = ['APTO', 'NO APTO'] as const

export type ExamNoteFields = {
  exam_info_active: boolean
  exam_type: string | null
  exam_date: string | null
  exam_grade: string | null
  exam_errors: number | null
}

export const EXAM_SELECT =
  'exam_info_active, exam_type, exam_date, exam_grade, exam_errors, first_name, last_name, document_number, identifier, categories'
