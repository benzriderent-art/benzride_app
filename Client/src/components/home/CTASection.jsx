import { useTranslation } from 'react-i18next'
import { MessageCircle, Phone } from 'lucide-react'
import { waLink, PHONE_TEL } from '@/constants/contact'
import Animate from '@/components/common/Animate'

const BG_IMAGE = 'https://images.pexels.com/photos/10740492/pexels-photo-10740492.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'

export default function CTASection() {
  const { t } = useTranslation()

  return (
    <section
      id="contact"
      className="py-28 relative overflow-hidden"
      style={{ backgroundImage: `url(${BG_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.84)' }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Animate>
          <div
            className="inline-flex items-center gap-2 border border-gold/30 text-gold text-xs font-bold px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(201,162,75,0.08)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            {t('cta.available')}
          </div>

          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-5">
            {t('cta.title')}
          </h2>

          <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            {t('cta.subtitle')}
          </p>
        </Animate>

        <Animate delay={100} className="flex flex-wrap justify-center gap-4 mb-8">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 font-bold px-8 py-4 rounded-xl text-sm text-white hover:opacity-90 transition-opacity"
            style={{ background: '#25D366' }}
          >
            <MessageCircle size={18} />
            {t('cta.whatsapp')}
          </a>
          <a
            href={PHONE_TEL}
            className="inline-flex items-center gap-2.5 bg-gold text-charcoal font-bold px-8 py-4 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            <Phone size={18} />
            {t('cta.call')}
          </a>
        </Animate>

        <Animate delay={180} className="flex flex-wrap justify-center gap-5 text-xs text-white/30">
          <span>✓ {t('hero.trust.delivery')}</span>
          <span className="hidden sm:block text-white/10">|</span>
          <span>✓ {t('hero.trust.equipment')}</span>
          <span className="hidden sm:block text-white/10">|</span>
          <span>✓ {t('cta.noHiddenFees')}</span>
        </Animate>
      </div>
    </section>
  )
}
