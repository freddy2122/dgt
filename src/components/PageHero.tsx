import type { ReactNode } from 'react'
import Breadcrumbs from './Breadcrumbs'

type Props = {
  kicker?: string
  title: string
  crumbs?: { label: string; href?: string }[]
  children: ReactNode
}

export default function PageHero({ kicker, title, crumbs, children }: Props) {
  return (
    <div>
      <div className="bg-dgt-blue text-white">
        <div className="container py-10 md:py-14">
          {kicker && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              {kicker}
            </p>
          )}
          <h1 className="max-w-4xl text-3xl md:text-5xl font-bold leading-tight">{title}</h1>
        </div>
      </div>
      <div className="container py-10 md:py-12">
        {crumbs && crumbs.length > 0 && <Breadcrumbs items={crumbs} />}
        {children}
      </div>
    </div>
  )
}
