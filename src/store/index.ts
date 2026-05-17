import { ref } from 'vue'

// ── BACKEND CONFIG ──────────────────────────────────────────────────────────
const RAW_API_URL = (import.meta as any).env?.VITE_API_URL || ''
const API_BASE_URL = RAW_API_URL && RAW_API_URL.startsWith('http') ? RAW_API_URL : ''
const USE_LOCAL = !API_BASE_URL

// ── TIPOS ───────────────────────────────────────────────────────────────────
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
  image?: string | null
  description?: string
  stock?: number
  active?: boolean
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  date: string
  password?: string | null
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

// ── SHAPES ──────────────────────────────────────────────────────────────────
export const SHAPES = {
  dress: 'M40 10 Q60 5 80 10 L90 60 Q85 120 60 170 Q35 120 30 60 Z',
  blouse: 'M25 20 Q60 10 95 20 L100 80 Q80 90 60 88 Q40 90 20 80 Z',
  pants: 'M35 10 L55 10 L65 170 L45 170 Z M65 10 L85 10 L75 170 L55 170 Z',
  skirt: 'M30 10 Q60 5 90 10 L100 80 Q80 150 60 160 Q40 150 20 80 Z',
}

// ── DADOS PADRÃO (seed) ─────────────────────────────────────────────────────
const DEFAULT_PRODUCTS: Omit<Product, 'id'>[] = [
  { name: 'Vestido Midi Floral Recorte', brand: 'Farm Rio', price: 'R$ 389,90', originalPrice: null, installments: '6x R$ 64,98', color: '#e8ddd0', color2: '#d4c4b0', colorOptions: ['#1a1410', '#d4b896', '#c9938a'], sizes: ['PP', 'P', 'M', 'G', 'GG'], rating: 4.8, reviews: 142, shape: SHAPES.dress, shapeColor: '#8b6f47', badge: { label: 'Novo', type: 'new' }, categoria: 'Vestidos', marca: 'Farm Rio', stock: 15, active: true },
  { name: 'Blusa Cropped Off-shoulder', brand: 'Animale', price: 'R$ 199,90', originalPrice: 'R$ 289,90', installments: '4x R$ 49,97', color: '#d4c8bc', color2: '#c0b0a0', colorOptions: ['#faf8f5', '#c0714a', '#4a6080'], sizes: ['PP', 'P', 'M', 'G'], rating: 4.5, reviews: 87, shape: SHAPES.blouse, shapeColor: '#c0714a', badge: { label: '-31%', type: 'sale' }, categoria: 'Blusas', marca: 'Animale', stock: 20, active: true },
  { name: 'Calça Wide Leg Alfaiataria', brand: 'Shoulder', price: 'R$ 549,90', originalPrice: null, installments: '10x R$ 54,99', color: '#c4bdb5', color2: '#b0a898', colorOptions: ['#1a1410', '#8a8278', '#4a6080', '#5a7a5a'], sizes: ['34', '36', '38', '40', '42'], rating: 5, reviews: 203, shape: SHAPES.pants, shapeColor: '#3d2f1e', badge: null, categoria: 'Calças', marca: 'Shoulder', stock: 8, active: true },
  { name: 'Saia Midi Plissada', brand: 'Forum', price: 'R$ 279,90', originalPrice: 'R$ 399,90', installments: '5x R$ 55,98', color: '#d8cfc6', color2: '#c4b8ac', colorOptions: ['#c9938a', '#7a2a35', '#8b6f47'], sizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'], rating: 4.7, reviews: 95, shape: SHAPES.skirt, shapeColor: '#7a2a35', badge: { label: 'Sale', type: 'sale' }, categoria: 'Saias', marca: 'Forum', stock: 12, active: true },
  { name: 'Vestido Longo Decote V', brand: 'PatBo', price: 'R$ 1.290,00', originalPrice: null, installments: '10x R$ 129,00', color: '#1a1410', color2: '#2d241c', colorOptions: ['#1a1410', '#7a2a35'], sizes: ['P', 'M', 'G'], rating: 4.9, reviews: 61, shape: SHAPES.dress, shapeColor: '#d4b896', badge: { label: 'Exclusivo', type: 'exclusive' }, categoria: 'Vestidos', marca: 'PatBo', stock: 5, active: true },
  { name: 'Blusa Tricot Texturizada', brand: 'Lenny Niemeyer', price: 'R$ 329,90', originalPrice: null, installments: '6x R$ 54,98', color: '#e0d5c8', color2: '#ccc0b0', colorOptions: ['#d4b896', '#faf8f5', '#8a8278', '#5a7a5a', '#c0714a'], sizes: ['PP', 'P', 'M', 'G', 'GG'], rating: 4.6, reviews: 118, shape: SHAPES.blouse, shapeColor: '#8b6f47', badge: null, categoria: 'Blusas', marca: 'Lenny Niemeyer', stock: 18, active: true },
  { name: 'Conjunto Saia + Top', brand: 'Farm Rio', price: 'R$ 459,80', originalPrice: 'R$ 618,00', installments: '8x R$ 57,47', color: '#c8b89e', color2: '#b4a48a', colorOptions: ['#c0714a', '#8b6f47', '#1a1410'], sizes: ['PP', 'P', 'M', 'G'], rating: 4.4, reviews: 74, shape: SHAPES.skirt, shapeColor: '#c0714a', badge: { label: '-25%', type: 'sale' }, categoria: 'Saias', marca: 'Farm Rio', stock: 9, active: true },
  { name: 'Calça Jeans Wide Cropped', brand: 'Animale', price: 'R$ 399,90', originalPrice: null, installments: '7x R$ 57,12', color: '#7a8898', color2: '#6a7888', colorOptions: ['#4a6080', '#1a1410'], sizes: ['34', '36', '38', '40', '42', '44'], rating: 4.7, reviews: 156, shape: SHAPES.pants, shapeColor: '#faf8f5', badge: { label: 'Mais vendido', type: 'best' }, categoria: 'Calças', marca: 'Animale', stock: 22, active: true },
  { name: 'Vestido Midi Assimétrico', brand: 'Shoulder', price: 'R$ 689,90', originalPrice: 'R$ 890,00', installments: '10x R$ 68,99', color: '#8a7a6a', color2: '#7a6a5a', colorOptions: ['#8a8278', '#1a1410', '#7a2a35'], sizes: ['P', 'M', 'G', 'GG'], rating: 4.8, reviews: 88, shape: SHAPES.dress, shapeColor: '#e0d5c8', badge: { label: '-22%', type: 'sale' }, categoria: 'Vestidos', marca: 'Shoulder', stock: 7, active: true },
  { name: 'Macacão Linho Relaxed', brand: 'Forum', price: 'R$ 499,90', originalPrice: null, installments: '9x R$ 55,54', color: '#d0c8b8', color2: '#bcb4a4', colorOptions: ['#d4b896', '#5a7a5a', '#1a1410'], sizes: ['PP', 'P', 'M', 'G'], rating: 4.6, reviews: 42, shape: SHAPES.pants, shapeColor: '#8b6f47', badge: { label: 'Novo', type: 'new' }, categoria: 'Macacões', marca: 'Forum', stock: 11, active: true },
  { name: 'Blusa Seda Decote Profundo', brand: 'PatBo', price: 'R$ 289,90', originalPrice: 'R$ 420,00', installments: '5x R$ 57,98', color: '#c0b0a0', color2: '#ac9c8c', colorOptions: ['#faf8f5', '#c9938a', '#4a6080', '#1a1410'], sizes: ['PP', 'P', 'M'], rating: 4.9, reviews: 203, shape: SHAPES.blouse, shapeColor: '#7a2a35', badge: { label: '-31%', type: 'sale' }, categoria: 'Blusas', marca: 'PatBo', stock: 6, active: true },
  { name: 'Vestido Ombro a Ombro', brand: 'Lenny Niemeyer', price: 'R$ 759,00', originalPrice: null, installments: '10x R$ 75,90', color: '#e8e0d4', color2: '#d4ccc0', colorOptions: ['#faf8f5', '#d4b896'], sizes: ['P', 'M', 'G', 'GG'], rating: 5, reviews: 37, shape: SHAPES.dress, shapeColor: '#c9938a', badge: { label: 'Exclusivo', type: 'exclusive' }, categoria: 'Vestidos', marca: 'Lenny Niemeyer', stock: 4, active: true },
]

const DEFAULT_USERS: Omit<User, 'id'>[] = [
  { name: 'Elizabeth Domingues', email: 'eliza@example.com', phone: '(11) 99999-9999', role: 'Administrador', date: '17/05/2026', password: 'admin', status: 'Ativo' },
  { name: 'Ana Silva', email: 'ana@example.com', phone: '(11) 98888-8888', role: 'Cliente', date: '16/05/2026', password: null, status: 'Ativo' },
  { name: 'Carlos Santos', email: 'carlos@example.com', phone: '(21) 97777-7777', role: 'Cliente', date: '15/05/2026', password: null, status: 'Ativo' },
]

// ── localStorage HELPERS ────────────────────────────────────────────────────
const LS_PRODUCTS = 'aure_products'
const LS_USERS = 'aure_users'

function lsGetProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LS_PRODUCTS)
    if (raw) return JSON.parse(raw)
  } catch { }
  // Seed com dados padrão na primeira visita
  const seeded = DEFAULT_PRODUCTS.map((p, i) => ({ id: i + 1, ...p }))
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(seeded))
  return seeded
}

