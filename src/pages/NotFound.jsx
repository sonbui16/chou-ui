import { LinkButton } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p className="font-[var(--font-display)] text-8xl text-accent">404</p>
      <h1 className="mt-4 text-3xl">Không tìm thấy trang</h1>
      <p className="mt-3 text-muted-foreground">Trang bạn tìm có thể đã được dời hoặc không tồn tại.</p>
      <LinkButton to="/" className="mt-8">Về trang chủ</LinkButton>
    </div>
  )
}
