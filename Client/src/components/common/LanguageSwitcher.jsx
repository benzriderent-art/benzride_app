import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language

  const toggle = () => {
    const next = current === 'id' ? 'en' : 'id'
    i18n.changeLanguage(next)
    localStorage.setItem('benz-lang', next)
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 text-sm font-medium hover:text-gold transition-colors"
    >
      <span className={current === 'id' ? 'text-gold font-semibold' : 'text-gray-400'}>ID</span>
      <span className="text-gray-300 select-none">|</span>
      <span className={current === 'en' ? 'text-gold font-semibold' : 'text-gray-400'}>EN</span>
    </button>
  )
}
