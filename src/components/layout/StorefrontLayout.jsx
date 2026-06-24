import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Menu, ShoppingBag, User2 } from 'lucide-react'
import { useCart } from '@/store/hooks'
import { useAuth } from '@/store/hooks'
import { useCategories } from '@/features/catalog'
import { Drawer } from '@/components/ui/drawer'
import { cn } from '@/lib/cn'

const linkCls = ({ isActive }) =>
  cn('text-sm tracking-wide transition-colors hover:text-accent', isActive ? 'text-accent' : 'text-foreground')

function Header() {
  const { count } = useCart()
  const { user } = useAuth()
  const { data: categories = [] } = useCategories()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="bg-ink text-background">
        <p className="mx-auto max-w-7xl px-4 py-1.5 text-center font-mono text-[0.62rem] uppercase tracking-[0.25em]">
          Miễn phí giao nội thành cho đơn từ 500.000₫ · Đặt giữ váy trước tới 90 ngày
        </p>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Mở menu">
          <Menu className="size-6" />
        </button>
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-[var(--font-display)] text-2xl font-semibold">Chou</span>
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.35em] text-accent">Dress · Atelier</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          <NavLink to="/vay" className={linkCls} end>Tất cả váy</NavLink>
          {categories.map((c) => (
            <NavLink key={c.id} to={`/vay?cat=${c.slug}`} className={linkCls}>{c.name}</NavLink>
          ))}
          <NavLink to="/ve-chung-toi" className={linkCls}>Câu chuyện</NavLink>
        </nav>
        <div className="flex items-center gap-4">
          <Link to={user ? '/tai-khoan' : '/dang-nhap'} className="flex items-center gap-1.5 hover:text-accent" aria-label="Tài khoản">
            <User2 className="size-5" />
            <span className="hidden text-sm sm:inline">{user ? user.full_name.split(' ').slice(-1) : 'Đăng nhập'}</span>
          </Link>
          <Link to="/gio-hang" className="relative hover:text-accent" aria-label="Giỏ thuê">
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-accent text-[0.6rem] text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <Drawer open={open} onClose={() => setOpen(false)} side="left" title="Chou Dress">
        <nav className="flex flex-col gap-4" onClick={() => setOpen(false)}>
          <NavLink to="/vay" className={linkCls} end>Tất cả váy</NavLink>
          {categories.map((c) => (
            <NavLink key={c.id} to={`/vay?cat=${c.slug}`} className={linkCls}>{c.name}</NavLink>
          ))}
          <NavLink to="/ve-chung-toi" className={linkCls}>Câu chuyện</NavLink>
        </nav>
      </Drawer>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-ink text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-[var(--font-display)] text-3xl">Chou Dress</p>
          <p className="mt-3 max-w-sm text-sm text-background/70">
            Atelier cho thuê váy cưới, dạ hội và áo dài. Mỗi lần thuê là một buổi hẹn thử đồ riêng tư,
            chuẩn bị chu đáo cho khoảnh khắc của bạn.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-3">Khám phá</p>
          <ul className="space-y-2 text-sm text-background/80">
            <li><Link to="/vay" className="hover:text-accent">Tất cả váy</Link></li>
            <li><Link to="/vay?cat=vay-cuoi" className="hover:text-accent">Váy cưới</Link></li>
            <li><Link to="/ve-chung-toi" className="hover:text-accent">Câu chuyện</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Liên hệ</p>
          <ul className="space-y-2 text-sm text-background/80">
            <li>128 Nguyễn Huệ, Quận 1, TP.HCM</li>
            <li>0900 000 000 · hello@chou.vn</li>
            <li>9:00 – 20:00 mỗi ngày</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/15">
        <p className="mx-auto max-w-7xl px-4 py-5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-background/50">
          © 2026 Chou Dress
        </p>
      </div>
    </footer>
  )
}

export function StorefrontLayout() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo({ top: 0 }), [pathname])
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