function lsGetUsers(): User[] {
  try {
    const raw = localStorage.getItem(LS_USERS)
    if (raw) return JSON.parse(raw)
  } catch { }
  const seeded = DEFAULT_USERS.map((u, i) => ({ id: i + 1, ...u }))
  localStorage.setItem(LS_USERS, JSON.stringify(seeded))
  return seeded
}

function lsSaveProducts(data: Product[]) {
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(data))
}

function lsSaveUsers(data: User[]) {
  localStorage.setItem(LS_USERS, JSON.stringify(data))
}

function lsNextId(items: { id: number }[]): number {
  return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
}

// ── ESTADO REATIVO ──────────────────────────────────────────────────────────
export const products = ref<Product[]>([])
export const users = ref<User[]>([])

// ── CARRINHO ────────────────────────────────────────────────────────────────
export const cartItems = ref<CartItem[]>([])

export function addToCart(product: any, size: string) {
  const newItem: CartItem = {
    id: cartItems.value.length ? Math.max(...cartItems.value.map(i => i.id)) + 1 : 1,
    productId: product.id,
    name: product.name,
    size,
    price: product.price,
    color: product.color || '#d4b896',
  }
  cartItems.value.push(newItem)
}

export function removeFromCart(id: number) {
  cartItems.value = cartItems.value.filter(i => i.id !== id)
}

