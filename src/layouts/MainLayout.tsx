import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'

export default function MainLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#1a1a1a] text-brandcolor-textstrong">
      <Header />
      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
