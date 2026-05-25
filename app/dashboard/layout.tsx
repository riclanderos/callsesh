import SidebarNav from './sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <SidebarNav />
      <div className="lg:ml-56">
        {children}
      </div>
    </div>
  )
}
