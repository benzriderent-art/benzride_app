import { Link, useNavigate } from 'react-router-dom'
import { XCircle, ArrowLeft, MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { waLink } from '@/constants/contact'

export default function BookingFailed() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-off-white flex flex-col items-center justify-center px-4 text-center pt-16">
        <div className="flex flex-col items-center max-w-md w-full">

          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-red-50 border border-red-200">
            <XCircle size={36} className="text-red-400" />
          </div>

          <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
            {t('bookingFailed.badge')}
          </p>
          <h1 className="font-heading text-4xl font-bold text-charcoal leading-[1.1] mb-4">
            {t('bookingFailed.title')}
          </h1>
          <p className="text-gray-500 leading-relaxed mb-8">
            {t('bookingFailed.desc')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:text-gold hover:border-gold/50 font-bold py-3.5 rounded-xl text-sm transition-colors bg-white"
            >
              <ArrowLeft size={15} />
              {t('bookingFailed.retry')}
            </button>
            <a
              href={waLink('Halo Benz Rental Bali, saya mengalami masalah saat pembayaran. Bisakah dibantu untuk proses pemesanan?')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl text-sm text-white hover:opacity-90 transition-opacity"
              style={{ background: '#25D366' }}
            >
              <MessageCircle size={16} />
              {t('bookingFailed.contactWA')}
            </a>
          </div>

          <Link to="/fleet" className="mt-5 text-xs text-gray-400 hover:text-gold transition-colors">
            {t('bookingFailed.viewOther')}
          </Link>

        </div>
      </div>
      <Footer />
    </>
  )
}
