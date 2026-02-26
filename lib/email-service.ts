// Email service using Resend
// Get your API key from: https://resend.com/api-keys

import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function sendOTPEmail(email: string, otp: string, name?: string): Promise<boolean> {
  try {
    // If Resend API key is not configured, fall back to console
    if (!resend || !resendApiKey) {
      console.log('\n📧 ========================================')
      console.log('📧 EMAIL NOTIFICATION (OTP)')
      console.log('📧 ========================================')
      console.log(`To: ${email}`)
      if (name) {
        console.log(`Hi ${name},`)
      }
      console.log(`\nYour OTP for QuickDrop order verification is:`)
      console.log(`\n🔐 ${otp}`)
      console.log(`\nThis OTP will expire in 10 minutes.`)
      console.log(`\nIf you didn't request this OTP, please ignore this email.`)
      console.log('📧 ========================================\n')
      console.warn('⚠️  RESEND_API_KEY not configured. Add it to .env to send real emails.')
      return true
    }

    // Send real email using Resend
    const { data, error } = await resend.emails.send({
      from: 'QuickDrop <onboarding@resend.dev>', // Change this to your verified domain
      to: email,
      subject: 'Your QuickDrop Order Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>QuickDrop OTP</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">QuickDrop</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Instant Delivery</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            ${name ? `<p style="font-size: 16px;">Hi ${name},</p>` : '<p style="font-size: 16px;">Hi there,</p>'}
            
            <p style="font-size: 16px;">Your OTP for order verification is:</p>
            
            <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <p style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; margin: 0;">${otp}</p>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              This OTP will expire in <strong>10 minutes</strong>.
            </p>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If you didn't request this OTP, please ignore this email.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="font-size: 12px; color: #999; margin: 0;">
                This is an automated email from QuickDrop. Please do not reply.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        QuickDrop - Order Verification Code
        
        ${name ? `Hi ${name},` : 'Hi there,'}
        
        Your OTP for order verification is: ${otp}
        
        This OTP will expire in 10 minutes.
        
        If you didn't request this OTP, please ignore this email.
        
        ---
        This is an automated email from QuickDrop.
      `,
    })

    if (error) {
      console.error('Failed to send email via Resend:', error)
      // Fall back to console logging
      console.log(`\n📧 OTP for ${email}: ${otp}`)
      return false
    }

    console.log(`✅ Email sent successfully to ${email} via Resend`)
    console.log(`📧 Email ID: ${data?.id}`)
    return true
  } catch (error: any) {
    console.error('Error sending email:', error.message)
    // Fall back to console logging
    console.log(`\n📧 OTP for ${email}: ${otp}`)
    return false
  }
}
