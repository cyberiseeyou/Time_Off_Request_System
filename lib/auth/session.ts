import { NextRequest } from 'next/server'
import type { ManagerSession } from '@time-off-system/shared-types'

// In-memory session store (replace with Redis or database in production)
const sessionStore = new Map<string, {
  data: ManagerSession
  expiresAt: number
}>()

// Session configuration
const SESSION_DURATION = 8 * 60 * 60 * 1000 // 8 hours in milliseconds

export class SessionManager {
  static createSession(sessionToken: string, managerData: ManagerSession): void {
    const expiresAt = Date.now() + SESSION_DURATION

    sessionStore.set(sessionToken, {
      data: managerData,
      expiresAt
    })
  }

  static getSession(sessionToken: string): ManagerSession | null {
    const session = sessionStore.get(sessionToken)

    if (!session) {
      return null
    }

    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      sessionStore.delete(sessionToken)
      return null
    }

    return session.data
  }

  static deleteSession(sessionToken: string): void {
    sessionStore.delete(sessionToken)
  }

  static extendSession(sessionToken: string): boolean {
    const session = sessionStore.get(sessionToken)

    if (!session) {
      return false
    }

    // Extend session expiration
    session.expiresAt = Date.now() + SESSION_DURATION
    return true
  }

  static cleanupExpiredSessions(): void {
    const now = Date.now()

    for (const [token, session] of sessionStore.entries()) {
      if (now > session.expiresAt) {
        sessionStore.delete(token)
      }
    }
  }

  static getSessionFromRequest(request: NextRequest): ManagerSession | null {
    const sessionToken = this.getSessionTokenFromRequest(request)

    if (!sessionToken) {
      return null
    }

    return this.getSession(sessionToken)
  }

  static getSessionTokenFromRequest(request: NextRequest): string | null {
    // Get session token from cookie
    const cookieHeader = request.headers.get('cookie')

    if (!cookieHeader) {
      return null
    }

    // Parse cookies to find manager_session
    const cookies = cookieHeader.split(';').map(cookie => cookie.trim())

    for (const cookie of cookies) {
      const [name, value] = cookie.split('=')
      if (name === 'manager_session' && value) {
        return value
      }
    }

    return null
  }
}

// Authentication middleware function
export function requireAuthentication(request: NextRequest): {
  isAuthenticated: boolean
  session: ManagerSession | null
  error?: string
} {
  try {
    const session = SessionManager.getSessionFromRequest(request)

    if (!session) {
      return {
        isAuthenticated: false,
        session: null,
        error: 'No valid session found'
      }
    }

    // Extend session on valid access
    const sessionToken = SessionManager.getSessionTokenFromRequest(request)
    if (sessionToken) {
      SessionManager.extendSession(sessionToken)
    }

    return {
      isAuthenticated: true,
      session
    }
  } catch (error) {
    console.error('Authentication error:', error)

    return {
      isAuthenticated: false,
      session: null,
      error: 'Authentication error'
    }
  }
}

// Cleanup expired sessions every 30 minutes
if (typeof window === 'undefined') { // Server-side only
  setInterval(() => {
    SessionManager.cleanupExpiredSessions()
  }, 30 * 60 * 1000) // 30 minutes
}