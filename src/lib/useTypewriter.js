import { useEffect, useState } from 'react'

const prefersReduced = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Hiệu ứng "máy đánh chữ" cho placeholder: gõ từng chữ một câu → chờ → xoá dần → sang câu kế, lặp vô hạn.
 * Trả về CHUỖI hiện tại đã kèm con trỏ nháy `|`.
 *
 * @param phrases  Mảng câu xoay vòng (định danh nên ỔN ĐỊNH — khai báo ở module-level).
 * @param opts.enabled  false → dừng (trả câu tĩnh đầu tiên), tránh chạy timer/re-render thừa.
 */
export function useTypewriter(phrases, { typeSpeed = 80, deleteSpeed = 40, pause = 1500, enabled = true } = {}) {
  const reduced = prefersReduced()
  const active = enabled && !reduced && phrases.length > 0

  const [text, setText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [caret, setCaret] = useState(true)

  // Vòng gõ / xoá
  useEffect(() => {
    if (!active) return
    const full = phrases[phraseIndex % phrases.length]

    // Gõ xong cả câu → chờ rồi chuyển sang xoá
    if (!deleting && text === full) {
      const t = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(t)
    }
    // Xoá hết → sang câu kế
    if (deleting && text === '') {
      setDeleting(false)
      setPhraseIndex((n) => (n + 1) % phrases.length)
      return
    }
    const t = setTimeout(
      () => setText((cur) => (deleting ? full.slice(0, cur.length - 1) : full.slice(0, cur.length + 1))),
      deleting ? deleteSpeed : typeSpeed,
    )
    return () => clearTimeout(t)
  }, [active, text, deleting, phraseIndex, phrases, typeSpeed, deleteSpeed, pause])

  // Con trỏ nháy
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setCaret((c) => !c), 500)
    return () => clearInterval(id)
  }, [active])

  if (!active) return phrases[0] ?? ''
  return text + (caret ? '|' : ' ') // nbsp khi tắt con trỏ → không giật chiều rộng
}
