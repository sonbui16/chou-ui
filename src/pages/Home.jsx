import { Link } from 'react-router'
import { ArrowRight, CalendarHeart, Sparkles, Truck, Undo2 } from 'lucide-react'
import { useProducts, useCategories } from '@/features/catalog'
import { ProductCard } from '@/components/product/ProductCard'
import { LinkButton } from '@/components/ui/button'
import { SectionHeading, ImageWithFallback, Skeleton, Reveal } from '@/components/ui/primitives'

const STEPS = [
  { n: '01', title: 'Chọn váy & ngày', desc: 'Lọc theo dịp, size, màu. Chọn khoảng ngày để xem váy còn trống.', icon: CalendarHeart },
  { n: '02', title: 'Giữ chỗ & đặt cọc', desc: 'Đặt giữ bản váy của bạn, thanh toán phí thuê và cọc hoàn lại.', icon: Sparkles },
  { n: '03', title: 'Nhận váy', desc: 'Đến atelier thử và lấy, hoặc để chúng tôi giao tận nơi đúng hẹn.', icon: Truck },
  { n: '04', title: 'Trả & hoàn cọc', desc: 'Trả váy sau buổi tiệc. Chúng tôi giặt là, bạn nhận lại tiền cọc.', icon: Undo2 },
]

export default function Home() {
  const { data, isLoading } = useProducts({ limit: 6 })
  const { data: categories = [] } = useCategories()
  const featured = data?.items ?? []

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border glow-champagne">
        {/* Mobile: snap-carousel ảnh featured + text overlay cố định */}
        <div className="relative lg:hidden">
          <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
            {(isLoading ? Array.from({ length: 3 }) : featured.slice(0, 5)).map((p, i) => (
              <div key={p?.id ?? i} className="aspect-[3/4] w-full shrink-0 snap-center bg-cream">
                {isLoading ? (
                  <Skeleton className="size-full" />
                ) : (
                  <ImageWithFallback src={p?.primary_image} alt={p?.name ?? 'Váy'} className="size-full" />
                )}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/75 via-ink/30 to-transparent p-6">
            <p className="eyebrow mb-3 text-ink-foreground/80">Atelier cho thuê váy · Mùa cưới 2026</p>
            <h1 className="text-4xl leading-[1.02] text-ink-foreground sm:text-5xl">
              Vẻ đẹp cho ngày <span className="italic text-accent">trọng đại của bạn</span>
            </h1>
            <div className="pointer-events-auto mt-6 flex flex-wrap gap-3">
              <LinkButton to="/vay">Xem bộ sưu tập <ArrowRight className="size-4" /></LinkButton>
              <LinkButton to="/vay?cat=vay-cuoi" variant="outline">Váy cưới</LinkButton>
            </div>
          </div>
        </div>
        {/* Desktop: giữ nguyên layout 2 cột */}
        <div className="mx-auto hidden max-w-7xl items-stretch gap-0 px-4 py-12 md:py-16 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <Reveal className="flex flex-col justify-center">
            <p className="eyebrow mb-5">Atelier cho thuê váy · Mùa cưới 2026</p>
            <h1 className="text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">
              Vẻ đẹp
              <br />
              cho ngày
              <br />
              <span className="italic text-accent">trọng đại của bạn</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              Váy cưới, đầm dạ hội và áo dài thiết kế — thuê theo ngày như một buổi hẹn thử đồ couture.
              Đặt giữ trước, đến thử, rồi toả sáng.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton to="/vay">Xem bộ sưu tập <ArrowRight className="size-4" /></LinkButton>
              <LinkButton to="/vay?cat=vay-cuoi" variant="outline">Váy cưới</LinkButton>
            </div>
          </Reveal>
          <Reveal delay={150} className="relative mt-10 grid grid-cols-2 gap-3 lg:mt-0">
            {isLoading ? (
              <>
                <Skeleton className="aspect-[3/4]" />
                <Skeleton className="mt-10 aspect-[3/4]" />
              </>
            ) : (
              <>
                <div className="aspect-[3/4] overflow-hidden rounded-md bg-cream">
                  <ImageWithFallback src={featured[0]?.primary_image} alt={featured[0]?.name ?? 'Váy'} className="size-full" />
                </div>
                <div className="mt-10 aspect-[3/4] overflow-hidden rounded-md bg-cream">
                  <ImageWithFallback src={featured[1]?.primary_image} alt={featured[1]?.name ?? 'Váy'} className="size-full" tint="#9C8F7C" />
                </div>
              </>
            )}
          </Reveal>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal><SectionHeading eyebrow="Theo từng dịp" title="Danh mục" /></Reveal>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((c, i) => {
            const sample = featured.find((p) => p.category?.id === c.id) ?? featured[0]
            return (
              <Reveal as={Link} key={c.id} delay={Math.min(i, 5) * 60} to={`/vay?cat=${c.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded-md bg-cream">
                <ImageWithFallback src={sample?.primary_image} alt={c.name} className="size-full transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="font-[var(--font-display)] text-2xl text-ink-foreground">{c.name}</p>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-ink-foreground/80">Khám phá <ArrowRight className="size-3" /></span>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <Reveal as="div" className="flex items-end justify-between">
          <SectionHeading eyebrow="Tuyển chọn" title="Được yêu thích mùa này" />
          <Link to="/vay" className="hidden items-center gap-1 text-sm text-accent hover:underline sm:flex">
            Tất cả váy <ArrowRight className="size-4" />
          </Link>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[4/5]" />)
            : featured.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i, 5) * 60} className={i % 5 === 0 ? 'md:row-span-2' : ''}>
                  <ProductCard product={p} featured={i % 5 === 0} />
                </Reveal>
              ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-16 border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <Reveal><SectionHeading eyebrow="Quy trình" title="Thuê váy trong bốn bước" /></Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={Math.min(i, 5) * 60} className="border-t border-border pt-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-accent">{s.n}</span>
                  <s.icon className="size-5 text-accent" />
                </div>
                <h3 className="mt-4 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-ink-foreground">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center">
          <h2 className="max-w-2xl text-4xl text-ink-foreground md:text-5xl">Ngày trọng đại xứng đáng với bộ váy hoàn hảo</h2>
          <LinkButton to="/vay" variant="accent" size="lg">Bắt đầu chọn váy <ArrowRight className="size-4" /></LinkButton>
        </Reveal>
      </section>
    </div>
  )
}
