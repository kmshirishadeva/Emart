// Test database connection with diagnostics
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔍 Database Connection Diagnostics\n')
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set')
  
  if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL
    console.log('\nConnection String Analysis:')
    console.log('  Protocol:', url.startsWith('postgresql://') ? '✅ postgresql://' : '❌ Wrong')
    console.log('  Host:', url.match(/@([^:]+)/)?.[1] || 'unknown')
    const port = url.includes(':6543') ? '6543' : url.includes(':5432') ? '5432' : 'unknown'
    console.log('  Port:', port === '6543' ? '✅ 6543 (pooler - recommended)' : port === '5432' ? '✅ 5432 (direct)' : 'unknown')
    console.log('  SSL:', url.includes('sslmode=require') ? '✅ Required' : '⚠️ Not specified')
    console.log('  Pooler:', url.includes('pgbouncer') ? '✅ Using pooler' : '❌ Direct connection')
    console.log('  Username:', url.includes('postgres.') ? '✅ Pooler format (postgres.project)' : '✅ Direct format (postgres)')
  }

  console.log('\n🔌 Testing connection...')
  
  try {
    await prisma.$connect()
    console.log('✅ Connected to Prisma client')
    
    await Promise.race([
      prisma.$queryRaw`SELECT 1 as test`,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout after 5 seconds')), 5000)
      )
    ])
    
    console.log('✅ Database query successful!')
    console.log('✅ Connection is working properly\n')
    
    // Try to query a table
    try {
      const userCount = await prisma.user.count()
      console.log(`✅ User table exists: ${userCount} users`)
    } catch (e) {
      console.log('⚠️  User table not found - run database_setup.sql in Supabase')
    }
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message)
    console.error('\n💡 Troubleshooting:')
    console.error('1. Go to Supabase Dashboard → Check if database is ACTIVE')
    console.error('2. If paused, click "Resume" or "Restore"')
    console.error('3. Try connection pooler: Change port from 5432 to 6543')
    console.error('4. Check firewall/network allows port 5432 or 6543')
    console.error('5. Verify password in DATABASE_URL is correct and URL-encoded')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

