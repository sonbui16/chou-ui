import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'sonner'
import { queryClient } from '@/lib/queryClient'
import { store, persistor } from '@/store'
import { AuthBootstrap } from '@/store/AuthBootstrap'
import { PresenceTracker } from '@/components/PresenceTracker'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import App from '@/App'
import '@/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthBootstrap />
            <PresenceTracker />
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
            <Toaster position="bottom-right" richColors toastOptions={{ style: { fontFamily: 'Inter' } }} />
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
