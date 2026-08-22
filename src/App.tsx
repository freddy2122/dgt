import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import SedeElectronica from './pages/SedeElectronica'
import Trafico from './pages/Trafico'
import Seguridad from './pages/Seguridad'
import ConoceDgt from './pages/ConoceDgt'
import Comunicacion from './pages/Comunicacion'
import Transparencia from './pages/Transparencia'
import InfoPage from './pages/InfoPage'
import VerificarPermiso from './pages/VerificarPermiso'
import LicensePublicView from './pages/LicensePublicView'
import NotFound from './pages/NotFound'
import AdminRegister from './pages/admin/AdminRegister'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import LicenseList from './pages/admin/LicenseList'
import LicenseForm from './pages/admin/LicenseForm'
import LicenseManage from './pages/admin/LicenseManage'
import AdminLayout from './components/admin/AdminLayout'

export default function App() {
  return (
    <Routes>
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-register-administration" element={<AdminRegister />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="licenses" element={<LicenseList />} />
        <Route path="license/new" element={<LicenseForm />} />
        <Route path="license/:id/edit" element={<LicenseForm />} />
        <Route path="license/:id/manage" element={<LicenseManage />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/verificar-permiso" element={<VerificarPermiso />} />
        <Route path="/license/:id/view" element={<LicensePublicView />} />
        <Route path="/sede-electronica" element={<SedeElectronica />} />
        <Route path="/seguridad" element={<Seguridad />} />
        <Route path="/trafico" element={<Trafico />} />
        <Route path="/conoce-dgt" element={<ConoceDgt />} />
        <Route path="/comunicacion" element={<Comunicacion />} />
        <Route path="/transparencia" element={<Transparencia />} />
        <Route
          path="/pagar-multas"
          element={
            <InfoPage
              kicker="Trámites"
              title="Pagar multas"
              text="Pago de multas y sanciones de tráfico de forma segura. Accede a la Sede Electrónica para consultar y abonar tus sanciones."
              image="/images/Pagar-multas-700x.jpg"
            />
          }
        />
        <Route
          path="/cita-previa"
          element={
            <InfoPage
              kicker="Trámites"
              title="Cita previa"
              text="Solicita cita previa para realizar tus trámites presenciales en las jefaturas de tráfico."
              image="/images/rdv.jpg"
            />
          }
        />
        <Route
          path="/consultar-puntos"
          element={
            <InfoPage
              kicker="Trámites"
              title="Consultar puntos"
              text="Consulta el saldo de puntos de tu permiso de conducir de forma rápida y segura."
              image="/images/carnet-de-conducir.jpg"
            />
          }
        />
        <Route
          path="/renovar-permiso"
          element={
            <InfoPage
              kicker="Trámites"
              title="Renovar permiso"
              text="Renovación del permiso de conducir por internet. Trámite disponible 24 horas."
              image="/images/Midgt-Listados-renew.jpg"
            />
          }
        />
        <Route
          path="/cambio-domicilio"
          element={
            <InfoPage
              kicker="Trámites"
              title="Cambio de domicilio"
              text="Cambio de domicilio del titular del vehículo o conductor. Puedes actualizar tus datos desde la Sede Electrónica."
              image="/images/Conductores-noveles-Listados.jpg"
            />
          }
        />
        <Route
          path="/certificados"
          element={
            <InfoPage
              kicker="Trámites"
              title="Descargar certificados"
              text="Descarga certificados de antecedentes, puntos y más, con validez legal, desde la Sede Electrónica."
              image="/images/Carril-Emergencias-Listado.jpg"
            />
          }
        />
        <Route
          path="/dgt-digital"
          element={
            <InfoPage
              kicker="Digitalización"
              title="DGT es Digital"
              text="La DGT apuesta por la digitalización de todos sus servicios. Realiza la mayoría de trámites desde tu móvil o ordenador, sin necesidad de desplazarte."
            />
          }
        />
        <Route
          path="/consejos-seguridad"
          element={<Navigate to="/seguridad" replace />}
        />
        <Route path="/organigrama" element={<Navigate to="/conoce-dgt" replace />} />
        <Route path="/estadisticas" element={<Navigate to="/transparencia" replace />} />
        <Route path="/todas-camaras" element={<Navigate to="/trafico" replace />} />
        <Route
          path="/contacto"
          element={
            <InfoPage
              kicker="Atención"
              title="Contacto"
              text="Teléfono de información: 060. Información de tráfico: 011. Dirección: C/ Josefa Valcárcel, 44, Madrid."
            />
          }
        />
        <Route
          path="/aviso-legal"
          element={
            <InfoPage
              title="Aviso legal"
              text="Este portal es una recreación de demostración del diseño de un sitio institucional. No es un sitio oficial de la Administración."
            />
          }
        />
        <Route
          path="/politica-privacidad"
          element={
            <InfoPage
              title="Política de privacidad"
              text="Esta demostración no recopila datos personales. No se almacenan identificadores, DNI ni credenciales."
            />
          }
        />
        <Route
          path="/politica-cookies"
          element={
            <InfoPage
              title="Política de cookies"
              text="Esta demostración no utiliza cookies de seguimiento."
            />
          }
        />
        <Route
          path="/accesibilidad"
          element={
            <InfoPage
              title="Accesibilidad"
              text="El sitio sigue principios de accesibilidad: contraste, navegación por teclado y textos alternativos en las imágenes principales."
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
