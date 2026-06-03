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
      <div className="min-h-screen bg-charcoal pt-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-14">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <CheckCircle size={36} className="text-emerald-500" />
            </div>
            <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
              {t('bookingSuccess.badge')}
            </p>
            <h1 className="font-heading text-4xl font-bold text-white leading-[1.1] mb-4">
              {t('bookingSuccess.title')}
            </h1>
            <p className="text-white/40 leading-relaxed">
              {t('bookingSuccess.desc')}
            </p>
          </div>

          {/* Booking ID card */}
          {externalId && (
            <div className="rounded-xl mb-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <div className="px-5 py-4">
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">{t('bookingSuccess.idLabel')}</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-base text-white font-bold tracking-wide">{externalId}</p>
                  <button
                    onClick={handleCopy}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                      copied
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        : 'text-white/40 border border-white/15 hover:border-gold/50 hover:text-gold'
                    }`}
                    style={!copied ? { background: 'rgba(255,255,255,0.04)' } : {}}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? t('bookingSuccess.copied') : t('bookingSuccess.copyId')}
                  </button>
                </div>
                <p className="text-[11px] text-white/25 mt-2">{t('bookingSuccess.idHint')}</p>
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
                className="w-full inline-flex items-center justify-center gap-2 border border-white/15 text-white/50 hover:text-gold hover:border-gold/50 font-bold py-3 rounded-xl text-sm transition-colors"
              >
                <Search size={14} />
                {t('bookingSuccess.trackBtn')}
              </Link>
            )}
          </div>

          {/* Next steps */}
          <div className="rounded-xl p-6 mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="text-sm font-bold text-white mb-5">{t('bookingSuccess.nextStepsTitle')}</h2>
            <div className="space-y-5">
              {steps.map((step, i) => {
                const Icon = STEP_ICONS[i]
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={16} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-0.5">{step.title}</p>
                      <p className="text-xs text-white/35 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-gold transition-colors"
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
