import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone } = body

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Use Supabase client (automatic fallback to mock if fails)
    const user = await db.createOrUpdateUser(name, email, phone)

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    })
  } catch (error: any) {
    console.error('Error in login:', error)
    return NextResponse.json(
      {
        error: 'Failed to login',
        details: error?.message || 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}

