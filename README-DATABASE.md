# Database Configuration Guide

## Important: Supabase API URL vs Database URL

### Two Different URLs for Two Different Purposes

#### 1. `DATABASE_URL` (for Prisma/PostgreSQL)
- **Purpose**: Direct PostgreSQL database connection
- **Format**: `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require`
- **Used By**: Prisma ORM
- **Port**: 5432 (direct connection)
- **Protocol**: `postgresql://` (NOT `https://`)

#### 2. `NEXT_PUBLIC_SUPABASE_URL` (for Supabase API)
- **Purpose**: Supabase API endpoint for Supabase Client SDK
- **Format**: `https://xxx.supabase.co`
- **Used By**: Supabase Client (if you use Supabase Auth/Storage/etc.)
- **Port**: HTTPS (443)
- **Protocol**: `https://`

### ❌ Common Mistakes

**WRONG:**
```env
DATABASE_URL="https://xxx.supabase.co"  # ❌ This is API URL, not database!
```

**CORRECT:**
```env
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
```

### Configuration Validation

The app automatically validates `DATABASE_URL` on startup:

- ✅ Must start with `postgresql://`
- ✅ Must use `db.*.supabase.co` host (not just `*.supabase.co`)
- ✅ Must use port `5432` (direct connection)
- ❌ Cannot contain `https://` (that's for API URL)

### Connection Issues

If you see: "Can't reach database server at db.xxx.supabase.co:5432"

**Check:**
1. Supabase Dashboard → Is database **Active** (not paused)?
2. `DATABASE_URL` uses `db.xxx.supabase.co:5432` (not API URL)
3. Firewall allows port 5432
4. Password is URL-encoded (`@` = `%40`, `#` = `%23`)

**The app will automatically:**
- Use mock storage if database is unreachable
- Continue functioning without crashing
- Switch to real database when connection is restored

### Example `.env` File

```env
# PostgreSQL direct connection (for Prisma)
DATABASE_URL="postgresql://postgres:YourPassword%40Here@db.xxx.supabase.co:5432/postgres?schema=public&sslmode=require"

# Supabase API endpoint (for Supabase Client SDK)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="your-key-here"
```

### Safe Database Layer

The app includes a safe database layer (`lib/db-safe.ts`) that:
- Tries real database first
- Automatically falls back to mock storage if DB fails
- Never crashes the app
- Caches health status (30-second intervals)

This ensures the app works even if Supabase database is temporarily unreachable.

