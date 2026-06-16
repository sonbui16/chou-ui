import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Star, Store, Truck } from 'lucide-react'
import { useRental, useCreateReview } from '@/api/account'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Card, Badge, Spinner } from '@/components/ui/primitives'
import { formatDate, formatDateLong, formatVnd } from '@/lib/format'
import { cn } from '@/lib/cn'

const STATUS = { pending: ['Chờ xác nhận', 'neutral'], confirmed: ['Đã xác nhận', 'accent'], in_use: ['Đang thuê', 'accent'], returned: ['Đã trả', 'neutral'], completed: ['Hoàn tất', 'ok'], cancelled: ['Đã huỷ', 'danger'], overdue: ['Quá hạn', 'danger'] }
const KIND = { rental_fee: 'Phí thuê', deposit: 'Tiền cọc', deposit_refund: 'Hoàn cọc', late_fee: 'Phí trễ', damage_fee: 'Phí hư hỏng', shipping_fee: 'Phí giao' }

function ReviewForm({ productId }) {
  const createReview = useCreateReview()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  return (
    <div className="mt-3 border-t border-border pt-3">
      <p className="mb-2 text-sm font-medium">Viết đánh giá</p>
      <div className="mb-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setRating(n)} aria-label={`${n} sao`}><Star className={cn('size-5', n <= rating ? 'fill-accent text-accent' : 'text-border')} /></button>
        ))}
      </div>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Chia sẻ cảm nhận về thiết kế này…" className="text-sm" />
      <Button size="sm" className="mt-2" disabled={createReview.isPending}
        onClick={async () => { await createReview.mutateAsync({ product_id: productId, rating, comment }); toast.success('Cảm ơn đánh giá của bạn!') }}>
        Gửi đánh giá
      </Button>
    </div>
  )
}

export default function RentalDetail() {
  const { rentalNo } = useParams()
  const { data: rental, isLoading } = useRental(rentalNo)

  if (isLoading) return <div className="flex min-h-[40vh] items-center justify-center"><Spinner /></div>
  if (!rental) return <div className="mx-auto max-w-3xl px-4 py-16 text-center"><h1 className="text-3xl">Không tìm thấy đơn</h1></div>

  const [label, tone] = STATUS[rental.status]
  const canReview = rental.status === 'completed'

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/tai-khoan" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent"><ChevronLeft className="size-4" /> Đơn của tôi</Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-[var(--font-display)] text-3xl">{rental.rental_no}</h1>
        <Badge tone={tone}>{label}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Đặt ngày {formatDateLong(rental.created_at)}</p>

      <Card className="mt-6 p-6">
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div><p className="text-muted-foreground">Thời gian thuê</p><p>{formatDate(rental.start_date)} → {formatDate(rental.end_date)}</p></div>
          <div><p className="text-muted-foreground">Hình thức nhận</p><p className="flex items-center gap-1.5">{rental.fulfillment === 'pickup' ? <Store className="size-4" /> : <Truck className="size-4" />}{rental.fulfillment === 'pickup' ? 'Nhận tại atelier' : 'Giao tận nơi'}</p></div>
          {rental.address && <div className="sm:col-span-2"><p className="text-muted-foreground">Địa chỉ giao</p><p>{rental.address.recipient} · {rental.address.phone} — {[rental.address.line1, rental.address.ward, rental.address.district, rental.address.province].filter(Boolean).join(', ')}</p></div>}
        </div>
        <div className="my-5 border-t border-dashed hairline" />
        <div className="space-y-4">
          {rental.items.map((it) => (
            <div key={it.id}>
              <div className="flex items-center justify-between">
                <span className="font-[var(--font-display)] text-lg">{it.product_name}</span>
                <span className="font-mono text-sm">{formatVnd(it.unit_price)}/ngày</span>
              </div>
              {canReview && <ReviewForm productId={it.product_id} />}
            </div>
          ))}
        </div>
        <div className="my-5 border-t border-dashed hairline" />
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Phí thuê</span><span className="font-mono">{formatVnd(rental.subtotal)}</span></div>
          {Number(rental.discount_total) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Giảm giá</span><span className="font-mono text-accent">− {formatVnd(rental.discount_total)}</span></div>}
          {Number(rental.shipping_fee) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Phí giao</span><span className="font-mono">{formatVnd(rental.shipping_fee)}</span></div>}
          <div className="flex justify-between"><span className="text-muted-foreground">Tiền cọc</span><span className="font-mono">{formatVnd(rental.deposit_total)}</span></div>
        </div>
      </Card>

      <h2 className="mt-8 text-xl">Lịch sử thanh toán</h2>
      <Card className="mt-3 divide-y divide-border">
        {(!rental.payments || rental.payments.length === 0) ? <p className="p-5 text-sm text-muted-foreground">Chưa có giao dịch (thanh toán khi nhận váy).</p>
          : rental.payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 text-sm">
              <span>{KIND[p.kind]}</span>
              <span className={cn('font-mono', Number(p.amount) < 0 && 'text-[color:var(--color-ok)]')}>{formatVnd(p.amount)}</span>
            </div>
          ))}
      </Card>
    </div>
  )
}
