import { apiFetch } from '@/lib/apiClient'

/**
 * Service theo dõi hiện diện (presence) — gửi heartbeat lên API.
 * Tự quản visitor/session id trong localStorage. Hook UI: `@/components/PresenceTracker`.
 */

const VISITOR_KEY = 'chou:presence:visitor'
const SESSION_KEY = 'chou:presence:session'
const LAST_ACTIVE_KEY = 'chou:presence:last-active'
const SESSION_TIMEOUT_MS = 30 * 60 * 1000

function randomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  if (globalThis.crypto?.getRandomValues) {
    const bytes = new Uint8Array(16)
    globalThis.crypto.getRandomValues(bytes)
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`
}

function read(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* Theo dõi vẫn hoạt động trong tab hiện tại nếu storage bị chặn. */
  }
}

let memoryVisitorId
let memorySessionId
let memoryLastActive = 0

function getVisitorId() {
  const stored = read(VISITOR_KEY)
  if (stored) return stored
  memoryVisitorId ||= randomId()
  write(VISITOR_KEY, memoryVisitorId)
  return memoryVisitorId
}

function getSession() {
  const now = Date.now()
  const storedLastActive = Number(read(LAST_ACTIVE_KEY)) || memoryLastActive
  let sessionId = read(SESSION_KEY) || memorySessionId

  if (!sessionId || now - storedLastActive > SESSION_TIMEOUT_MS) {
    sessionId = randomId()
    memorySessionId = sessionId
    write(SESSION_KEY, sessionId)
  }

  memoryLastActive = now
  write(LAST_ACTIVE_KEY, String(now))
  return { visitorId: getVisitorId(), sessionId }
}

export function sendPresence(event, path) {
  const { visitorId, sessionId } = getSession()
  return apiFetch('/presence/heartbeat', {
    method: 'POST',
    body: {
      visitor_id: visitorId,
      session_id: sessionId,
      path,
      referrer: document.referrer || null,
      event,
    },
  }).catch(() => null)
}
