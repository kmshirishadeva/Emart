// Test database connection
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Check if Product table exists and has data
    const productCount = await prisma.product.count()
    console.log(`📦 Products in database: ${productCount}`)
    
    if (productCount === 0) {
      console.log('⚠️  No products found. Please run seed_products.sql in Supabase SQL Editor')
    } else {
      const products = await prisma.product.findMany({ take: 3 })
      console.log('Sample products:')
      products.forEach(p => {
        console.log(`  - ${p.name} (${p.category}) - ₹${p.price}`)
      })
    }
    
    // Check User table
    const userCount = await prisma.user.count()
    console.log(`👤 Users in database: ${userCount}`)
    
    // Check Order table
    const orderCount = await prisma.order.count()
    console.log(`📋 Orders in database: ${orderCount}`)
    
  } catch (error) {
    console.error('❌ Database connection failed!')
    console.error('Error:', error.message)
    console.error('Code:', error.code)
    
    if (error.code === 'P1001') {
      console.error('\n💡 This means Prisma cannot reach the database server.')
      console.error('   Please check:')
      console.error('   1. Is your Supabase database active? (not paused)')
      console.error('   2. Is your DATABASE_URL correct in .env file?')
      console.error('   3. Are there any IP restrictions on your Supabase project?')
    } else if (error.code === 'P2021') {
      console.error('\n💡 Table does not exist. Please run database_setup.sql in Supabase SQL Editor')
    } else if (error.code === 'P2002') {
      console.error('\n💡 Database connection string might be incorrect')
    }
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

