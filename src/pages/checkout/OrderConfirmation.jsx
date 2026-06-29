import { Link, useParams } from 'react-router'
import { CalendarDays, CheckCircle2, Store, Truck } from 'lucide-react'
import { useRental } from '@/features/account'
import { LinkButton } from '@/components/ui/button'
import { Badge, Spinner } from '@/components/ui/primitives'
import { formatDate, formatVnd } from '@/lib/format'

const STATUS = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', in_use: 'Đang thuê', returned: 'Đã trả', completed: 'Hoàn tất', cancelled: 'Đã huỷ', overdue: 'Quá hạn' }

export default function OrderConfirmation() {
  const { rentalNo } = useParams()
  const { data: rental, isLoading } = useRental(rentalNo)

  if (isLoading) return <div className="flex min-h-[40vh] items-center justify-center"><Spinner /></div>
  if (!rental) return <div className="mx-auto max-w-2xl px-4 py-16 text-center"><h1 className="text-3xl">Không tìm thấy đơn</h1></div>

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="size-14 text-[color:var(--color-ok)]" />
        <h1 className="mt-4 text-4xl">Đặt thuê thành công</h1>
        <p className="mt-2 text-muted-foreground">Cảm ơn bạn đã tin tưởng Chou. Chúng tôi sẽ liên hệ xác nhận sớm.</p>
      </div>

      <div className="mt-10 rounded-md border border-accent/60 bg-card p-7 shadow-[10px_10px_0_0_rgba(194,168,120,0.16)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[0.65rem] uppercase text-accent">Mã đơn</p>
            <p className="font-[var(--font-display)] text-2xl">{rental.rental_no}</p>
          </div>
          <Badge tone="accent">{STATUS[rental.status]}</Badge>
        </div>
        <div className="my-5 border-t border-dashed hairline" />
        <div className="space-y-3">
          {rental.items.map((it) => (
            <div key={it.id} className="flex items-center justify-between text-sm">
              <span>{it.product_name}</span>
              <span className="font-mono">{formatVnd(it.unit_price)}/ngày</span>
            </div>
          ))}
        </div>
        <div className="my-5 border-t border-dashed hairline" />
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="flex items-start gap-2"><CalendarDays className="mt-0.5 size-4 text-accent" /><span><span className="block text-muted-foreground">Thời gian thuê</span>{formatDate(rental.start_date)} → {formatDate(rental.end_date)}</span></div>
          <div className="flex items-start gap-2">{rental.fulfillment === 'pickup' ? <Store className="mt-0.5 size-4 text-accent" /> : <Truck className="mt-0.5 size-4 text-accent" />}<span><span className="block text-muted-foreground">Nhận váy</span>{rental.fulfillment === 'pickup' ? 'Tại atelier' : 'Giao tận nơi'}</span></div>
        </div>
        <div className="my-5 border-t border-dashed hairline" />
        <div className="flex justify-between text-base"><span className="font-medium">Tổng cần trả</span><span className="font-[var(--font-display)] text-xl text-accent">{formatVnd(Number(rental.grand_total) + Number(rental.deposit_total))}</span></div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LinkButton to={`/tai-khoan/don/${rental.rental_no}`} variant="outline">Xem chi tiết đơn</LinkButton>
        <LinkButton to="/vay">Tiếp tục xem váy</LinkButton>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">Theo dõi đơn trong <Link to="/tai-khoan" className="text-accent hover:underline">tài khoản của bạn</Link>.</p>
    </div>
  )
}
