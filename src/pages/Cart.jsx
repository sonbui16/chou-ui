import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartProvider'
import { useSettings } from '@/api/catalog'
import { PriceSummary } from '@/components/booking/PriceSummary'
import { Button, LinkButton } from '@/components/ui/button'
import { EmptyState, ImageWithFallback } from '@/components/ui/primitives'
import { computeTotals } from '@/lib/pricing'
import { formatDate, formatVnd, rentalDays } from '@/lib/format'

export default function Cart() {
  const { items, remove } = useCart()
  const { data: settings } = useSettings()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-8 text-4xl">Giỏ thuê</h1>
        <EmptyState icon={<ShoppingBag className="size-10" />} title="Giỏ thuê đang trống"
          description="Hãy chọn một thiết kế và khoảng ngày để bắt đầu giữ váy."
          action={<LinkButton to="/vay">Xem bộ sưu tập</LinkButton>} />
      </div>
    )
  }

  const totals = computeTotals(items, { fulfillment: 'pickup', discount: 0, freeShippingMin: settings?.free_shipping_min ?? 500000 })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-4xl">Giỏ thuê</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <div key={item.key} className="flex gap-4 py-5">
              <Link to={`/vay/${item.productSlug}`} className="aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-md bg-cream">
                <ImageWithFallback src={item.image} alt={item.productName} tint={item.colorHex} className="size-full" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/vay/${item.productSlug}`} className="font-[var(--font-display)] text-xl hover:text-accent">{item.productName}</Link>
                    <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="inline-flex size-3.5 rounded-full border border-border" style={{ background: item.colorHex }} />
                      {item.colorName} · Size {item.sizeLabel}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{formatDate(item.start)} → {formatDate(item.end)} · {rentalDays(item.start, item.end)} ngày</p>
                  </div>
                  <button onClick={() => remove(item.key)} className="text-muted-foreground hover:text-destructive" aria-label="Xoá"><Trash2 className="size-4" /></button>
                </div>
                <p className="mt-auto pt-3 font-mono text-sm">
                  {formatVnd(item.unit_price * rentalDays(item.start, item.end))}
                  <span className="text-muted-foreground"> · cọc {formatVnd(item.deposit)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-md border border-border bg-card p-6">
          <h2 className="mb-4 text-xl">Tóm tắt</h2>
          <PriceSummary totals={totals} />
          <Button className="mt-6 w-full" size="lg" onClick={() => navigate('/thanh-toan')}>Tiến hành đặt thuê <ArrowRight className="size-4" /></Button>
          <Link to="/vay" className="mt-3 block text-center text-sm text-accent hover:underline">Tiếp tục chọn váy</Link>
        </aside>
      </div>
    </div>
  )
}
