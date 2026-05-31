import { Routes, Route, useLocation } from 'react-router-dom'
import { AdminAuthProvider } from '@/context/AdminAuthContext'
import { CurrencyProvider } from '@/context/CurrencyContext'
import LandingPage from '@/pages/LandingPage'
import BookingPage from '@/pages/BookingPage'
import AdminLogin from '@/pages/admin/AdminLogin'
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminMotors from '@/pages/admin/AdminMotors'
import AdminBookings from '@/pages/admin/AdminBookings'
import AdminCalendar from '@/pages/admin/AdminCalendar'
import FleetPage from '@/pages/FleetPage'
import VehicleDetailPage from '@/pages/VehicleDetailPage'
import BookingTrackPage from '@/pages/BookingTrackPage'
import NotFound from '@/pages/NotFound'
import BookingSuccess from '@/pages/BookingSuccess'
import BookingFailed from '@/pages/BookingFailed'
import WAFloatButton from '@/components/common/WAFloatButton'
import ScrollToTop from '@/components/common/ScrollToTop'
import FAQPage from '@/pages/FAQPage'
import TermsPage from '@/pages/TermsPage'
import PrivacyPage from '@/pages/PrivacyPage'
import AboutPage from '@/pages/AboutPage'
import SeoLandingPage from '@/pages/SeoLandingPage'

function AppRoutes() {
  const { pathname } = useLocation()
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/fleet" element={<FleetPage />} />

        <Route path="/booking/success" element={<BookingSuccess />} />
        <Route path="/booking/failed" element={<BookingFailed />} />
        <Route path="/booking/track" element={<BookingTrackPage />} />
        <Route path="/booking/:slug" element={<BookingPage />} />
        <Route path="/about" element={<AboutPage />} />
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
