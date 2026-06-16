import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

/** Drawer (sheet) trượt từ cạnh — dùng cho menu/filter mobile và giỏ. */
export function Drawer({ open, onClose, side = 'right', title, children, className }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div
        className={cn(
          'absolute top-0 flex h-full w-[min(88vw,360px)] flex-col bg-background shadow-xl',
          side === 'right' ? 'right-0' : 'left-0',
          className,
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg">{title}</h2>
          <button onClick={onClose} aria-label="Đóng" className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}

/** Modal căn giữa. */
export function Modal({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className={cn('animate-fade-up relative w-full max-w-md rounded-md border border-border bg-card p-6 shadow-xl', className)} role="dialog" aria-modal="true">
        {title && <h3 className="mb-4 text-xl">{title}</h3>}
        {children}
      </div>
    </div>
  )
}
