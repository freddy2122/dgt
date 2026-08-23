import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { EXAM_SELECT, type ExamNoteFields } from '../lib/examNotes'
import { categoryList } from '../components/LicenseResult'
import { isoToDisplay } from '../lib/licenseLookup'

type ExamView = ExamNoteFields & {
  first_name: string | null
  last_name: string | null
  document_number: string | null
  identifier: string | null
  categories: string[] | string | null
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[13px] font-bold uppercase tracking-wide text-black">{label}</p>
      <p className="mt-0.5 text-[17px] text-[#222]">{value}</p>
    </div>
  )
}

function SedeHeader() {
  return (
    <header className="border-b border-[#d8d8d8] bg-white">
      <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4">
        <img
          src="https://sedegob.dggt.es/Logotipo_Footer-DGT.svg"
          alt="Gobierno de España — DGT"
          className="h-10 w-auto max-w-[58%] object-contain object-left sm:h-12"
        />
        <img src="/logo.png" alt="DGT" className="h-11 w-auto object-contain sm:h-12" />
      </div>
    </header>
  )
}

function EmptyNotes({ helpOpen, onToggleHelp }: { helpOpen: boolean; onToggleHelp: () => void }) {
  return (
    <section className="overflow-hidden rounded-sm bg-[#dce6ef]">
      <div className="flex items-center justify-between bg-[#0b4f8a] px-3 py-2.5 text-white">
        <h2 className="text-[13px] font-bold uppercase tracking-wide sm:text-sm">
          Resultado notas de exámenes
        </h2>
        <button
          type="button"
          onClick={onToggleHelp}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2f86c7] text-sm font-bold"
          aria-label="Ayuda"
        >
          ?
        </button>
      </div>
      {helpOpen && (
        <p className="border-b border-[#c5d3e0] px-4 py-3 text-sm text-[#333]">
          Las notas permanecen publicadas 15 días. El teórico por ordenador, el mismo día a partir
          de las 17:00. El práctico y el teórico en papel, al día siguiente a partir de las 17:00.
        </p>
      )}
      <div className="px-4 py-8 text-[15px] text-[#333]">
        No se han encontrado datos para esta consulta.
      </div>
    </section>
  )
}

export default function ResultadoNotasExamen() {
  const { id } = useParams()
  const [helpOpen, setHelpOpen] = useState(false)
  const [loading, setLoading] = useState(Boolean(id))
  const [exam, setExam] = useState<ExamView | null>(null)
  const [otherMessage, setOtherMessage] = useState('')

  useEffect(() => {
    if (!id) {
      setExam(null)
      setLoading(false)
      return
    }

    async function load() {
      const flag = await supabase.from('licenses').select('exam_info_active').eq('id', id).maybeSingle()

      if (flag.error || !flag.data?.exam_info_active) {
        setExam(null)
        setLoading(false)
        return
      }

      const full = await supabase.from('licenses').select(EXAM_SELECT).eq('id', id).maybeSingle()

      if (full.error || !full.data?.exam_info_active) {
        setExam(null)
      } else {
        setExam(full.data as ExamView)
      }
      setLoading(false)
    }

    void load()
  }, [id])

  const fullName = exam
    ? `${exam.last_name ?? ''} ${exam.first_name ?? ''}`.trim().toUpperCase()
    : ''
  const document = exam?.document_number || exam?.identifier || '—'
  const clase = exam ? categoryList(exam.categories)[0] || '—' : '—'
  const examDate = exam?.exam_date ? isoToDisplay(String(exam.exam_date).slice(0, 10)) : '—'

  return (
    <div className="min-h-screen bg-white">
      <SedeHeader />

      <div className="mx-auto max-w-[720px] px-4 pb-12 pt-5 sm:px-6 sm:pt-8">
        <div className="mb-5 flex flex-wrap items-end gap-x-4 gap-y-1">
          <h1 className="font-serif text-[28px] font-bold leading-none text-black sm:text-4xl">
            Sede electrónica
          </h1>
          <a
            href="https://sedegob.dggt.es/"
            className="pb-0.5 text-sm text-[#9aa0a6] sm:text-base"
          >
            https://sedegob.dggt.es/
          </a>
        </div>

        {loading ? (
          <p className="text-sm text-[#666]">Consultando…</p>
        ) : !exam ? (
          <EmptyNotes helpOpen={helpOpen} onToggleHelp={() => setHelpOpen((v) => !v)} />
        ) : (
          <section className="overflow-hidden rounded-sm bg-[#dce6ef]">
            <div className="flex items-center justify-between bg-[#0b4f8a] px-3 py-2.5 text-white">
              <h2 className="text-[13px] font-bold uppercase tracking-wide sm:text-sm">
                Resultado notas de exámenes
              </h2>
              <button
                type="button"
                onClick={() => setHelpOpen((v) => !v)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2f86c7] text-sm font-bold print:hidden"
                aria-label="Ayuda"
              >
                ?
              </button>
            </div>

            {helpOpen && (
              <p className="border-b border-[#c5d3e0] px-4 py-3 text-sm text-[#333] print:hidden">
                Las notas permanecen publicadas 15 días. Esta información sólo tiene valor
                informativo.
              </p>
            )}

            <div className="space-y-4 px-4 py-5 sm:px-6">
              <Field label="Apellidos, nombre" value={fullName || '—'} />
              <Field label="NIF/NIE" value={document} />
              <Field label="Clase de permiso" value={clase} />
              <Field label="Tipo de prueba" value={exam.exam_type || '—'} />
              <Field label="Fecha de examen" value={examDate} />
              <Field label="Calificación examen" value={exam.exam_grade || '—'} />
              <Field
                label="Número de errores"
                value={exam.exam_errors == null ? '—' : String(exam.exam_errors)}
              />

              <p className="pt-1 text-[13px] text-[#333]">
                Esta información sólo tiene valor informativo.
              </p>
              <p className="text-[12px] leading-relaxed text-[#333]">
                <strong>AVISO:</strong> Si no está de acuerdo con el resultado de la prueba, podrá
                interponer recurso de alzada ante el Director General de Tráfico en el plazo de un
                mes, o reclamación en el plazo de 15 días hábiles, según el tipo de recurso que
                corresponda.
              </p>
            </div>
          </section>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3 print:hidden">
          <button
            type="button"
            onClick={() => setOtherMessage('No hay más exámenes publicados.')}
            className="rounded-md bg-[linear-gradient(180deg,#5a5a5a,#2c2c2c)] px-3 py-2.5 text-center text-[13px] font-semibold text-white sm:text-sm"
          >
            Ver otros exámenes
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md bg-[linear-gradient(180deg,#5a5a5a,#2c2c2c)] px-3 py-2.5 text-center text-[13px] font-semibold text-white sm:text-sm"
          >
            Imprimir resultado
          </button>
          <Link
            to="/consulta-admitido-examen"
            className="col-span-2 mx-auto w-full max-w-[280px] rounded-md bg-[linear-gradient(180deg,#5a5a5a,#2c2c2c)] px-3 py-2.5 text-center text-[13px] font-semibold text-white sm:text-sm"
          >
            Volver a consultar
          </Link>
        </div>

        {otherMessage && (
          <p className="mt-3 text-center text-sm text-[#555] print:hidden">{otherMessage}</p>
        )}
      </div>
    </div>
  )
}
