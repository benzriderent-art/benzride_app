import { useTranslation } from 'react-i18next'
import { Star } from 'lucide-react'
import Animate from '@/components/common/Animate'

function Stars({ count, size = 13 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <Star key={i} size={size} fill="#C9A24B" className="text-gold" />
      ))}
    </div>
  )
}

export default function ReviewsSection() {
  const { t } = useTranslation()
  const reviews = t('reviews.items', { returnObjects: true })

  if (!Array.isArray(reviews) || reviews.length === 0) return null

  const [featured, ...rest] = reviews

  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <Animate className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
              {t('reviews.title')}
            </p>
            <h2 className="font-heading text-4xl font-bold text-charcoal leading-[1.1]">
              {t('reviews.subtitle')}
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0 pb-1">
            <Stars count={5} size={14} />
            <span className="font-heading font-bold text-charcoal">4.9</span>
            <span className="text-gray-400 text-sm">· {t('common.reviews200')}</span>
          </div>
        </Animate>

        <Animate delay={60} className="rounded-2xl p-8 sm:p-10 mb-5" style={{ background: 'linear-gradient(135deg, #fafaf8 0%, #f0ede6 100%)' }}>
          <Stars count={featured.rating} size={14} />
          <p className="font-heading text-xl sm:text-2xl text-charcoal leading-[1.6] my-5 italic">
            &ldquo;{featured.text}&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
              <span className="font-bold text-gold text-sm">{featured.name[0]}</span>
            </div>
            <div>
              <p className="font-semibold text-charcoal text-sm">{featured.name}</p>
              <p className="text-xs text-gray-400">{featured.origin}</p>
            </div>
          </div>
        </Animate>

        <div className="grid sm:grid-cols-2 gap-5">
          {rest.map((review, i) => (
            <Animate key={i} delay={i * 80 + 120}>
              <div className="rounded-2xl p-6 border border-gray-100 h-full">
                <Stars count={review.rating} size={12} />
                <p className="text-sm text-gray-600 leading-relaxed my-4 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-gold text-xs">{review.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.origin}</p>
                  </div>
                </div>
              </div>
            </Animate>
          ))}
        </div>

      </div>
    </section>
  )
}
