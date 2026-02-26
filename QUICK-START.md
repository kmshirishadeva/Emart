# Quick Start Guide

## ✅ App is Ready!

The app now uses **Supabase REST API** (no direct database connections needed).

## Setup Steps

### 1. Install Dependencies (if not done)
```bash
npm install
```

### 2. Environment Variables
Your `.env` file should have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://etpzxzgfljdwgeyprijl.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_fNf8S0IvCu67uWGBVNRecw_lL6UGz2A
```

**Note:** `DATABASE_URL` is NOT needed for the app to run (only for Prisma schema reference).

### 3. Create Database Tables

**Go to Supabase SQL Editor:**
- https://supabase.com/dashboard/project/etpzxzgfljdwgeyprijl
- Click **"SQL Editor"** in left sidebar

**Step 1: Create Tables**
1. Click **"New Query"**
2. Open `database_setup.sql` from your project
3. Copy **ALL** the SQL code
4. Paste into SQL Editor
5. Click **"Run"** (or Ctrl+Enter)
6. Should see: "Success. No rows returned"

**Step 2: Add Products**
1. Click **"New Query"** again
2. Open `seed_products.sql` from your project
3. Copy **ALL** the SQL code
4. Paste into SQL Editor
5. Click **"Run"**
6. Should see: "Success. 12 rows inserted"

### 4. Start the App
```bash
npm run dev
```

Open http://localhost:3000

## How It Works

- ✅ Uses Supabase JavaScript client (`@supabase/supabase-js`)
- ✅ Connects via HTTPS (port 443) - **no port blocking!**
- ✅ Uses `NEXT_PUBLIC_SUPABASE_URL` + API key
- ✅ All data operations go through Supabase REST API
- ✅ Automatic fallback to mock storage if API fails
- ✅ Works on any network

## Troubleshooting

**If tables don't exist:**
- Run `database_setup.sql` in Supabase SQL Editor
- Check Supabase Dashboard → Table Editor to verify tables exist

**If products don't show:**
- Run `seed_products.sql` in Supabase SQL Editor
- Check Supabase Dashboard → Table Editor → Product table

**If signup fails:**
- App will use mock storage automatically
- Check browser console for error messages
- Verify Supabase API key is correct in `.env`

## No More Database Connection Issues!

- ❌ No `DATABASE_URL` needed for runtime
- ❌ No port 5432 blocking
- ❌ No "Can't reach database server" errors
- ✅ Everything works through Supabase REST API

