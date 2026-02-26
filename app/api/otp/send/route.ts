import { NextRequest, NextResponse } from 'next/server'
import { storeOTP } from '@/lib/otp-service'
import { sendOTPEmail } from '@/lib/email-service'
import { db } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Get user name for personalized email
    let userName = null
    try {
      const user = await db.findUserByEmail(email)
      userName = user?.name || null
    } catch (error) {
      // Continue even if user lookup fails
    }

    // Store OTP in database
    const otp = await storeOTP(email)

    // Send email notification
    await sendOTPEmail(email, otp, userName || undefined)

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent to email',
      // In development, also return OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    })
  } catch (error: any) {
    console.error('Error sending OTP:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP', details: error.message },
      { status: 500 }
    )
  }
}
