import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      <div
        className="absolute font-heading font-black text-gold select-none leading-none pointer-events-none"
        style={{
          fontSize: 'clamp(160px, 28vw, 320px)',
          opacity: 0.05,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          whiteSpace: 'nowrap',
        }}
      >
        404
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8">
          <span className="font-heading text-xl font-bold text-white tracking-wider">BENZ</span>
          <span className="font-heading text-xl font-bold text-gold"> RENTAL</span>
          <span className="block text-[10px] text-white/25 tracking-[0.3em] uppercase mt-1 text-center">Bali, Indonesia</span>
        </div>

        <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">Error 404</p>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4 leading-[1.1]">
          {t('notFound.title')}
        </h1>
        <p className="text-white/40 mb-10 max-w-sm leading-relaxed">
          {t('notFound.desc')}
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gold text-charcoal font-bold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            <ArrowLeft size={15} />
            {t('notFound.backHome')}
          </Link>
          <Link
            to="/fleet"
            className="inline-flex items-center gap-2 border border-white/15 text-white/60 hover:text-gold hover:border-gold/50 font-bold px-7 py-3.5 rounded-xl transition-colors text-sm"
          >
            {t('notFound.viewFleet')}
          </Link>
        </div>
      </div>
    </div>
  )
}
