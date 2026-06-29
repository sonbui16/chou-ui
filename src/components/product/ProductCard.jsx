import { Link } from 'react-router'
import { ImageWithFallback, RatingStars } from '@/components/ui/primitives'
import { formatVnd, isNewProduct } from '@/lib/format'
import { cn } from '@/lib/cn'

export function ProductCard({ product, featured = false }) {
  const soldOut = product.available_now === 0
  const isNew = isNewProduct(product.created_at)
  return (
    <Link to={`/vay/${product.slug}`} className="group block" aria-label={product.name}>
      <div className={cn('relative overflow-hidden rounded-md bg-cream', featured ? 'aspect-[3/4]' : 'aspect-[4/5]')}>
        <ImageWithFallback
          src={product.primary_image}
          alt={product.name}
          className="size-full transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute left-0 top-3 bg-background/90 px-2 py-1 font-mono text-[0.6rem] uppercase text-accent">
          {product.category?.name}
        </span>
        {isNew && (
          <span className="absolute left-0 top-10 bg-accent px-2 py-1 font-mono text-[0.6rem] uppercase text-ink-foreground">
            Mới
          </span>
        )}
        {soldOut && (
          <span className="absolute right-0 top-3 bg-ink/85 px-2 py-1 font-mono text-[0.6rem] uppercase text-ink-foreground">
            Hết váy
          </span>
        )}
      </div>
      <div className="pt-3">
        <h3 className="font-[var(--font-display)] text-lg leading-tight transition-colors group-hover:text-accent">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {product.rating_count > 0 ? (
            <>
              <RatingStars value={product.rating_avg} size={12} />
              <span>({product.rating_count})</span>
            </>
          ) : (
            <span>Chưa có đánh giá</span>
          )}
        </div>
        <p className="mt-2 font-mono text-sm">
          {formatVnd(product.rental_price)}
          <span className="text-muted-foreground"> / ngày</span>
        </p>
      </div>
    </Link>
  )
}
