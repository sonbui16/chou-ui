import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useAuth } from '@/store/hooks'
import { sendPresence } from '@/services/presence'

const HEARTBEAT_MS = 30 * 1000

export function PresenceTracker() {
  const location = useLocation()
  const { user } = useAuth()
  const path = `${location.pathname}${location.search}`

  useEffect(() => {
    void sendPresence('pageview', path)
  }, [path, user?.id])

  useEffect(() => {
    const heartbeat = () => {
      if (document.visibilityState === 'visible') void sendPresence('heartbeat', path)
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void sendPresence('visible', path)
    }

    const timer = window.setInterval(heartbeat, HEARTBEAT_MS)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [path])

  return null
}
