import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container py-20 text-center">
      <p className="text-6xl font-bold text-dgt-blue mb-4">404</p>
      <h1 className="text-2xl font-semibold text-dgt-blue mb-2">Página no encontrada</h1>
      <p className="text-dgt-gray-dark mb-8">
        La página que busca no existe o ha sido desplazada.
      </p>
      <Link
        to="/"
        className="inline-flex rounded-md bg-dgt-blue px-6 py-3 font-medium text-white hover:bg-dgt-blue-dark"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
