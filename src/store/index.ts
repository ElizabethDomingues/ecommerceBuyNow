import { ref } from 'vue'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000'

export interface Product {
  id: number
  name: string
  brand: string
  price: string
  originalPrice: string | null
  installments: string
  shape: string
  shapeColor: string
  color: string
  color2: string
  badge: { label: string; type: string } | null
  sizes: string[]
  colorOptions: string[]
  rating: number
  reviews: number
  categoria: string
  marca: string
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  date: string
  favorites?: number[]
  status?: string
}

export interface CartItem {
  id: number
  productId: number
  name: string
  size: string
  price: string
  color: string
}

export const cartItems = ref<CartItem[]>([])

export function addToCart(product: any, size: string) {
  const newItem: CartItem = {
    id: cartItems.value.length ? Math.max(...cartItems.value.map(i => i.id)) + 1 : 1,
    productId: product.id,
    name: product.name,
    size: size,
    price: product.price,
    color: product.color || '#d4b896'
  }
  cartItems.value.push(newItem)
}

export function removeFromCart(id: number) {
  cartItems.value = cartItems.value.filter(i => i.id !== id)
}

export function clearCart() {
  cartItems.value = []
}

export async function decreaseProductsStock(productIds: number[]) {
  console.log('◈ Frontend decreaseProductsStock productIds:', productIds)
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/decrease-stock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds })
    })
    console.log('◈ Frontend decreaseProductsStock response status:', res.status)
    if (res.ok) {
      await fetchProducts()
      return true
    }
  } catch (e) {
    console.error('Error calling decrease-stock endpoint:', e)
  }
  return false
}

export const currentRoute = ref<string>(window.location.hash || '#/')
export const searchQuery = ref<string>('')
export const showOnlyFavorites = ref<boolean>(false)

window.addEventListener('hashchange', () => {
  currentRoute.value = window.location.hash || '#/'
})

export function navigateTo(hash: string) {
  window.location.hash = hash
  currentRoute.value = hash
}

export const SHAPES = {
  dress: 'M40 10 Q60 5 80 10 L90 60 Q85 120 60 170 Q35 120 30 60 Z',
  blouse: 'M25 20 Q60 10 95 20 L100 80 Q80 90 60 88 Q40 90 20 80 Z',
  pants: 'M35 10 L55 10 L65 170 L45 170 Z M65 10 L85 10 L75 170 L55 170 Z',
  skirt: 'M30 10 Q60 5 90 10 L100 80 Q80 150 60 160 Q40 150 20 80 Z',
}

// ── REACTIVE STATES BACKED BY FULLSTACK API ──
export const products = ref<Product[]>([])
export const users = ref<User[]>([])
const getStoredUser = (): User | null => {
  try {
    const saved = localStorage.getItem('aure_admin_user')
    return saved ? JSON.parse(saved) : null
  } catch (e) {
    return null
  }
}

export const currentUser = ref<User | null>(getStoredUser())

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (res.ok) {
      const user = await res.json()
      currentUser.value = user
      localStorage.setItem('aure_admin_user', JSON.stringify(user))
      return { success: true }
    } else {
      const errData = await res.json()
      return { success: false, error: errData.error || 'Credenciais inválidas.' }
    }
  } catch (error) {
    console.error('Erro na requisição de login do administrador:', error)
    return { success: false, error: 'Erro de conexão com o servidor.' }
  }
}

export function logoutAdmin() {
  currentUser.value = null
  localStorage.removeItem('aure_admin_user')
  navigateTo('#/')
}

// ── API CRUD OPERATIONS ──

export async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`)
    if (res.ok) {
      products.value = await res.json()
    } else {
      console.error('Failed to fetch products from backend API database')
    }
  } catch (error) {
    console.error('Network error fetching products from database API:', error)
  }
}

export async function addProduct(payload: Omit<Product, 'id'>) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      const newProduct = await res.json()
      products.value.unshift(newProduct)
      return newProduct
    }
  } catch (error) {
    console.error('Error adding product to database:', error)
  }
}

export async function updateProduct(id: number, payload: Omit<Product, 'id'>) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      const updatedProduct = await res.json()
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = updatedProduct
      }
      return updatedProduct
    }
  } catch (error) {
    console.error('Error updating product in database:', error)
  }
}

export async function deleteProduct(id: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      products.value = products.value.filter(p => p.id !== id)
      return true
    }
  } catch (error) {
    console.error('Error deleting product from database:', error)
  }
  return false
}

export async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users`)
    if (res.ok) {
      users.value = await res.json()
    }
  } catch (error) {
    console.error('Network error fetching users from database:', error)
  }
}

export async function addUser(payload: Omit<User, 'id' | 'date'>) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      const newUser = await res.json()
      users.value.unshift(newUser)
      currentUser.value = newUser
      return newUser
    }
  } catch (error) {
    console.error('Error adding user to database:', error)
  }
}

export async function updateUser(id: number, payload: Partial<Omit<User, 'id' | 'date'>>) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      const updatedUser = await res.json()
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      if (currentUser.value && currentUser.value.id === id) {
        if (updatedUser.status === 'Inativo') {
          currentUser.value = null
          localStorage.removeItem('adminUser')
        } else {
          currentUser.value = updatedUser
        }
      }
      return updatedUser
    }
  } catch (error) {
    console.error('Error updating user in database:', error)
  }
}

export async function deleteUser(id: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      users.value = users.value.filter(u => u.id !== id)
      if (currentUser.value && currentUser.value.id === id) {
        currentUser.value = null
      }
      return true
    }
  } catch (error) {
    console.error('Error deleting user from database:', error)
  }
  return false
}

// ── INITIAL AUTO FETCH ON BOOT ──
fetchProducts()
fetchUsers()
