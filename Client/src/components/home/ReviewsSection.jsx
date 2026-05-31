import { useTranslation } from 'react-i18next'
import { Star, ExternalLink } from 'lucide-react'
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
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 mb-4 shadow-sm">
              <svg viewBox="0 0 24 24" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-xs font-bold text-gray-600">{t('reviews.googleBadge')}</span>
            </div>
            <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
              {t('reviews.title')}
            </p>
            <h2 className="font-heading text-4xl font-bold text-charcoal leading-[1.1]">
              {t('reviews.subtitle')}
            </h2>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0 pb-1">
            <div className="flex items-center gap-2">
              <Stars count={5} size={14} />
              <span className="font-heading font-bold text-charcoal">4.9</span>
              <span className="text-gray-400 text-sm">· {t('common.reviews200')}</span>
            </div>
            <a
              href="https://g.page/r/benzrentalbali/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gold transition-colors"
            >
              {t('reviews.seeGoogle')}
              <ExternalLink size={11} />
            </a>
          </div>
        </Animate>

        <Animate delay={60} className="rounded-2xl p-8 sm:p-10 mb-5" style={{ background: 'linear-gradient(135deg, #fafaf8 0%, #f0ede6 100%)' }}>
          <Stars count={featured.rating} size={14} />
          <p className="font-heading text-xl sm:text-2xl text-charcoal leading-[1.6] my-5 italic">
            &ldquo;{featured.text}&rdquo;
          </p>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <span className="font-bold text-gold text-sm">{featured.name[0]}</span>
              </div>
              <div>
                <p className="font-semibold text-charcoal text-sm">{featured.name}</p>
                <p className="text-xs text-gray-400">{featured.origin}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-2 py-1 rounded-full">
              ✓ {t('reviews.verifiedGoogle')}
            </span>
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
