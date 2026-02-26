import { PrismaClient } from '@prisma/client'
import { validateDatabaseUrl } from './db-config'

// Validate DATABASE_URL at startup
if (typeof window === 'undefined') {
  // Server-side only
  try {
    validateDatabaseUrl()
  } catch (error: any) {
    console.error('❌ Database configuration error:', error.message)
    console.error('   The app will use mock storage until DATABASE_URL is fixed')
  }
}

// Global singleton PrismaClient to prevent multiple connections
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with safe error handling
// IMPORTANT: Prisma ONLY uses DATABASE_URL, never NEXT_PUBLIC_SUPABASE_URL
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Suppress connection errors since we use mock storage as fallback
    log: process.env.NODE_ENV === 'development' 
      ? ['error'] // Only show errors, not warnings
      : ['error'],
    datasources: {
      db: {
        // Prisma reads DATABASE_URL from environment
        // This ensures it never accidentally uses NEXT_PUBLIC_SUPABASE_URL
        url: process.env.DATABASE_URL,
      },
    },
    // Add connection timeout
    __internal: {
      engine: {
        connectTimeout: 5000, // 5 second timeout
      },
    },
  } as any)

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Wrap Prisma operations to prevent uncaught errors
const originalConnect = prisma.$connect.bind(prisma)
prisma.$connect = async () => {
  try {
    return await originalConnect()
  } catch (error: any) {
    // Improved error message
    if (error.message?.includes("Can't reach database server")) {
      console.error('❌ Network or Supabase DB unreachable (port 5432 blocked)')
      console.error('   Check: 1) Database is active in Supabase Dashboard')
      console.error('         2) Firewall allows port 5432')
      console.error('         3) DATABASE_URL uses db.*.supabase.co:5432')
      console.error('   Note: NEXT_PUBLIC_SUPABASE_URL is for API, not database connection')
    }
    // Silently fail - db-safe.ts will handle fallback
    return Promise.resolve()
  }
}

