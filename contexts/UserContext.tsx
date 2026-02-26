'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  phone: string
}

interface UserContextType {
  user: User | null
  login: (name: string, email: string, phone: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const loadUser = async () => {
      try {
        const userId = localStorage.getItem('userId')
        if (userId) {
          const res = await fetch(`/api/user?userId=${userId}`)
          if (res.ok) {
            const userData = await res.json()
            setUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
            })
          } else {
            localStorage.removeItem('userId')
          }
        }
      } catch (error) {
        console.error('Error loading user:', error)
        localStorage.removeItem('userId')
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  const login = async (name: string, email: string, phone: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Login failed')
      }

      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
      })
      localStorage.setItem('userId', data.id)
    } catch (error: any) {
      console.error('Error logging in:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('userId')
  }

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

