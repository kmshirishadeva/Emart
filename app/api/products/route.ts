import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase-client'

// Mock products as fallback
const mockProducts = [
  {
    id: 'clx1',
    name: 'Fresh Bananas',
    category: 'Fruits',
    price: 49.0,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'clx2',
    name: 'Red Apples',
    category: 'Fruits',
    price: 89.0,
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'clx3',
    name: 'Sweet Mangoes',
    category: 'Fruits',
    price: 120.0,
    imageUrl: 'https://images.unsplash.com/photo-1605027990121-1c8e0c5e5e5e?w=400&h=400&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'clx4',
    name: 'Fresh Oranges',
    category: 'Fruits',
    price: 75.0,
    imageUrl: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400&h=400&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'clx5',
    name: 'Basmati Rice 1kg',
    category: 'Groceries',
    price: 95.0,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'clx6',
    name: 'Toor Dal 1kg',
    category: 'Groceries',
    price: 125.0,
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=400&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'clx7',
    name: 'Wheat Flour 1kg',
    category: 'Groceries',
    price: 45.0,
    imageUrl: 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=400&h=400&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'clx8',
    name: 'Sugar 1kg',
    category: 'Groceries',
    price: 42.0,
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'clx9',
    name: 'Lay\'s Classic Salted',
    category: 'Snacks',
    price: 20.0,
    imageUrl: 'https://images.unsplash.com/photo-1612929633733-8d8c7c9e5b5e?w=400&h=400&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'clx10',
    name: 'Kurkure Masala Munch',
    category: 'Snacks',
    price: 20.0,
    imageUrl: 'https://images.unsplash.com/photo-1612929633733-8d8c7c9e5b5e?w=400&h=400&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'clx11',
    name: 'Parle-G Biscuits',
    category: 'Snacks',
    price: 10.0,
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'clx12',
    name: 'Maggi Noodles',
    category: 'Snacks',
    price: 14.0,
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export async function GET() {
  try {
    // Use Supabase client with automatic fallback
    const products = await db.getProducts()
    
    // If no products from Supabase, return mock products
    if (products.length === 0) {
      console.log('⚠️  No products in Supabase, returning mock products')
      return NextResponse.json(mockProducts)
    }
    
    console.log(`✅ Fetched ${products.length} products from Supabase`)
    return NextResponse.json(products)
  } catch (error: any) {
    console.error('❌ Error fetching products, using mock data:', error?.message)
    return NextResponse.json(mockProducts)
  }
}

