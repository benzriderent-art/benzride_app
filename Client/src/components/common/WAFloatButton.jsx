import { MessageCircle } from 'lucide-react'
import { waLink } from '@/constants/contact'

export default function WAFloatButton() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-0 group"
      aria-label="Hubungi via WhatsApp"
    >
      <span
        className="overflow-hidden max-w-0 group-hover:max-w-[120px] opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap text-sm font-bold text-white bg-[#25D366] rounded-l-full pl-4 pr-1 py-3.5 shadow-lg"
      >
        WhatsApp
      </span>
      <div className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200 shrink-0">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <MessageCircle size={24} className="text-white relative z-10" />
      </div>
    </a>
  )
}
