import { Calendar } from 'lucide-react'
import { displayToIso, formatDateInput, isoToDisplay } from '../lib/licenseLookup'

export default function DateTextField({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        required
        placeholder="dd/mm/aaaa"
        value={value}
        onChange={(event) => onChange(formatDateInput(event.target.value))}
        className="w-full rounded-md border border-gray-300 px-3 py-2.5 pr-11 text-sm outline-none placeholder:text-gray-400 focus:border-[#004080] focus:ring-1 focus:ring-[#004080]"
      />
      <label className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center text-[#004080]">
        <Calendar className="h-4 w-4" strokeWidth={1.75} />
        <input
          type="date"
          aria-label="Abrir calendario"
          value={displayToIso(value)}
          onChange={(event) => onChange(isoToDisplay(event.target.value))}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
    </div>
  )
}
