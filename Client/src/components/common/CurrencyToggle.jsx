import { useCurrency } from '@/context/CurrencyContext'
import { useTranslation } from 'react-i18next'

/**
 * Compact inline toggle — place it close to where prices are shown.
 * variant="dark"  → for dark backgrounds (FleetPage, VehicleDetailPage sidebar)
 * variant="light" → for light backgrounds
 */
export default function CurrencyToggle({ variant = 'light' }) {
  const { currency, toggle } = useCurrency()
  const { i18n } = useTranslation()
  const isID = i18n.language === 'id'

  const label = isID ? 'Tampilkan harga dalam:' : 'Show prices in:'

  const base = 'text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors'

  const active = variant === 'dark'
    ? `${base} bg-gold text-charcoal`
    : `${base} bg-charcoal text-white`

  const inactive = variant === 'dark'
    ? `${base} text-white/30 hover:text-white/60`
    : `${base} text-gray-400 hover:text-charcoal`

  const wrapBorder = variant === 'dark'
    ? 'border border-white/10 bg-white/5'
    : 'border border-gray-200 bg-gray-50'

  return (
    <div className="flex items-center gap-2">
      <span className={`text-[11px] ${variant === 'dark' ? 'text-white/30' : 'text-gray-400'}`}>
        {label}
      </span>
      <div className={`flex items-center rounded-lg overflow-hidden ${wrapBorder}`}>
        {['IDR', 'USD'].map(c => (
          <button
            key={c}
            onClick={() => c !== currency && toggle()}
            className={currency === c ? active : inactive}
          >
            {c === 'IDR' ? '🇮🇩 IDR' : '🇺🇸 USD'}
          </button>
        ))}
      </div>
    </div>
  )
}
