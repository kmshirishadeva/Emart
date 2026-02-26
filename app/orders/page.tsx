'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import Image from 'next/image'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    imageUrl: string
  }
}

interface Order {
  id: string
  totalPrice: number
  status: string
  address: string
  createdAt: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    if (!user) return
    try {
      const res = await fetch(`/api/user/orders?userId=${user.id}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  if (isLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading orders...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">No orders yet</p>
          <a
            href="/"
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4 pb-4 border-b">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(order.createdAt)}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Status:</strong>{' '}
                    <span
                      className={`font-semibold ${
                        order.status === 'DELIVERED' ? 'text-green-600' : 'text-orange-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">₹{order.totalPrice.toFixed(2)}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Address:</strong> {order.address}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          ₹{item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