export function clearCart() {
  cartItems.value = []
}

// ── ROTEAMENTO ──────────────────────────────────────────────────────────────
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

// ── AUTH ─────────────────────────────────────────────────────────────────────
const getStoredUser = (): User | null => {
  try {
    const saved = localStorage.getItem('aure_admin_user')
    return saved ? JSON.parse(saved) : null
  } catch { return null }
}

export const currentUser = ref<User | null>(getStoredUser())

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  // Modo API
  if (!USE_LOCAL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        const user = await res.json()
        currentUser.value = user
        localStorage.setItem('aure_admin_user', JSON.stringify(user))
        return { success: true }
      }
      const errData = await res.json().catch(() => ({}))
      return { success: false, error: errData.error || 'Credenciais inválidas.' }
    } catch (error) {
      console.error('Erro na requisição de login do administrador:', error)
      return { success: false, error: 'Erro de conexão com o servidor.' }
    }
  }

  // Modo localStorage
  const allUsers = lsGetUsers()
  const found = allUsers.find(u => u.email === email && u.password === password && u.role === 'Administrador')
  if (found) {
    currentUser.value = found
    localStorage.setItem('aure_admin_user', JSON.stringify(found))
    return { success: true }
  }
  return { success: false, error: 'Credenciais inválidas.' }
}

export function logoutAdmin() {
  currentUser.value = null
  localStorage.removeItem('aure_admin_user')
  navigateTo('#/')
}

