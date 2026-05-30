import { useTranslation } from 'react-i18next'
import Animate from '@/components/common/Animate'

const STEPS = ['choose', 'book', 'pay', 'ride']

export default function HowToRentSection() {
  const { t } = useTranslation()

  return (
    <section id="how-to-rent" className="py-24 bg-charcoal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <Animate className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
              {t('howToRent.title')}
            </p>
            <h2 className="font-heading text-4xl font-bold text-white leading-[1.1]">
              {t('howToRent.subtitle')}
            </h2>
          </div>
          <p className="text-white/20 text-sm hidden sm:block shrink-0">
            {t('howToRent.steps4')}
          </p>
        </Animate>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-white/10 pt-10">
          {STEPS.map((key, i) => (
            <Animate key={key} delay={i * 90}>
              <div className="relative">
                <div className="flex items-center gap-4 mb-5">
                  <span className="font-heading font-black text-3xl text-gold leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className="hidden lg:block flex-1 h-px bg-white/10" />
                  )}
                </div>
                <h3 className="font-heading font-bold text-white mb-2">
                  {t(`howToRent.steps.${key}.title`)}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {t(`howToRent.steps.${key}.desc`)}
                </p>
              </div>
            </Animate>
          ))}
        </div>

      </div>
    </section>
  )
}
