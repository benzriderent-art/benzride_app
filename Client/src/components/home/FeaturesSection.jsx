import { useTranslation } from 'react-i18next'
import { HardHat, Truck, MessageCircle, Shield, Wrench, Calendar } from 'lucide-react'
import Animate from '@/components/common/Animate'

const FEATURES = [
  { key: 'helmet',       icon: HardHat },
  { key: 'delivery',    icon: Truck },
  { key: 'support',     icon: MessageCircle },
  { key: 'insurance',   icon: Shield },
  { key: 'maintenance', icon: Wrench },
  { key: 'flexible',    icon: Calendar },
]

export default function FeaturesSection() {
  const { t } = useTranslation()

  return (
    <section className="py-24 bg-charcoal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[2fr_3fr] gap-16 items-start">

          <Animate type="left" className="lg:sticky lg:top-24">
            <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
              {t('features.title')}
            </p>
            <h2 className="font-heading text-4xl font-bold text-white leading-[1.1] mb-6">
              {t('features.subtitle')}
            </h2>
            <div className="h-px bg-white/10 mb-8" />
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: '500+', key: 'statCustomers' },
                { val: '4.9★', key: 'statRating' },
                { val: '24/7', key: 'statSupport' },
              ].map(({ val, key }) => (
                <div key={key}>
                  <p className="font-heading text-2xl font-bold text-gold">{val}</p>
                  <p className="text-[11px] text-white/30 mt-0.5 leading-tight">{t(`features.${key}`)}</p>
                </div>
              ))}
            </div>
          </Animate>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
            {FEATURES.map(({ key, icon: Icon }, i) => (
              <Animate key={key} delay={i * 70}>
                <div className="flex gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,162,75,0.15)', border: '1px solid rgba(201,162,75,0.25)' }}>
                    <Icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">
                      {t(`features.items.${key}.title`)}
                    </h3>
                    <p className="text-xs text-white/40 leading-relaxed">
                      {t(`features.items.${key}.desc`)}
                    </p>
                  </div>
                </div>
              </Animate>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
