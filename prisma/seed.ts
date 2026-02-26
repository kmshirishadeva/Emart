import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  // Seed products
  const products = [
    {
      name: 'Fresh Bananas',
      category: 'Fruits',
      price: 49.0,
      imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
    },
    {
      name: 'Red Apples',
      category: 'Fruits',
      price: 89.0,
      imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
    },
    {
      name: 'Sweet Mangoes',
      category: 'Fruits',
      price: 120.0,
      imageUrl: 'https://images.unsplash.com/photo-1605027990121-1c8e0c5e5e5e?w=400&h=400&fit=crop',
    },
    {
      name: 'Fresh Oranges',
      category: 'Fruits',
      price: 75.0,
      imageUrl: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400&h=400&fit=crop',
    },
    {
      name: 'Basmati Rice 1kg',
      category: 'Groceries',
      price: 95.0,
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
    },
    {
      name: 'Toor Dal 1kg',
      category: 'Groceries',
      price: 125.0,
      imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=400&fit=crop',
    },
    {
      name: 'Wheat Flour 1kg',
      category: 'Groceries',
      price: 45.0,
      imageUrl: 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=400&h=400&fit=crop',
    },
    {
      name: 'Sugar 1kg',
      category: 'Groceries',
      price: 42.0,
      imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop',
    },
    {
      name: 'Lay\'s Classic Salted',
      category: 'Snacks',
      price: 20.0,
      imageUrl: 'https://images.unsplash.com/photo-1612929633733-8d8c7c9e5b5e?w=400&h=400&fit=crop',
    },
    {
      name: 'Kurkure Masala Munch',
      category: 'Snacks',
      price: 20.0,
      imageUrl: 'https://images.unsplash.com/photo-1612929633733-8d8c7c9e5b5e?w=400&h=400&fit=crop',
    },
    {
      name: 'Parle-G Biscuits',
      category: 'Snacks',
      price: 10.0,
      imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
    },
    {
      name: 'Maggi Noodles',
      category: 'Snacks',
      price: 14.0,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop',
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('✅ Seeded database with products')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

