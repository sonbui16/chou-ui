import { createSlice } from '@reduxjs/toolkit'
import { getToken } from '@/lib/apiClient'

/**
 * State xác thực. KHÔNG persist qua redux-persist: token nằm ở localStorage
 * (qua `@/lib/apiClient`), `user` được khôi phục bằng `getMe` ở `AuthBootstrap`.
 * Login/register/logout xử lý ở `useAuth` (hooks.js) để giữ nguyên ApiError ném ra.
 */
const initialState = {
  user: null,
  loading: Boolean(getToken()), // đang khôi phục phiên nếu có token
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, { payload }) {
      state.user = payload
    },
    clearUser(state) {
      state.user = null
    },
    setLoading(state, { payload }) {
      state.loading = payload
    },
  },
})

export const { setUser, clearUser, setLoading } = authSlice.actions
export const selectUser = (state) => state.auth.user
export const selectAuthLoading = (state) => state.auth.loading
export default authSlice.reducer
