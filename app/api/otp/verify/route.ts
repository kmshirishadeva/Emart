import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = body

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    console.log(`🔍 Verifying OTP for ${email}`)

    // Verify OTP from database
    const isValid = await verifyOTP(email, otp)

    if (!isValid) {
      return NextResponse.json(
        { 
          error: 'Invalid or expired OTP', 
          details: 'The OTP code is incorrect or has expired. Please request a new one.' 
        },
        { status: 400 }
      )
    }

    console.log(`✅ OTP verified successfully for ${email}`)

    return NextResponse.json({ 
      success: true, 
      message: 'OTP verified successfully' 
    })
  } catch (error: any) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP', details: error.message },
      { status: 500 }
    )
  }
}
