import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, ArrowRight, MessageCircle, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { waLink } from '@/constants/contact'

export default function BookingSuccess() {
  const [params] = useSearchParams()
  const { t } = useTranslation()
  const externalId = params.get('external_id')

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-off-white flex flex-col items-center justify-center px-4 text-center pt-16">
        <div className="flex flex-col items-center max-w-md w-full">

          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-emerald-50 border border-emerald-200">
            <CheckCircle size={36} className="text-emerald-500" />
          </div>

          <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
            {t('bookingSuccess.badge')}
          </p>
          <h1 className="font-heading text-4xl font-bold text-charcoal leading-[1.1] mb-4">
            {t('bookingSuccess.title')}
          </h1>
          <p className="text-gray-500 leading-relaxed mb-6">
            {t('bookingSuccess.desc')}
          </p>

          {externalId && (
            <div className="w-full bg-white rounded-xl px-5 py-4 mb-6 text-left border border-gray-200 shadow-sm">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{t('bookingSuccess.idLabel')}</p>
              <p className="font-mono text-sm text-charcoal font-semibold">{externalId}</p>
              <p className="text-[11px] text-gray-400 mt-1.5">{t('bookingSuccess.idHint')}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 w-full">
            <a
              href={waLink('Halo Benz Rental Bali, saya baru saja menyelesaikan pembayaran. Mohon konfirmasi pengiriman motor. Terima kasih!')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl text-sm text-white hover:opacity-90 transition-opacity"
              style={{ background: '#25D366' }}
            >
              <MessageCircle size={16} />
              {t('bookingSuccess.confirmWA')}
            </a>
            {externalId && (
              <Link
                to={`/booking/track?id=${externalId}`}
                className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:text-gold hover:border-gold/50 font-bold py-3 rounded-xl text-sm transition-colors bg-white"
              >
                <Search size={14} />
                {t('bookingSuccess.trackBtn')}
              </Link>
            )}
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-2 text-gray-400 hover:text-charcoal text-sm transition-colors py-1"
            >
              {t('bookingSuccess.backHome')}
              <ArrowRight size={13} />
            </Link>
          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}
