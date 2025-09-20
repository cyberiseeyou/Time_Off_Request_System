'use client'

import { useState, useEffect } from 'react'
import type { ManagerSession, ApiResponse } from '@time-off-system/shared-types'

interface AuthState {
  manager: ManagerSession | null
  isLoading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    manager: null,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      // Use dedicated manager info endpoint for authentication verification
      const response = await fetch('/api/manager/me', {
        method: 'GET',
        credentials: 'include'
      })

      if (response.status === 401) {
        setAuthState({
          manager: null,
          isLoading: false,
          error: 'Authentication required'
        })
        return
      }

      if (response.ok) {
        const result: ApiResponse<ManagerSession> = await response.json()

        if (result.success && result.data) {
          setAuthState({
            manager: result.data,
            isLoading: false,
            error: null
          })
        } else {
          setAuthState({
            manager: null,
            isLoading: false,
            error: result.error || 'Authentication failed'
          })
        }
      } else {
        setAuthState({
          manager: null,
          isLoading: false,
          error: 'Authentication failed'
        })
      }
    } catch (error) {
      setAuthState({
        manager: null,
        isLoading: false,
        error: 'Network error'
      })
    }
  }

  const logout = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/manager/login', {
        method: 'DELETE',
        credentials: 'include'
      })

      const result: ApiResponse<null> = await response.json()

      if (result.success) {
        setAuthState({
          manager: null,
          isLoading: false,
          error: null
        })
        return { success: true }
      } else {
        return { success: false, error: result.error || 'Logout failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error during logout' }
    }
  }

  return {
    ...authState,
    logout,
    refetch: checkAuthentication
  }
}