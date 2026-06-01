import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AdminAuthProvider } from '@/context/AdminAuthContext'
import { CurrencyProvider } from '@/context/CurrencyContext'
import WAFloatButton from '@/components/common/WAFloatButton'
import ScrollToTop from '@/components/common/ScrollToTop'

const LandingPage       = lazy(() => import('@/pages/LandingPage'))
const BookingPage       = lazy(() => import('@/pages/BookingPage'))
const FleetPage         = lazy(() => import('@/pages/FleetPage'))
const VehicleDetailPage = lazy(() => import('@/pages/VehicleDetailPage'))
const BookingTrackPage  = lazy(() => import('@/pages/BookingTrackPage'))
const BookingSuccess    = lazy(() => import('@/pages/BookingSuccess'))
const BookingFailed     = lazy(() => import('@/pages/BookingFailed'))
const AboutPage         = lazy(() => import('@/pages/AboutPage'))
const ContactPage       = lazy(() => import('@/pages/ContactPage'))
const FAQPage           = lazy(() => import('@/pages/FAQPage'))
const TermsPage         = lazy(() => import('@/pages/TermsPage'))
const PrivacyPage       = lazy(() => import('@/pages/PrivacyPage'))
const SeoLandingPage    = lazy(() => import('@/pages/SeoLandingPage'))
const NotFound          = lazy(() => import('@/pages/NotFound'))
const AdminLogin        = lazy(() => import('@/pages/admin/AdminLogin'))
const AdminLayout       = lazy(() => import('@/pages/admin/AdminLayout'))
const AdminDashboard    = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminMotors       = lazy(() => import('@/pages/admin/AdminMotors'))
const AdminBookings     = lazy(() => import('@/pages/admin/AdminBookings'))
const AdminCalendar     = lazy(() => import('@/pages/admin/AdminCalendar'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#C9A24B', borderTopColor: 'transparent' }} />
    </div>
  )
}

function AppRoutes() {
  const { pathname } = useLocation()
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/fleet" element={<FleetPage />} />

          <Route path="/booking/success" element={<BookingSuccess />} />
          <Route path="/booking/failed" element={<BookingFailed />} />
          <Route path="/booking/track" element={<BookingTrackPage />} />
          <Route path="/booking/:slug" element={<BookingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/sewa-motor-:area" element={<SeoLandingPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="motors" element={<AdminMotors />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="calendar" element={<AdminCalendar />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!pathname.startsWith('/admin') && <WAFloatButton />}
    </>
  )
}

export default function App() {
  return (
    <CurrencyProvider>
      <AdminAuthProvider>
        <AppRoutes />
      </AdminAuthProvider>
    </CurrencyProvider>
  )
}
