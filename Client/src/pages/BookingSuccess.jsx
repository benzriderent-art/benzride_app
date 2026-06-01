import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, ArrowRight, MessageCircle, Search, Copy, Check, BookOpen, Phone, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { waLink } from '@/constants/contact'

const STEP_ICONS = [BookOpen, Phone, Package]

export default function BookingSuccess() {
  const [params] = useSearchParams()
  const { t } = useTranslation()
  const externalId = params.get('external_id')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!externalId) return
    navigator.clipboard.writeText(externalId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const steps = t('bookingSuccess.steps', { returnObjects: true })

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-off-white pt-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-14">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-emerald-50 border border-emerald-200">
              <CheckCircle size={36} className="text-emerald-500" />
            </div>
            <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
              {t('bookingSuccess.badge')}
            </p>
            <h1 className="font-heading text-4xl font-bold text-charcoal leading-[1.1] mb-4">
              {t('bookingSuccess.title')}
            </h1>
            <p className="text-gray-500 leading-relaxed">
              {t('bookingSuccess.desc')}
            </p>
          </div>

          {/* Booking ID card */}
          {externalId && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
              <div className="px-5 py-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">{t('bookingSuccess.idLabel')}</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-base text-charcoal font-bold tracking-wide">{externalId}</p>
                  <button
                    onClick={handleCopy}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                      copied
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-gold/50 hover:text-gold'
                    }`}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? t('bookingSuccess.copied') : t('bookingSuccess.copyId')}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">{t('bookingSuccess.idHint')}</p>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-3 mb-8">
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
          </div>

          {/* Next steps */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-sm font-bold text-charcoal mb-5">{t('bookingSuccess.nextStepsTitle')}</h2>
            <div className="space-y-5">
              {steps.map((step, i) => {
                const Icon = STEP_ICONS[i]
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={16} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal mb-0.5">{step.title}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-charcoal transition-colors"
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
