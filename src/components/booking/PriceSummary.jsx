import { formatVnd } from '@/lib/format'

function Row({ label, value, muted, accent }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={muted ? 'text-muted-foreground' : ''}>{label}</span>
      <span className={accent ? 'font-mono text-accent' : 'font-mono'}>{value}</span>
    </div>
  )
}

export function PriceSummary({ totals }) {
  return (
    <div className="space-y-2.5">
      <Row label="Tạm tính" value={formatVnd(totals.subtotal)} />
      {totals.discount > 0 && <Row label="Giảm giá" value={`− ${formatVnd(totals.discount)}`} accent />}
      <Row label="Phí giao" value={totals.shipping === 0 ? 'Miễn phí' : formatVnd(totals.shipping)} />
      <Row label="Tiền cọc (hoàn khi trả)" value={formatVnd(totals.depositTotal)} muted />
      <div className="my-3 border-t border-dashed hairline" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Thanh toán hôm nay</span>
        <span className="font-[var(--font-display)] text-2xl text-accent">{formatVnd(totals.dueNow)}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Gồm phí thuê {formatVnd(totals.grandTotal)} và cọc {formatVnd(totals.depositTotal)}. Cọc hoàn lại
        sau khi trả váy nguyên vẹn.
      </p>
    </div>
  )
}
