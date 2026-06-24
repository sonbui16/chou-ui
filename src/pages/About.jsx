import { useProducts } from '@/features/catalog'
import { LinkButton } from '@/components/ui/button'
import { SectionHeading, ImageWithFallback } from '@/components/ui/primitives'

const VALUES = [
  { title: 'Tuyển chọn khắt khe', desc: 'Mỗi thiết kế được chọn lọc kỹ về phom dáng, chất liệu và độ bền để lên hình hoàn hảo.' },
  { title: 'Vệ sinh chuẩn mực', desc: 'Giặt là hấp chuyên nghiệp sau mỗi lượt thuê, có thời gian nghỉ cho từng bộ váy.' },
  { title: 'Trải nghiệm riêng tư', desc: 'Đặt lịch thử như một buổi hẹn couture — không vội vàng, được tư vấn tận tình.' },
]

export default function About() {
  const { data } = useProducts({ limit: 4 })
  const sample = data?.items ?? []
  return (
    <div>
      <section className="border-b border-border glow-champagne">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-4">Câu chuyện của Chou</p>
            <h1 className="text-5xl leading-tight md:text-6xl">Để mỗi người được <span className="italic text-accent">toả sáng</span> trong khoảnh khắc của mình</h1>
            <p className="mt-6 max-w-md text-muted-foreground">Chou Dress ra đời từ niềm tin rằng vẻ đẹp không nên là thứ chỉ dùng một lần. Chúng tôi mang đến tủ váy couture để bạn thuê — tinh tế, bền vững và vừa túi tiền.</p>
            <LinkButton to="/vay" className="mt-8">Khám phá bộ sưu tập</LinkButton>
          </div>
          <div className="aspect-[4/5] overflow-hidden rounded-md bg-cream">
            <ImageWithFallback src={sample[2]?.primary_image} alt="Atelier Chou" className="size-full" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading eyebrow="Giá trị" title="Điều chúng tôi gìn giữ" />
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <div key={v.title} className="border-t border-border pt-5">
              <span className="font-mono text-sm text-accent">0{i + 1}</span>
              <h3 className="mt-3 text-2xl">{v.title}</h3>
              <p className="mt-2 text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
