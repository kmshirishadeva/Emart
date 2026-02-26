'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [formData, setFormData] = useState({
    address: '',
  })
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const handleSendOTP = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!formData.address) {
      setError('Please enter delivery address first')
      return
    }

    setError('')
    setSendingOtp(true)

    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }

      setOtpSent(true)
      // In development, show OTP in console
      if (data.otp) {
        console.log(`🔑 OTP for testing: ${data.otp}`)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setSendingOtp(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.address) {
      setError('Please enter delivery address')
      return
    }

    if (!user) {
      router.push('/login')
      return
    }

    if (!otpSent) {
      setError('Please send OTP first')
      return
    }

    if (!otp) {
      setError('Please enter OTP')
      return
    }

    setLoading(true)

    try {
      // Verify OTP first
      const verifyRes = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, otp }),
      })

      const verifyData = await verifyRes.json()

      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Invalid OTP')
      }

      // OTP verified, place order
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }))

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          address: formData.address,
          items: orderItems,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.details || errorData.error || 'Failed to place order')
      }

      const orderData = await res.json()
      console.log('✅ Order placed successfully:', orderData.id)

      clearCart()
      router.push('/?order=success')
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to place order. Please try again.'
      setError(errorMessage)
      console.error('❌ Error placing order:', err)
    } finally {
      setLoading(false)
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

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <a
            href="/"
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    ₹{item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-primary-600">₹{getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Details</h2>
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-1">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Phone:</strong> {user.phone}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {user.email}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your delivery address"
                required
                disabled={otpSent}
              />
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={sendingOtp || !formData.address}
                className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingOtp ? 'Sending OTP...' : 'Send OTP to Email'}
              </button>
            ) : (
              <>
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP (sent to {user.email})
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Check your email for the 6-digit OTP code
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false)
                    setOtp('')
                  }}
                  className="w-full text-sm text-primary-600 hover:text-primary-700"
                >
                  Resend OTP
                </button>
              </>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            {otpSent && (
              <button
                type="submit"
                disabled={loading || !otp}
                className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Confirm & Place Order'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

