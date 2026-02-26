'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, isLoading, logout } = useUser()
  const router = useRouter()
  const [orderCount, setOrderCount] = useState(0)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrderCount()
    }
  }, [user])

  const fetchOrderCount = async () => {
    if (!user) return
    try {
      const res = await fetch(`/api/user/orders?userId=${user.id}`)
      if (res.ok) {
        const orders = await res.json()
        setOrderCount(orders.length)
      }
    } catch (error) {
      console.error('Error fetching order count:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">User Details</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-semibold text-gray-900">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-semibold text-gray-900">{user.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="font-semibold text-gray-900">{orderCount}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          href="/orders"
          className="flex-1 bg-primary-600 text-white text-center py-3 rounded-md hover:bg-primary-700 transition-colors"
        >
          View Orders
        </Link>
        <button
          onClick={() => {
            logout()
            router.push('/login')
          }}
          className="flex-1 bg-gray-200 text-gray-900 text-center py-3 rounded-md hover:bg-gray-300 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

