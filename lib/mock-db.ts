// Temporary mock database for users when real database is unavailable
// This allows the app to work while database connection is being fixed
// Note: This is in-memory only (server-side). For persistence, use real database.

interface MockUser {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
}

// In-memory storage (server-side only)
// In production, always use real database
const mockUsers = new Map<string, MockUser>()

function saveToStorage() {
  // No-op for server-side mock storage
  // Data is lost on server restart - this is intentional for development only
}

export function findUserByEmail(email: string): MockUser | null {
  for (const user of mockUsers.values()) {
    if (user.email === email) {
      return user
    }
  }
  return null
}

export function createUser(name: string, email: string, phone: string): MockUser {
  const user: MockUser = {
    id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    phone,
    createdAt: new Date().toISOString(),
  }
  mockUsers.set(user.id, user)
  saveToStorage()
  return user
}

export function updateUser(email: string, name: string, phone: string): MockUser | null {
  const user = findUserByEmail(email)
  if (user) {
    user.name = name
    user.phone = phone
    mockUsers.set(user.id, user)
    saveToStorage()
    return user
  }
  return null
}

export function getUserById(id: string): MockUser | null {
  return mockUsers.get(id) || null
}

