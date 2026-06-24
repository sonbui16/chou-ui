import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Check, ChevronRight, Loader2, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { useProduct, useProductReviews, useSettings } from '@/features/catalog'
import { useAvailability } from '@/features/catalog'
import { useCart } from '@/store/hooks'
import { toast } from 'sonner'
import { DateRangePicker } from '@/components/booking/DateRangePicker'
import { PriceSummary } from '@/components/booking/PriceSummary'
import { Button, LinkButton } from '@/components/ui/button'
import { Badge, RatingStars, ImageWithFallback, Skeleton, EmptyState } from '@/components/ui/primitives'
import { computeTotals } from '@/lib/pricing'
import { formatVnd, formatDate, toIsoDate } from '@/lib/format'
import { cn } from '@/lib/cn'

export default function ProductDetail() {
  const { slug } = useParams()
  const { data: product, isLoading, isError } = useProduct(slug)
  const { data: reviews = [] } = useProductReviews(slug)
  const { data: settings } = useSettings()
  const { add } = useCart()

  const [activeImg, setActiveImg] = useState(0)
  const [colorId, setColorId] = useState(null)
  const [sizeId, setSizeId] = useState(null)
  const [range, setRange] = useState(undefined)

  const variants = product?.variants ?? []
  const productColors = useMemo(() => {
    const map = new Map()
    variants.forEach((v) => v.color && map.set(v.color.id, v.color))
    return [...map.values()]
  }, [variants])
  const productSizes = useMemo(() => {
    const map = new Map()
    variants.forEach((v) => v.size && map.set(v.size.id, v.size))
    return [...map.values()]
  }, [variants])

  const sizeOkForColor = (sid) => colorId == null || variants.some((v) => v.color_id === colorId && v.size_id === sid)
  const variant = colorId != null && sizeId != null
    ? variants.find((v) => v.color_id === colorId && v.size_id === sizeId)
    : undefined

  const startIso = range?.from ? toIsoDate(range.from) : undefined
  const endIso = range?.to ? toIsoDate(range.to) : range?.from ? toIsoDate(range.from) : undefined

  const availability = useAvailability({ slug, variantId: variant?.id, start: startIso, end: endIso })

  const unitPrice = variant?.price_override ?? product?.rental_price ?? 0
  const totals = startIso && endIso
    ? computeTotals([{ unit_price: unitPrice, deposit: product.deposit, start: startIso, end: endIso }],
        { fulfillment: 'pickup', discount: 0, freeShippingMin: settings?.free_shipping_min ?? 500000 })
    : null

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 lg:grid-cols-2">
        <Skeleton className="aspect-[3/4]" />
        <div className="space-y-4"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-24" /><Skeleton className="h-64" /></div>
      </div>
    )
  }
  if (isError || !product) {
    return <div className="mx-auto max-w-3xl px-4 py-16"><EmptyState title="Không tìm thấy sản phẩm" description="Thiết kế này có thể đã được gỡ." action={<LinkButton to="/vay">Về bộ sưu tập</LinkButton>} /></div>
  }

  const isAvailable = availability.data?.isAvailable ?? availability.data?.available > 0
  const canAdd = variant && startIso && endIso && isAvailable

  const handleAdd = () => {
    if (!canAdd) return
    const color = productColors.find((c) => c.id === colorId)
    const size = productSizes.find((s) => s.id === sizeId)
    add({
      key: `${variant.id}-${startIso}`,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      variantId: variant.id,
      image: product.primary_image,
      sizeLabel: size?.code,
      colorName: color?.name,
      colorHex: color?.hex,
      unit_price: Number(unitPrice),
      deposit: Number(product.deposit),
      start: startIso,
      end: endIso,
    })
    toast.success('Đã thêm váy vào giỏ thuê')
  }

  const images = product.images ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-accent">Trang chủ</Link>
        <ChevronRight className="size-3" />
        <Link to={`/vay?cat=${product.category?.slug}`} className="hover:text-accent">{product.category?.name}</Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* gallery */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          <div className="flex gap-3 sm:flex-col">
            {images.map((img, i) => (
              <button key={img.id} onClick={() => setActiveImg(i)} aria-label={`Ảnh ${i + 1}`}
                className={cn('size-16 overflow-hidden rounded-md border', activeImg === i ? 'border-foreground' : 'border-border')}>
                <ImageWithFallback src={img.url} alt={img.alt || product.name} className="size-full" />
              </button>
            ))}
          </div>
          <div className="aspect-[3/4] flex-1 overflow-hidden rounded-md bg-cream">
            <ImageWithFallback src={images[activeImg]?.url ?? product.primary_image} alt={product.name} className="size-full" />
          </div>
        </div>

        {/* booking */}
        <div>
          <p className="eyebrow mb-2">{product.brand}</p>
          <h1 className="text-4xl md:text-5xl">{product.name}</h1>
          {product.rating_count > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <RatingStars value={product.rating_avg} /> {Number(product.rating_avg).toFixed(1)} · {product.rating_count} đánh giá
            </div>
          )}
          <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-[var(--font-display)] text-3xl text-accent">{formatVnd(product.rental_price)}</span>
            <span className="text-muted-foreground">/ ngày · cọc {formatVnd(product.deposit)}</span>
          </div>

          {/* appointment card (signature) */}
          <div className="mt-7 rounded-md border border-accent/60 bg-card p-6 shadow-[10px_10px_0_0_rgba(194,168,120,0.16)]">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-accent">Phiếu giữ váy</p>
              <p className="font-mono text-[0.65rem] text-muted-foreground">{variant?.sku ?? '—'}</p>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <p className="mb-2 text-sm font-medium">Màu sắc</p>
                <div className="flex flex-wrap gap-2">
                  {productColors.map((c) => (
                    <button key={c.id} onClick={() => setColorId(c.id)} title={c.name} aria-label={c.name}
                      className={cn('flex size-9 items-center justify-center rounded-full border', colorId === c.id ? 'border-foreground ring-1 ring-foreground ring-offset-2' : 'border-input')}>
                      <span className="size-6 rounded-full border border-border" style={{ background: c.hex }} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Size</p>
                <div className="flex flex-wrap gap-2">
                  {productSizes.map((s) => {
                    const ok = sizeOkForColor(s.id)
                    return (
                      <button key={s.id} disabled={!ok} onClick={() => setSizeId(s.id)} aria-pressed={sizeId === s.id}
                        className={cn('min-w-12 rounded-md border px-3 py-2 text-sm', sizeId === s.id ? 'border-foreground bg-ink text-ink-foreground' : 'border-input hover:border-foreground', !ok && 'cursor-not-allowed text-muted-foreground/40 line-through')}>
                        {s.code}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Khoảng ngày thuê</p>
                <div className="rounded-md border border-border bg-background p-2"><DateRangePicker range={range} onChange={setRange} /></div>
                {startIso && endIso && <p className="mt-2 text-sm text-muted-foreground">{formatDate(startIso)} → {formatDate(endIso)}</p>}
              </div>

              {variant && startIso && endIso && (
                <div className={cn('flex items-center gap-2 border-l-2 py-1 pl-3 text-sm',
                  availability.isFetching ? 'border-muted text-muted-foreground' : isAvailable ? 'border-[color:var(--color-ok)] text-[color:var(--color-ok)]' : 'border-destructive text-destructive')}>
                  {availability.isFetching ? <><Loader2 className="size-4 animate-spin" /> Đang kiểm tra…</>
                    : isAvailable ? <><Check className="size-4" /> Còn {availability.data.available}/{availability.data.total} bản trống</>
                    : <>Hết váy trong khoảng ngày này — thử ngày khác nhé</>}
                </div>
              )}
              {(!variant) && <p className="text-sm text-muted-foreground">Chọn màu và size để kiểm tra ngày trống.</p>}

              {totals && variant && isAvailable && (
                <div className="border-t border-border pt-4"><PriceSummary totals={totals} /></div>
              )}

              <Button className="w-full" size="lg" disabled={!canAdd} onClick={handleAdd}>Thêm vào giỏ thuê</Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1.5"><Sparkles className="size-5 text-accent" /> Giặt là chuyên nghiệp</div>
            <div className="flex flex-col items-center gap-1.5"><Truck className="size-5 text-accent" /> Giao nội thành nhanh</div>
            <div className="flex flex-col items-center gap-1.5"><ShieldCheck className="size-5 text-accent" /> Hoàn cọc khi trả</div>
          </div>
        </div>
      </div>

      {/* reviews */}
      <section className="mt-20 border-t border-border pt-10">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl">Đánh giá</h2>
          {product.rating_count > 0 && <Badge tone="accent">{Number(product.rating_avg).toFixed(1)} / 5</Badge>}
        </div>
        {reviews.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Chưa có đánh giá cho thiết kế này.</p>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-md border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{r.customer?.full_name ?? 'Khách hàng'}</p>
                  <RatingStars value={r.rating} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
