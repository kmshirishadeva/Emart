// Shared OTP storage (in production, use Redis or database)
export const otpStore = new Map<string, { otp: string; expiresAt: number }>()

