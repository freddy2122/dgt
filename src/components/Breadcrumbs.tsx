import { Link } from 'react-router-dom'

type Crumb = { label: string; href?: string }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Miga de pan" className="mb-6 text-sm text-dgt-gray-dark">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link to="/" className="hover:text-dgt-blue hover:underline">
            Inicio
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1">
            <span className="text-gray-400">/</span>
            {item.href ? (
              <Link to={item.href} className="hover:text-dgt-blue hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-dgt-blue font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
