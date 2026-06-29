import { useEffect, useState } from 'react'

/**
 * Trả về `value` sau khi "lặng" `delay` ms (không đổi). Dùng để tránh gọi API mỗi lần gõ phím
 * (vd ô tìm kiếm). Mỗi lần `value` đổi sẽ hẹn lại timeout; unmount/đổi sớm thì clear.
 */
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}
