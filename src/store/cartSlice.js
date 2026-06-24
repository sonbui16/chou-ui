import { createSlice } from '@reduxjs/toolkit'

/**
 * Giỏ hàng — slice này được persist (redux-persist) thay cho localStorage thủ công.
 * Mỗi item có khoá `key` duy nhất; thêm trùng key sẽ thay thế item cũ.
 */
const initialState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, { payload }) {
      state.items = state.items.filter((i) => i.key !== payload.key)
      state.items.push(payload)
    },
    removeItem(state, { payload: key }) {
      state.items = state.items.filter((i) => i.key !== key)
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addItem, removeItem, clearCart } = cartSlice.actions
export const selectCartItems = (state) => state.cart.items
export default cartSlice.reducer
