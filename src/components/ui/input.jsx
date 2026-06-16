import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

export const Input = forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none disabled:opacity-50',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'

export const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'min-h-24 w-full resize-y rounded-md border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none',
      className,
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export const Select = forwardRef(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground focus:border-ring focus:outline-none',
      className,
    )}
    {...props}
  />
))
Select.displayName = 'Select'

export function Label({ className, ...props }) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-foreground', className)} {...props} />
}

export function Field({ label, error, htmlFor, children, hint }) {
  return (
    <div className="flex flex-col">
      {label && (
        <Label htmlFor={htmlFor} className="flex items-center justify-between">
          <span>{label}</span>
          {hint && <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{hint}</span>}
        </Label>
      )}
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
