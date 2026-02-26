import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase-client'
import { findUserByEmail, getUserById } from '@/lib/mock-db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const email = searchParams.get('email')

    let user = null

    if (email) {
      user = await db.findUserByEmail(email)
      if (!user) {
        // Fallback to mock
        const mockUser = findUserByEmail(email)
        if (mockUser) {
          user = {
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            phone: mockUser.phone,
          }
        }
      }
    } else if (userId) {
      user = await db.getUserById(userId)
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
    } else {
      return NextResponse.json({ error: 'User ID or email required' }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get order count
    const orders = await db.getUserOrders(user.id)

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      orderCount: orders.length,
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

