# Database Setup Guide

## Quick Setup (Using Supabase SQL Editor)

Since Prisma connection is failing, use Supabase SQL Editor to set up the database:

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard/project/etpzxzgfljdwgeyprijl
2. Click **"SQL Editor"** in the left sidebar

### Step 2: Create Tables
1. Click **"New Query"** button
2. Open `database_setup.sql` file from your project
3. Copy **ALL** the SQL code
4. Paste into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"

### Step 3: Seed Products
1. Click **"New Query"** again
2. Open `seed_products.sql` file
3. Copy **ALL** the SQL code
4. Paste into the SQL Editor
5. Click **"Run"**
6. You should see: "Success. 12 rows inserted"

### Step 4: Verify Tables
1. In Supabase Dashboard, go to **"Table Editor"**
2. You should see:
   - ✅ User table
   - ✅ Product table (with 12 products)
   - ✅ Order table
   - ✅ OrderItem table

### Step 5: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

The app will automatically detect the database once tables are created!

---

## Troubleshooting

**If SQL Editor shows errors:**
- Make sure you're running `database_setup.sql` FIRST
- Then run `seed_products.sql` AFTER
- Check for any syntax errors in the SQL

**If database is paused:**
- Go to Supabase Dashboard → Settings → Database
- Click "Resume" or "Restore" if database is paused
- Wait 1-2 minutes for database to activate

**Connection still failing?**
- The app will use mock storage automatically
- App will work even without database connection
- Once database is active, it will automatically switch to real database

