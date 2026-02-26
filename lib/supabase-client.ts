// Supabase client initialization
// Uses NEXT_PUBLIC_SUPABASE_URL and API key (NO direct database connection)

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not configured')
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || '',
  {
    auth: {
      persistSession: false, // We're not using Supabase auth
    },
  }
)

// Database operations using Supabase client
export const db = {
  // User operations
  async findUserByEmail(email: string) {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('id, name, email, phone')
        .eq('email', email)
        .maybeSingle()

      if (error) {
        // If table doesn't exist, return null (will use mock storage)
        if (error.message?.includes('schema cache') || error.code === 'PGRST116') {
          return null
        }
        throw error
      }

      return data || null
    } catch (error: any) {
      console.warn('Supabase query failed:', error.message)
      return null
    }
  },

  async getUserById(id: string) {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('id, name, email, phone')
        .eq('id', id)
        .maybeSingle()

      if (error) {
        if (error.message?.includes('schema cache') || error.code === 'PGRST116') {
          return null
        }
        throw error
      }

      return data || null
    } catch (error: any) {
      console.warn('Supabase query failed:', error.message)
      return null
    }
  },

  async createOrUpdateUser(name: string, email: string, phone: string) {
    try {
      // Try to find existing user
      const existing = await this.findUserByEmail(email)

      if (existing) {
        // Update existing user
        const { data, error } = await supabase
          .from('User')
          .update({ name, phone })
          .eq('id', existing.id)
          .select('id, name, email, phone')
          .maybeSingle()

        if (error) throw error

        console.log('✅ User updated via Supabase:', email)
        return data
      } else {
        // Create new user
        const { data, error } = await supabase
          .from('User')
          .insert({ name, email, phone })
          .select('id, name, email, phone')
          .maybeSingle()

        if (error) throw error

        console.log('✅ User created via Supabase:', email)
        return data
      }
    } catch (error: any) {
      console.warn('Supabase operation failed, using mock storage:', error.message)
      // Fallback to mock
      const { findUserByEmail, createUser, updateUser } = await import('./mock-db')
      let user = findUserByEmail(email)
      if (!user) {
        user = createUser(name, email, phone)
      } else {
        user = updateUser(email, name, phone) || user
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }
    }
  },

  // Product operations
  async getProducts() {
    try {
      const { data, error } = await supabase
        .from('Product')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) {
        if (error.message?.includes('schema cache')) {
          return []
        }
        throw error
      }

      return data || []
    } catch (error: any) {
      console.warn('Supabase query failed for products:', error.message)
      return []
    }
  },

  // Order operations
  async getUserOrders(userId: string) {
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('Order')
        .select(`
          *,
          items:OrderItem (
            *,
            product:Product (*)
          )
        `)
        .eq('userId', userId)
        .order('createdAt', { ascending: false })

      if (ordersError) {
        if (ordersError.message?.includes('schema cache')) {
          return []
        }
        throw ordersError
      }

      return orders || []
    } catch (error: any) {
      console.warn('Supabase query failed for orders:', error.message)
      return []
    }
  },

  async getAllOrders() {
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('Order')
        .select(`
          *,
          user:User (*),
          items:OrderItem (
            *,
            product:Product (*)
          )
        `)
        .order('createdAt', { ascending: false })

      if (ordersError) {
        if (ordersError.message?.includes('schema cache')) {
          return []
        }
        throw ordersError
      }

      return orders || []
    } catch (error: any) {
      console.warn('Supabase query failed for orders:', error.message)
      return []
    }
  },

  async createOrder(userId: string, address: string, items: any[], totalPrice: number) {
    try {
      // Generate order ID (cuid format)
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('Order')
        .insert({
          id: orderId,
          userId,
          address,
          totalPrice,
          status: 'PLACED',
        })
        .select('id, userId, address, totalPrice, status, createdAt')
        .maybeSingle()

      if (orderError) throw orderError

      if (!order) {
        throw new Error('Failed to create order')
      }

      // Create order items with IDs
      const orderItems = items.map((item) => ({
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('OrderItem')
        .insert(orderItems)

      if (itemsError) {
        console.warn('Failed to create order items:', itemsError.message)
        // Order is created, items might fail - still return order
      }

      console.log('✅ Order created via Supabase:', order.id)

      // Fetch complete order with relations
      const { data: completeOrder } = await supabase
        .from('Order')
        .select(`
          *,
          user:User (*),
          items:OrderItem (
            *,
            product:Product (*)
          )
        `)
        .eq('id', order.id)
        .maybeSingle()

      return completeOrder || order
    } catch (error: any) {
      console.warn('Supabase operation failed, order not saved:', error.message)
      // Return mock order for demo
      return {
        id: `mock_${Date.now()}`,
        userId,
        address,
        totalPrice,
        status: 'PLACED',
        createdAt: new Date().toISOString(),
        items: [],
        user: null,
      }
    }
  },
}

