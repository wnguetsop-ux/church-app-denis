import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <span className="font-semibold text-cifm-blue-700 md:hidden">CIFM4 Admin</span>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cifm-blue-100 flex items-center justify-center">
              <span className="text-xs font-bold text-cifm-blue-700">DT</span>
            </div>
            <span className="text-sm text-gray-600 hidden sm:inline">Denis Descartes Tadum</span>
          </div>
        </header>
        <main className="p-4 md:p-6 max-w-5xl w-full">{children}</main>
      </div>
    </div>
  )
}
