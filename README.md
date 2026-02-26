# QuickDrop - Instant Delivery App

A minimal Zepto-like instant delivery web app built with Next.js 14, Tailwind CSS, and PostgreSQL.

## Features

- 🛍️ Product browsing with categories (Groceries, Fruits, Snacks)
- 🛒 Shopping cart with quantity management
- 👤 User authentication (email + phone login, no passwords)
- 📦 Order placement linked to user accounts
- 📋 View past orders
- 👤 User profile management
- 👨‍💼 Admin dashboard to view all orders
- 📱 Mobile-first responsive design

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Context API (Cart & User)

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running locally or remote
- npm or yarn package manager

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/quickdrop?schema=public"
```

Replace `username`, `password`, and `quickdrop` with your PostgreSQL credentials and database name.

### 3. Setup Database

```bash
# Push Prisma schema to database
npm run db:push

# Seed database with products
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Routes

- `/` - Home page with products
- `/login` - User login/registration
- `/cart` - Shopping cart
- `/checkout` - Checkout page (requires login)
- `/profile` - User profile (requires login)
- `/orders` - User's past orders (requires login)
- `/admin/orders` - Admin orders dashboard

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push Prisma schema to database
- `npm run db:seed` - Seed database with products
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
quickdrop/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── login/
│   │   │       └── route.ts  # POST /api/auth/login
│   │   ├── user/
│   │   │   ├── route.ts      # GET /api/user
│   │   │   └── orders/
│   │   │       └── route.ts  # GET /api/user/orders
│   │   ├── products/
│   │   │   └── route.ts      # GET /api/products
│   │   └── orders/
│   │       └── route.ts       # POST /api/orders, GET /api/orders
│   ├── admin/
│   │   └── orders/
│   │       └── page.tsx       # Admin orders page
│   ├── cart/
│   │   └── page.tsx           # Cart page
│   ├── checkout/
│   │   └── page.tsx           # Checkout page
│   ├── login/
│   │   └── page.tsx           # Login page
│   ├── profile/
│   │   └── page.tsx           # User profile page
│   ├── orders/
│   │   └── page.tsx           # User orders page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/
│   └── Nav.tsx                # Navigation component
├── contexts/
│   ├── CartContext.tsx        # Cart state management
│   └── UserContext.tsx        # User authentication state
├── lib/
│   └── prisma.ts              # Prisma client
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seed script
└── package.json
```

## Database Schema

- **User**: id (uuid), name, email (unique), phone, createdAt
- **Product**: id, name, category, price, imageUrl
- **Order**: id, userId (FK), address, totalPrice, status (PLACED/DELIVERED), createdAt
- **OrderItem**: id, orderId (FK), productId (FK), quantity, price

## Authentication

- Simple email + phone login (no passwords)
- User data stored in localStorage
- Auto-creates user account on first login
- No OTP or JWT tokens

## API Endpoints

- `POST /api/auth/login` - Login/register user
- `GET /api/user?userId=...` - Get user details
- `GET /api/user/orders?userId=...` - Get user's orders
- `GET /api/products` - Get all products
- `POST /api/orders` - Create order (requires userId)
- `GET /api/orders` - Get all orders (admin)

## Notes

- Simple mock authentication (no password hashing)
- No payment processing
- Uses mock product images from Unsplash
- All data is stored in PostgreSQL
- User ID stored in localStorage for session management

## Troubleshooting

If you encounter database connection issues:

1. Ensure PostgreSQL is running
2. Check your `DATABASE_URL` in `.env` file
3. Verify database exists: `createdb quickdrop` (if using local PostgreSQL)
4. Run `npm run db:push` again

For Prisma issues:

1. Regenerate Prisma client: `npx prisma generate`
2. Check Prisma schema syntax
3. Verify database connection string format

