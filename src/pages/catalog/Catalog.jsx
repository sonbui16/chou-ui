import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { SlidersHorizontal, X } from 'lucide-react'
import { useProducts, useCategories, useSizes, useColors } from '@/features/catalog'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/input'
import { Drawer } from '@/components/ui/drawer'
import { EmptyState, Skeleton } from '@/components/ui/primitives'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/cn'

const SORTS = [
  { value: 'featured', label: 'Nổi bật' },
  { value: 'price-asc', label: 'Giá: thấp → cao' },
  { value: 'price-desc', label: 'Giá: cao → thấp' },
  { value: 'rating', label: 'Đánh giá cao' },
]
const PER_PAGE = 9

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') ?? ''
  const { data: categories = [] } = useCategories()
  const { data: sizes = [] } = useSizes()
  const { data: colors = [] } = useColors()

  const [sizeId, setSizeId] = useState('')
  const [colorId, setColorId] = useState('')
  const [maxPrice, setMaxPrice] = useState(3000000)
  const [sort, setSort] = useState('featured')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading, isError } = useProducts({
    cat: cat || undefined,
    size: sizeId || undefined,
    color: colorId || undefined,
    maxPrice,
    sort,
    page,
    limit: PER_PAGE,
  })

  const setCat = (slug) => {
    if (slug) params.set('cat', slug)
    else params.delete('cat')
    setParams(params)
    setPage(1)
  }

  const items = data?.items ?? []
  const pageCount = data?.page_count ?? 1
  const activeCat = categories.find((c) => c.slug === cat)
  const hasFilters = sizeId || colorId || maxPrice < 3000000
  const clear = () => { setSizeId(''); setColorId(''); setMaxPrice(3000000); setPage(1) }

  const Filters = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 font-mono text-xs uppercase text-muted-foreground">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s.id}
              onClick={() => { setSizeId(sizeId === String(s.id) ? '' : String(s.id)); setPage(1) }}
              className={cn('min-w-11 rounded-md border px-3 py-1.5 text-sm', String(s.id) === sizeId ? 'border-foreground bg-ink text-ink-foreground' : 'border-input hover:border-foreground')}
            >
              {s.code}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-mono text-xs uppercase text-muted-foreground">Màu sắc</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => { setColorId(colorId === String(c.id) ? '' : String(c.id)); setPage(1) }}
              title={c.name}
              aria-label={c.name}
              className={cn('flex size-9 items-center justify-center rounded-full border', String(c.id) === colorId ? 'border-foreground ring-1 ring-foreground ring-offset-2' : 'border-input')}
            >
              <span className="size-6 rounded-full border border-border" style={{ background: c.hex }} />
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-mono text-xs uppercase text-muted-foreground">Giá tối đa / ngày</h3>
        <input type="range" min={400000} max={3000000} step={100000} value={maxPrice}
          onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1) }} className="w-full accent-[color:var(--ink)]" />
        <p className="mt-1 font-mono text-sm">{formatNumber(maxPrice)}₫</p>
      </div>
      {hasFilters && <Button variant="ghost" size="sm" onClick={clear}><X className="size-3" /> Xoá bộ lọc</Button>}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="border-b border-border pb-6">
        <p className="eyebrow mb-2">Bộ sưu tập</p>
        <h1 className="text-4xl md:text-5xl">{activeCat ? activeCat.name : 'Tất cả váy'}</h1>
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={() => setCat('')} className={cn('rounded-md border px-4 py-1.5 text-sm', !cat ? 'border-foreground bg-ink text-ink-foreground' : 'border-input hover:border-foreground')}>Tất cả</button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setCat(c.slug)} className={cn('rounded-md border px-4 py-1.5 text-sm', cat === c.slug ? 'border-foreground bg-ink text-ink-foreground' : 'border-input hover:border-foreground')}>{c.name}</button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">{Filters}</aside>
        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{data?.total ?? 0} thiết kế</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilters(true)}><SlidersHorizontal className="size-4" /> Lọc</Button>
              <Select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1) }} className="w-48">
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </Select>
            </div>
          </div>

          {isError ? (
            <EmptyState title="Không tải được dữ liệu" description="Kiểm tra kết nối tới máy chủ API rồi thử lại." />
          ) : isLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[4/5]" />)}
            </div>
          ) : items.length === 0 ? (
            <EmptyState title="Không tìm thấy váy phù hợp" description="Thử nới khoảng giá hoặc bỏ bớt bộ lọc." action={<Button onClick={clear}>Xoá bộ lọc</Button>} />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {items.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {pageCount > 1 && (
            <div className="mt-12 flex items-center justify-center gap-1">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} aria-current={p === page}
                  className={cn('size-9 rounded-md border font-mono text-sm', p === page ? 'border-foreground bg-ink text-ink-foreground' : 'border-input hover:border-foreground')}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Drawer open={showFilters} onClose={() => setShowFilters(false)} title="Bộ lọc">
        {Filters}
        <Button className="mt-8 w-full" onClick={() => setShowFilters(false)}>Xem {data?.total ?? 0} kết quả</Button>
      </Drawer>
    </div>
  )
}
