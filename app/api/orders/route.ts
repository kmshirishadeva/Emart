import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase-client'
import { getUserById } from '@/lib/mock-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, address, items } = body

    if (!userId || !address || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields', details: 'userId, address, and items are required' },
        { status: 400 }
      )
    }

    // Verify user exists
    let user = await db.getUserById(userId)
    if (!user) {
      // Fallback to mock
      const mockUser = getUserById(userId)
      if (mockUser) {
        user = {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          phone: mockUser.phone,
        }
      }
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', details: `User with ID ${userId} does not exist` },
        { status: 404 }
      )
    }

    // Calculate total price
    const totalPrice = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    )

    // Use Supabase client with automatic fallback
    const order = await db.createOrder(userId, address, items, totalPrice)

    console.log('✅ Order created successfully:', order.id)

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error('❌ Error creating order:', error)
    return NextResponse.json(
      {
        error: 'Failed to create order',
        details: error?.message || 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Use Supabase client with automatic fallback
    const orders = await db.getAllOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

