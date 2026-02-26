// Database configuration validation and separation
// Ensures DATABASE_URL is used ONLY by Prisma, not confused with Supabase API URL

export function validateDatabaseUrl() {
  const dbUrl = process.env.DATABASE_URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!dbUrl) {
    console.warn('⚠️ DATABASE_URL not configured')
    return false
  }

  // Validation 1: DATABASE_URL should NOT contain "https://"
  if (dbUrl.includes('https://')) {
    console.error('❌ DATABASE_URL ERROR: Should be PostgreSQL connection string, not HTTPS URL')
    console.error('   DATABASE_URL is for direct PostgreSQL connection (port 5432)')
    console.error('   NEXT_PUBLIC_SUPABASE_URL is for Supabase API/Client (HTTPS)')
    throw new Error(
      'DATABASE_URL must be a PostgreSQL connection string (postgresql://...), not an HTTPS URL. ' +
      'Use NEXT_PUBLIC_SUPABASE_URL for Supabase API endpoints.'
    )
  }

  // Validation 2: If it contains supabase.co, it must have "db." prefix
  if (dbUrl.includes('supabase.co') && !dbUrl.includes('db.')) {
    console.error('❌ DATABASE_URL ERROR: Supabase database host must be db.*.supabase.co')
    console.error('   Correct format: postgresql://postgres:password@db.xxx.supabase.co:5432/postgres')
    console.error('   NEXT_PUBLIC_SUPABASE_URL format: https://xxx.supabase.co (for API)')
    throw new Error(
      'DATABASE_URL for Supabase must use db.*.supabase.co host (direct PostgreSQL). ' +
      'NEXT_PUBLIC_SUPABASE_URL uses https://*.supabase.co (for Supabase API/Client).'
    )
  }

  // Validation 3: Should be postgresql:// protocol
  if (!dbUrl.startsWith('postgresql://')) {
    console.error('❌ DATABASE_URL ERROR: Must start with postgresql://')
    throw new Error('DATABASE_URL must start with postgresql://')
  }

  // Validation 4: Should use port 5432 (direct connection)
  if (dbUrl.includes(':6543')) {
    console.warn('⚠️ DATABASE_URL uses port 6543 (connection pooler)')
    console.warn('   For Prisma, use port 5432 (direct connection) with sslmode=require')
  }

  console.log('✅ DATABASE_URL validated')
  console.log('   Database host:', dbUrl.match(/@([^:]+)/)?.[1] || 'unknown')
  console.log('   Supabase API URL:', supabaseUrl || 'not configured')
  console.log('   ✓ Prisma will use DATABASE_URL (PostgreSQL)')
  console.log('   ✓ Supabase Client will use NEXT_PUBLIC_SUPABASE_URL (HTTPS API)')

  return true
}

// Clear separation documentation
export const DB_CONFIG = {
  // Prisma uses this for direct PostgreSQL connection
  DATABASE_URL: {
    purpose: 'Direct PostgreSQL connection for Prisma ORM',
    format: 'postgresql://user:password@db.xxx.supabase.co:5432/database?sslmode=require',
    usedBy: 'Prisma Client',
    port: 5432,
  },
  // Supabase Client uses this for API calls
  NEXT_PUBLIC_SUPABASE_URL: {
    purpose: 'Supabase API endpoint for Supabase Client SDK',
    format: 'https://xxx.supabase.co',
    usedBy: 'Supabase Client (if used)',
    port: 'HTTPS (443)',
  },
}

