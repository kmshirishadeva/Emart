// OTP service using Supabase database
import { supabase } from './supabase-client'

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store OTP in Supabase database
export async function storeOTP(email: string): Promise<string> {
  const otp = generateOTP()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  try {
    const { error } = await supabase
      .from('OTP')
      .insert({
        email,
        otp,
        expiresAt: expiresAt.toISOString(),
        used: false,
      })

    if (error) {
      console.error('Failed to store OTP in database:', error.message)
      throw error
    }

    console.log(`✅ OTP stored in database for ${email}: ${otp}`)
    console.log(`⏰ OTP expires at: ${expiresAt.toLocaleTimeString()}`)

    return otp
  } catch (error: any) {
    console.error('Error storing OTP:', error.message)
    throw error
  }
}

// Verify OTP from Supabase database
export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  try {
    // Find valid, unused OTP
    const { data, error } = await supabase
      .from('OTP')
      .select('id, otp, expiresAt, used')
      .eq('email', email)
      .eq('otp', otp)
      .eq('used', false)
      .gt('expiresAt', new Date().toISOString())
      .order('createdAt', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error verifying OTP:', error.message)
      return false
    }

    if (!data) {
      console.log(`❌ Invalid or expired OTP for ${email}`)
      return false
    }

    // Mark OTP as used
    await supabase
      .from('OTP')
      .update({ used: true })
      .eq('id', data.id)

    console.log(`✅ OTP verified successfully for ${email}`)
    return true
  } catch (error: any) {
    console.error('Error verifying OTP:', error.message)
    return false
  }
}

// Clean up expired OTPs (optional cleanup function)
export async function cleanupExpiredOTPs() {
  try {
    const { error } = await supabase
      .from('OTP')
      .delete()
      .lt('expiresAt', new Date().toISOString())

    if (error) {
      console.error('Error cleaning up expired OTPs:', error.message)
    } else {
      console.log('✅ Cleaned up expired OTPs')
    }
  } catch (error: any) {
    console.error('Error in cleanup:', error.message)
  }
}

