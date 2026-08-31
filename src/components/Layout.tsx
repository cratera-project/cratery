import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-night px-2.5 py-3 text-ink sm:px-4 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[960px] flex-col sm:min-h-[calc(100vh-3rem)]">
        <Header />
        <main role="main" className="min-w-0 flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
