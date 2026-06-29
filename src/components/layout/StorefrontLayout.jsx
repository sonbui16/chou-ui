import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { Menu, Search, ShoppingBag, User2 } from 'lucide-react'
import { useCart } from '@/store/hooks'
import { useAuth } from '@/store/hooks'
import { useCategories } from '@/features/catalog'
import { Drawer } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTypewriter } from '@/lib/useTypewriter'
import { cn } from '@/lib/cn'

const linkCls = ({ isActive }) =>
  cn('text-sm transition-colors hover:text-accent', isActive ? 'text-accent' : 'text-foreground')

// Câu placeholder xoay vòng cho ô tìm kiếm — khai báo module-level để định danh ỔN ĐỊNH.
const SEARCH_PHRASES = ['Tìm kiếm sản phẩm ...', 'Bạn cần tìm gì ... ?', 'Nhập tên sản phẩm cần tìm ...']

// Ô tìm kiếm dùng chung cho header (desktop) và drawer (mobile). Enter → nhảy tới /vay?q=...
function SearchBox({ className, onSubmitted }) {
  const navigate = useNavigate()
  const [term, setTerm] = useState('')
  const placeholder = useTypewriter(SEARCH_PHRASES, { enabled: term === '' })
  const submit = (e) => {
    e.preventDefault()
    const v = term.trim()
    navigate(v ? `/vay?q=${encodeURIComponent(v)}` : '/vay')
    setTerm('')
    onSubmitted?.()
  }
  return (
    <form onSubmit={submit} role="search" className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        aria-label="Tìm kiếm sản phẩm"
        className="h-10 pl-9"
      />
    </form>
  )
}

function Header() {
  const { count } = useCart()
  const { user } = useAuth()
  const { data: categories = [] } = useCategories()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="bg-ink text-ink-foreground">
        <p className="mx-auto max-w-7xl px-4 py-1.5 text-center text-[0.82rem]">
          Miễn phí giao nội thành cho đơn từ 500.000₫ · Đặt giữ váy trước tới 90 ngày
        </p>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Mở menu">
          <Menu className="size-6" />
        </button>
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-[var(--font-display)] text-2xl font-semibold">Chou</span>
          <span className="font-mono text-[0.58rem] uppercase text-accent">Dress · Atelier</span>
        </Link>
        <SearchBox className="hidden md:block md:w-56 lg:w-72" />
        <nav className="hidden items-center gap-7 lg:flex">
          <NavLink to="/vay" className={linkCls} end>Tất cả váy</NavLink>
          {categories.map((c) => (
            <NavLink key={c.id} to={`/vay?cat=${c.slug}`} className={linkCls}>{c.name}</NavLink>
          ))}
          <NavLink to="/ve-chung-toi" className={linkCls}>Câu chuyện</NavLink>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
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
        <SearchBox className="mb-5" onSubmitted={() => setOpen(false)} />
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

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.026 1.79-4.697 4.532-4.697 1.312 0 2.686.235 2.686.235v2.971H15.83c-1.49 0-1.955.93-1.955 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  )
}

function TiktokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
    </svg>
  )
}

const SOCIALS = [
  {
    name: 'Theo dõi trên Facebook',
    href: 'https://www.facebook.com',
    Icon: FacebookIcon,
    // Facebook brand blue
    className: 'bg-[#1877F2] text-white hover:bg-[#0c63d4]',
  },
  {
    name: 'Theo dõi trên TikTok',
    href: 'https://www.tiktok.com',
    Icon: TiktokIcon,
    // TikTok brand black
    className: 'bg-[#010101] text-white hover:bg-[#25F4EE] hover:text-[#010101]',
  },
]

function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <p className="font-[var(--font-display)] text-3xl">Chou Dress</p>
          <p className="mt-3 max-w-sm text-sm text-ink-foreground/70">
            Atelier cho thuê váy cưới, dạ hội và áo dài. Mỗi lần thuê là một buổi hẹn thử đồ riêng tư,
            chuẩn bị chu đáo cho khoảnh khắc của bạn.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-3">Khám phá</p>
          <ul className="space-y-2 text-sm text-ink-foreground/80">
            <li><Link to="/vay" className="hover:text-accent">Tất cả váy</Link></li>
            <li><Link to="/vay?cat=vay-cuoi" className="hover:text-accent">Váy cưới</Link></li>
            <li><Link to="/ve-chung-toi" className="hover:text-accent">Câu chuyện</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Liên hệ</p>
          <ul className="space-y-2 text-sm text-ink-foreground/80">
            <li>128 Nguyễn Huệ, Quận 1, TP.HCM</li>
            <li>0900 000 000 · hello@chou.vn</li>
            <li>9:00 – 20:00 mỗi ngày</li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Kết nối với chúng tôi</p>
          <ul className="space-y-3 text-sm">
            {SOCIALS.map(({ name, href, Icon, className }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-colors',
                    className,
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  <span>{name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-foreground/15">
        <p className="mx-auto max-w-7xl px-4 py-5 font-mono text-[0.62rem] uppercase text-ink-foreground/50">
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
