import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Bike, ClipboardList, Calendar, LogOut } from 'lucide-react'
import { useAdminAuth } from '@/context/AdminAuthContext'

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/motors', icon: Bike, label: 'Manajemen Motor' },
  { to: '/admin/bookings', icon: ClipboardList, label: 'Data Booking' },
  { to: '/admin/calendar', icon: Calendar, label: 'Kalender Armada' },
]

export default function Sidebar() {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <aside className="w-56 bg-charcoal flex flex-col shrink-0 min-h-screen">
      <div className="px-5 py-5 border-b border-white/10">
        <p className="font-heading text-base font-bold text-white tracking-wider">BENZ</p>
        <p className="text-[10px] text-gold font-bold tracking-[0.2em] uppercase">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gold/15 text-gold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </div>
    </aside>
  )
}
