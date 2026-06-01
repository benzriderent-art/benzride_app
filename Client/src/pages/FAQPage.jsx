import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ChevronDown, MessageCircle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { waLink } from '@/constants/contact'

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-semibold text-charcoal leading-relaxed">{q}</span>
        <ChevronDown
          size={18}
          className={`text-gray-400 shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="text-sm text-gray-500 leading-relaxed pb-5 pr-8">{a}</p>
      )}
    </div>
  )
}

export default function FAQPage() {
  const { t, i18n } = useTranslation()
  const isID = i18n.language === 'id'
  const faqs = t('faq.items', { returnObjects: true })

  const titleText = isID ? 'FAQ Sewa Motor Bali – Pertanyaan Umum | Benzride' : 'Motorcycle Rental Bali FAQ – Common Questions | Benzride'
  const descText  = isID
    ? 'Jawaban lengkap pertanyaan umum seputar sewa motor di Bali bersama Benzride: dokumen, pengiriman, harga, dan kebijakan sewa.'
    : 'Complete answers to common questions about renting a motorcycle in Bali with Benzride: documents, delivery, pricing, and rental policy.'

  return (
    <>
      <title>{titleText}</title>
      <meta name="description" content={descText} />
      <meta property="og:title" content={titleText} />
      <meta property="og:description" content={descText} />
      <link rel="canonical" href="https://benzride.com/faq" />
      <Navbar />
      <div className="min-h-screen bg-off-white pt-16">

        <div className="border-b border-gray-100 bg-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <Link to="/" className="hover:text-gold transition-colors">{t('common.home')}</Link>
              <span>/</span>
              <span className="text-gray-600">{t('nav.faq')}</span>
            </div>
            <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-2">{t('faq.badge')}</p>
            <h1 className="font-heading text-4xl font-bold text-charcoal">{t('faq.title')}</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-2xl border border-gray-100 px-6 divide-y divide-gray-100">
            {Array.isArray(faqs) && faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>

          <div className="mt-10 bg-charcoal rounded-2xl p-8 text-center">
            <p className="text-white font-semibold mb-1">{t('faq.notFoundQ')}</p>
            <p className="text-white/50 text-sm mb-5">{t('faq.notFoundA')}</p>
            <a
              href={waLink('Halo Benz Rental Bali, saya punya pertanyaan tentang sewa motor.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-sm text-white hover:opacity-90 transition-opacity"
              style={{ background: '#25D366' }}
            >
              <MessageCircle size={16} />
              {t('faq.askWA')}
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
