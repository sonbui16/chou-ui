import { forwardRef } from 'react'
import { Link } from 'react-router'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        accent: 'bg-accent text-accent-foreground hover:bg-accent/80',
        outline: 'border border-input bg-transparent hover:border-ink hover:text-ink',
        ghost: 'hover:bg-muted',
        link: 'text-ink underline-offset-4 hover:underline',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        default: 'h-11 px-5 text-sm',
        lg: 'h-13 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export const Button = forwardRef(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
))
Button.displayName = 'Button'

/** Link mang dáng button (tránh lồng <a> trong <button>). */
export function LinkButton({ to, variant, size, className, children, ...props }) {
  return (
    <Link to={to} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  )
}

export { buttonVariants }
