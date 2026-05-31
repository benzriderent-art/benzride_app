import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { waLink } from '@/constants/contact'

const QUICK_ACTIONS = [
  {
    labelEN: 'Rent Scoopy',
    labelID: 'Sewa Scoopy',
    msgEN: 'Hello Benzride! I\'m interested in renting a Honda Scoopy. Could you share availability and pricing?',
    msgID: 'Halo Benzride! Saya tertarik menyewa Honda Scoopy. Bisa info ketersediaan dan harga?',
    color: '#C9A24B',
  },
  {
    labelEN: 'Rent NMAX',
    labelID: 'Sewa NMAX',
    msgEN: 'Hello Benzride! I\'m interested in renting a Yamaha NMAX. Could you share availability and pricing?',
    msgID: 'Halo Benzride! Saya tertarik menyewa Yamaha NMAX. Bisa info ketersediaan dan harga?',
    color: '#C9A24B',
  },
  {
    labelEN: 'Airport Pickup',
    labelID: 'Antar Bandara',
    msgEN: 'Hello Benzride! I need a motorcycle delivered to the airport. Can you arrange that?',
    msgID: 'Halo Benzride! Saya butuh motor diantar ke bandara. Bisa diatur?',
    color: '#C9A24B',
  },
  {
    labelEN: 'Monthly Rental',
    labelID: 'Sewa Bulanan',
    msgEN: 'Hello Benzride! I\'m interested in a long-term monthly rental. What packages do you offer?',
    msgID: 'Halo Benzride! Saya tertarik dengan paket sewa bulanan. Ada penawaran apa saja?',
    color: '#C9A24B',
  },
]

export default function WAFloatButton() {
  const { i18n } = useTranslation()
  const isID = i18n.language === 'id'
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">

      {/* Quick action panel */}
      {open && (
        <div className="flex flex-col gap-2 items-end">
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mr-1 mb-1">
            {isID ? 'Mau sewa apa?' : 'Quick actions'}
          </p>
          {QUICK_ACTIONS.map(action => (
            <a
              key={action.labelEN}
              href={waLink(isID ? action.msgID : action.msgEN)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-charcoal shadow-lg hover:scale-105 transition-transform"
              style={{ background: '#C9A24B', minWidth: '140px' }}
            >
              <MessageCircle size={13} />
              {isID ? action.labelID : action.labelEN}
            </a>
          ))}
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg hover:scale-105 transition-transform"
            style={{ background: '#25D366', minWidth: '140px' }}
          >
            <MessageCircle size={13} />
            {isID ? 'Chat Langsung' : 'Open Chat'}
          </a>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close WhatsApp menu' : 'Open WhatsApp menu'}
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        style={{ background: '#25D366' }}
      >
        {!open && <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />}
        {open
          ? <X size={22} className="text-white relative z-10" />
          : <MessageCircle size={24} className="text-white relative z-10" />
        }
      </button>
    </div>
  )
}
