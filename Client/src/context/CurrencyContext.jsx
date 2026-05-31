import { createContext, useContext, useState } from 'react'
import { formatIDR } from '@/utils/formatCurrency'

// Update this rate as needed
const IDR_TO_USD = 16500

const CurrencyContext = createContext()

function getInitialCurrency() {
  // If user already manually chose a currency, respect that
  const saved = localStorage.getItem('benzride_currency')
  if (saved) return saved
  // Smart default: follow browser/app language
  const lang = localStorage.getItem('i18nextLng') || navigator.language || 'id'
  return lang.startsWith('id') ? 'IDR' : 'USD'
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(getInitialCurrency)

  const toggle = () => {
    const next = currency === 'IDR' ? 'USD' : 'IDR'
    setCurrency(next)
    localStorage.setItem('benzride_currency', next)
  }

  const formatPrice = (amountIDR) => {
    if (!amountIDR) return currency === 'USD' ? '$0' : formatIDR(0)
    if (currency === 'USD') {
      const usd = Math.round(amountIDR / IDR_TO_USD)
      return `$${usd}`
    }
    return formatIDR(amountIDR)
  }

  return (
    <CurrencyContext.Provider value={{ currency, toggle, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
