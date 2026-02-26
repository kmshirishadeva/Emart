'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useUser } from '@/contexts/UserContext'

export function Nav() {
  const { getTotalItems } = useCart()
  const { user, logout } = useUser()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            QuickDrop
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/cart" className="hover:text-primary-200 relative inline-block">
              Cart
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link href="/profile" className="hover:text-primary-200">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-primary-200 bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="hover:text-primary-200">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

