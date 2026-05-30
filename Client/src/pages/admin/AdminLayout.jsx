import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '@/context/AdminAuthContext'
import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout() {
  const { isAuthenticated } = useAdminAuth()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
