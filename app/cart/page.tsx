'use client'

import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link
            href="/"
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-b-0">
            <div className="relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              <p className="text-primary-600 font-bold">₹{item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 text-sm mt-1 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total Items:</span>
          <span className="font-semibold">{getTotalItems()}</span>
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold text-gray-900">Total Price:</span>
          <span className="text-2xl font-bold text-primary-600">₹{getTotalPrice().toFixed(2)}</span>
        </div>
        <Link
          href="/checkout"
          className="block w-full bg-primary-600 text-white text-center py-3 rounded-md hover:bg-primary-700 transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}