// ── PRODUTOS ─────────────────────────────────────────────────────────────────
export async function fetchProducts() {
  if (USE_LOCAL) {
    products.value = lsGetProducts()
    return
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`)
    if (res.ok) products.value = await res.json()
    else console.error('Failed to fetch products from backend API database')
  } catch (error) {
    console.error('Network error fetching products from database API:', error)
  }
}

export async function addProduct(payload: Omit<Product, 'id'>) {
  if (USE_LOCAL) {
    const all = lsGetProducts()
    const newProduct = { id: lsNextId(all), ...payload }
    all.unshift(newProduct)
    lsSaveProducts(all)
    products.value = all
    return newProduct
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const newProduct = await res.json()
      products.value.unshift(newProduct)
      return newProduct
    }
  } catch (error) { console.error('Error adding product to database:', error) }
}

export async function updateProduct(id: number, payload: Omit<Product, 'id'>) {
  if (USE_LOCAL) {
    const all = lsGetProducts()
    const idx = all.findIndex(p => p.id === id)
    if (idx !== -1) {
      all[idx] = { id, ...payload }
      lsSaveProducts(all)
      products.value = all
      return all[idx]
    }
    return null
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const updated = await res.json()
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) products.value[index] = updated
      return updated
    }
  } catch (error) { console.error('Error updating product in database:', error) }
}

export async function deleteProduct(id: number) {
  if (USE_LOCAL) {
    const all = lsGetProducts().filter(p => p.id !== id)
    lsSaveProducts(all)
    products.value = all
    return true
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      products.value = products.value.filter(p => p.id !== id)
      return true
    }
  } catch (error) { console.error('Error deleting product from database:', error) }
  return false
}

export async function decreaseProductsStock(productIds: number[]) {
  if (USE_LOCAL) {
    const all = lsGetProducts()
    productIds.forEach(pid => {
      const p = all.find(x => x.id === pid)
      if (p && p.stock && p.stock > 0) p.stock -= 1
    })
    lsSaveProducts(all)
    products.value = all
    return true
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/decrease-stock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds }),
    })
    if (res.ok) { await fetchProducts(); return true }
  } catch (e) { console.error('Error calling decrease-stock endpoint:', e) }
  return false
}

// ── USUÁRIOS ──────────────────────────────────────────────────────────────────
export async function fetchUsers() {
  if (USE_LOCAL) {
    users.value = lsGetUsers()
    return
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/users`)
    if (res.ok) users.value = await res.json()
  } catch (error) { console.error('Network error fetching users from database:', error) }
}

export async function addUser(payload: Omit<User, 'id' | 'date'>) {
  if (USE_LOCAL) {
    const all = lsGetUsers()
    const newUser: User = {
      id: lsNextId(all),
      date: new Date().toLocaleDateString('pt-BR'),
      ...payload,
    }
    all.unshift(newUser)
    lsSaveUsers(all)
    users.value = all
    currentUser.value = newUser
    return newUser
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const newUser = await res.json()
      users.value.unshift(newUser)
      currentUser.value = newUser
      return newUser
    }
  } catch (error) { console.error('Error adding user to database:', error) }
}

export async function updateUser(id: number, payload: Partial<Omit<User, 'id' | 'date'>>) {
  if (USE_LOCAL) {
    const all = lsGetUsers()
    const idx = all.findIndex(u => u.id === id)
    if (idx === -1) return null

    const updated: User = { ...all[idx], ...payload }
    all[idx] = updated
    lsSaveUsers(all)
    users.value = [...all] // novo array para forçar reatividade Vue

    if (currentUser.value?.id === id) {
      if (updated.status === 'Inativo') {
        currentUser.value = null
        localStorage.removeItem('aure_admin_user')
      } else {
        currentUser.value = updated
        localStorage.setItem('aure_admin_user', JSON.stringify(updated))
      }
    }
    return updated
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const updatedUser = await res.json()
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) users.value[index] = updatedUser
      if (currentUser.value && currentUser.value.id === id) {
        if (updatedUser.status === 'Inativo') {
          currentUser.value = null
          localStorage.removeItem('aure_admin_user')
        } else {
          currentUser.value = updatedUser
          localStorage.setItem('aure_admin_user', JSON.stringify(updatedUser))
        }
      }
      return updatedUser
    }
  } catch (error) { console.error('Error updating user in database:', error) }
  return null
}


export async function deleteUser(id: number) {
  if (USE_LOCAL) {
    const all = lsGetUsers().filter(u => u.id !== id)
    lsSaveUsers(all)
    users.value = all
    if (currentUser.value?.id === id) currentUser.value = null
    return true
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/${id}`, { method: 'DELETE' })
    if (res.ok) {
      users.value = users.value.filter(u => u.id !== id)
      if (currentUser.value && currentUser.value.id === id) currentUser.value = null
      return true
    }
  } catch (error) { console.error('Error deleting user from database:', error) }
  return false
}

// ── BOOT ──────────────────────────────────────────────────────────────────────
fetchProducts()
fetchUsers()
