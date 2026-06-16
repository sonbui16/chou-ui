import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)
const CART_KEY = 'chou:cart'

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) ?? []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load)

  const persist = useCallback((next) => {
    setItems(next)
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      add: (item) => persist([...items.filter((i) => i.key !== item.key), item]),
      remove: (key) => persist(items.filter((i) => i.key !== key)),
      clear: () => persist([]),
    }),
    [items, persist],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
