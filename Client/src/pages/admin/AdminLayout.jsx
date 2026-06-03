import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useAdminAuth } from '@/context/AdminAuthContext'
import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout() {
  const { isAuthenticated } = useAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-auto min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 bg-charcoal px-4 py-3.5 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Buka menu"
          >
            <Menu size={20} />
          </button>
          <div>
            <span className="font-heading text-sm font-bold text-white tracking-wider">BENZ</span>
            <span className="text-[10px] text-gold font-bold tracking-[0.15em] uppercase ml-2">Admin</span>
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

    </div>
  )
}
