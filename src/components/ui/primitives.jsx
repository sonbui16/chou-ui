import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'

/* Card */
export function Card({ className, ...props }) {
  return <div className={cn('rounded-md border border-border bg-card', className)} {...props} />
}

/* Badge */
export function Badge({ className, tone = 'neutral', children }) {
  const tones = {
    neutral: 'border-border text-foreground',
    accent: 'border-accent text-accent',
    ok: 'border-[color:var(--color-ok)] text-[color:var(--color-ok)]',
    danger: 'border-destructive text-destructive',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 font-mono text-[0.65rem] uppercase',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/* Skeleton */
export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />
}

/* Section heading */
export function SectionHeading({ eyebrow, title, align = 'left', className }) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-3xl md:text-4xl">{title}</h2>
    </div>
  )
}

/* Rating stars */
export function RatingStars({ value = 0, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Đánh giá ${Number(value).toFixed(1)}/5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          width={size}
          height={size}
          className={n <= Math.round(value) ? 'fill-accent text-accent' : 'text-border'}
        />
      ))}
    </span>
  )
}

/* Empty state */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border px-6 py-16 text-center">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-xl">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

/* Spinner */
export function Spinner({ className }) {
  return (
    <div
      className={cn('size-5 animate-spin rounded-full border-2 border-muted border-t-accent', className)}
      role="status"
      aria-label="Đang tải"
    />
  )
}

/* Image with editorial fallback */
export function ImageWithFallback({ src, alt, className, tint = '#C2A878' }) {
  const [failed, setFailed] = useState(false)
  const initial = (alt || 'C').replace(/^[^A-Za-zÀ-ỹ]*/, '').charAt(0).toUpperCase() || 'C'
  if (failed || !src) {
    return (
      <div
        className={cn('flex items-center justify-center overflow-hidden', className)}
        style={{ background: `linear-gradient(135deg, ${tint}22, ${tint}08)` }}
        role="img"
        aria-label={alt}
      >
        <span className="font-[var(--font-display)] text-5xl italic" style={{ color: tint }}>
          {initial}
        </span>
      </div>
    )
  }
  return (
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={cn('object-cover', className)} />
  )
}
