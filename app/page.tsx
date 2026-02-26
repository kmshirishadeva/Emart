'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  category: string
  price: number
  imageUrl: string
}

const categories = ['All', 'Groceries', 'Fruits', 'Snacks']

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
    // Check for success parameter in URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('order') === 'success') {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 5000)
        // Clean URL
        window.history.replaceState({}, '', '/')
      }
    }
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      // Ensure data is an array
      if (Array.isArray(data)) {
        setProducts(data)
        setError(null)
      } else {
        console.error('Invalid products data:', data)
        setProducts([])
        setError(data.error || 'Failed to load products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = Array.isArray(products)
    ? selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory)
    : []

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-semibold">Order placed successfully! 🎉</p>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-semibold">Error: {error}</p>
          <p className="text-sm mt-1">Please make sure the database is set up correctly.</p>
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Nearby Products</h1>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative w-full h-48 bg-gray-200">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-primary-600 font-bold mb-3">₹{product.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">No products found in this category</div>
      )}
    </div>
  )
}

