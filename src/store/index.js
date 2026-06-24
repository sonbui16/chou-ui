import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './authSlice'
import cartReducer from './cartSlice'

// Chỉ persist giỏ hàng; auth không persist (token ở localStorage, user lấy lại qua getMe).
const cartPersistConfig = { key: 'chou:cart', version: 1, storage }

const rootReducer = combineReducers({
  auth: authReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Bỏ qua các action nội bộ của redux-persist khỏi kiểm tra serializable.
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export * from './hooks'
