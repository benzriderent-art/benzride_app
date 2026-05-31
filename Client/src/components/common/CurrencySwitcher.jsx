import { useCurrency } from '@/context/CurrencyContext'

export default function CurrencySwitcher() {
  const { currency, toggle } = useCurrency()

  return (
    <button
      onClick={toggle}
      title={currency === 'IDR' ? 'Switch to USD' : 'Switch to IDR'}
      className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-gold hover:text-gold transition-colors text-gray-500"
    >
      {currency === 'IDR' ? (
        <>🇮🇩 IDR</>
      ) : (
        <>🇺🇸 USD</>
      )}
    </button>
  )
}
