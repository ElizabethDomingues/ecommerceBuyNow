import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000
const DB_JSON_PATH = path.join(__dirname, 'src', 'database.json')

app.use(cors())
app.use(express.json())


const SHAPES = {
  dress: 'M40 10 Q60 5 80 10 L90 60 Q85 120 60 170 Q35 120 30 60 Z',
  blouse: 'M25 20 Q60 10 95 20 L100 80 Q80 90 60 88 Q40 90 20 80 Z',
  pants: 'M35 10 L55 10 L65 170 L45 170 Z M65 10 L85 10 L75 170 L55 170 Z',
  skirt: 'M30 10 Q60 5 90 10 L100 80 Q80 150 60 160 Q40 150 20 80 Z',
}

const defaultUsers = [
  { name: 'Elizabeth Domingues', email: 'eliza@example.com', phone: '(11) 99999-9999', role: 'Administrador', date: '17/05/2026' },
  { name: 'Ana Silva', email: 'ana@example.com', phone: '(11) 98888-8888', role: 'Cliente', date: '16/05/2026' },
  { name: 'Carlos Santos', email: 'carlos@example.com', phone: '(21) 97777-7777', role: 'Cliente', date: '15/05/2026' }
]

const defaultProducts = [
  {
    name: 'Vestido Midi Floral Recorte',
    brand: 'Farm Rio',
    price: 'R$ 389,90',
    originalPrice: null,
    installments: '6x R$ 64,98',
    color: '#e8ddd0',
    color2: '#d4c4b0',
    colorOptions: ['#1a1410', '#d4b896', '#c9938a'],
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    rating: 4.8,
    reviews: 142,
    shape: SHAPES.dress,
    shapeColor: '#8b6f47',
    badge: { label: 'Novo', type: 'new' },
    categoria: 'Vestidos',
    marca: 'Farm Rio'
  },
  {
    name: 'Blusa Cropped Off-shoulder',
    brand: 'Animale',
    price: 'R$ 199,90',
    originalPrice: 'R$ 289,90',
    installments: '4x R$ 49,97',
    color: '#d4c8bc',
    color2: '#c0b0a0',
    colorOptions: ['#faf8f5', '#c0714a', '#4a6080'],
    sizes: ['PP', 'P', 'M', 'G'],
    rating: 4.5,
    reviews: 87,
    shape: SHAPES.blouse,
    shapeColor: '#c0714a',
    badge: { label: '-31%', type: 'sale' },
    categoria: 'Blusas',
    marca: 'Animale'
  },
  {
    name: 'Calça Wide Leg Alfaiataria',
    brand: 'Shoulder',
    price: 'R$ 549,90',
    originalPrice: null,
    installments: '10x R$ 54,99',
    color: '#c4bdb5',
    color2: '#b0a898',
    colorOptions: ['#1a1410', '#8a8278', '#4a6080', '#5a7a5a'],
    sizes: ['34', '36', '38', '40', '42'],
    rating: 5,
    reviews: 203,
    shape: SHAPES.pants,
    shapeColor: '#3d2f1e',
    badge: null,
    categoria: 'Calças',
    marca: 'Shoulder'
  },
  {
    name: 'Saia Midi Plissada',
    brand: 'Forum',
    price: 'R$ 279,90',
    originalPrice: 'R$ 399,90',
    installments: '5x R$ 55,98',
    color: '#d8cfc6',
    color2: '#c4b8ac',
    colorOptions: ['#c9938a', '#7a2a35', '#8b6f47'],
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'],
    rating: 4.7,
    reviews: 95,
    shape: SHAPES.skirt,
    shapeColor: '#7a2a35',
    badge: { label: 'Sale', type: 'sale' },
    categoria: 'Saias',
    marca: 'Forum'
  },
  {
    name: 'Vestido Longo Decote V',
    brand: 'PatBo',
    price: 'R$ 1.290,00',
    originalPrice: null,
    installments: '10x R$ 129,00',
    color: '#1a1410',
    color2: '#2d241c',
    colorOptions: ['#1a1410', '#7a2a35'],
    sizes: ['P', 'M', 'G'],
    rating: 4.9,
    reviews: 61,
    shape: SHAPES.dress,
    shapeColor: '#d4b896',
    badge: { label: 'Exclusivo', type: 'exclusive' },
    categoria: 'Vestidos',
    marca: 'PatBo'
  },
  {
    name: 'Blusa Tricot Texturizada',
    brand: 'Lenny Niemeyer',
    price: 'R$ 329,90',
    originalPrice: null,
    installments: '6x R$ 54,98',
    color: '#e0d5c8',
    color2: '#ccc0b0',
    colorOptions: ['#d4b896', '#faf8f5', '#8a8278', '#5a7a5a', '#c0714a'],
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    rating: 4.6,
    reviews: 118,
    shape: SHAPES.blouse,
    shapeColor: '#8b6f47',
    badge: null,
    categoria: 'Blusas',
    marca: 'Lenny Niemeyer'
  },
  {
    name: 'Conjunto Saia + Top',
    brand: 'Farm Rio',
    price: 'R$ 459,80',
    originalPrice: 'R$ 618,00',
    installments: '8x R$ 57,47',
    color: '#c8b89e',
    color2: '#b4a48a',
    colorOptions: ['#c0714a', '#8b6f47', '#1a1410'],
    sizes: ['PP', 'P', 'M', 'G'],
    rating: 4.4,
    reviews: 74,
    shape: SHAPES.skirt,
    shapeColor: '#c0714a',
    badge: { label: '-25%', type: 'sale' },
    categoria: 'Saias',
    marca: 'Farm Rio'
  },
  {
    name: 'Calça Jeans Wide Cropped',
    brand: 'Animale',
    price: 'R$ 399,90',
    originalPrice: null,
    installments: '7x R$ 57,12',
    color: '#7a8898',
    color2: '#6a7888',
    colorOptions: ['#4a6080', '#1a1410'],
    sizes: ['34', '36', '38', '40', '42', '44'],
    rating: 4.7,
    reviews: 156,
    shape: SHAPES.pants,
    shapeColor: '#faf8f5',
    badge: { label: 'Mais vendido', type: 'best' },
    categoria: 'Calças',
    marca: 'Animale'
  },
  {
    name: 'Vestido Midi Assimétrico',
    brand: 'Shoulder',
    price: 'R$ 689,90',
    originalPrice: 'R$ 890,00',
    installments: '10x R$ 68,99',
    color: '#8a7a6a',
    color2: '#7a6a5a',
    colorOptions: ['#8a8278', '#1a1410', '#7a2a35'],
    sizes: ['P', 'M', 'G', 'GG'],
    rating: 4.8,
    reviews: 88,
    shape: SHAPES.dress,
    shapeColor: '#e0d5c8',
    badge: { label: '-22%', type: 'sale' },
    categoria: 'Vestidos',
    marca: 'Shoulder'
  },
  {
    name: 'Macacão Linho Relaxed',
    brand: 'Forum',
    price: 'R$ 499,90',
    originalPrice: null,
    installments: '9x R$ 55,54',
    color: '#d0c8b8',
    color2: '#bcb4a4',
    colorOptions: ['#d4b896', '#5a7a5a', '#1a1410'],
    sizes: ['PP', 'P', 'M', 'G'],
    rating: 4.6,
    reviews: 42,
    shape: SHAPES.pants,
    shapeColor: '#8b6f47',
    badge: { label: 'Novo', type: 'new' },
    categoria: 'Macacões',
    marca: 'Forum'
  },
  {
    name: 'Blusa Seda Decote Profundo',
    brand: 'PatBo',
    price: 'R$ 289,90',
    originalPrice: 'R$ 420,00',
    installments: '5x R$ 57,98',
    color: '#c0b0a0',
    color2: '#ac9c8c',
    colorOptions: ['#faf8f5', '#c9938a', '#4a6080', '#1a1410'],
    sizes: ['PP', 'P', 'M'],
    rating: 4.9,
    reviews: 203,
    shape: SHAPES.blouse,
    shapeColor: '#7a2a35',
    badge: { label: '-31%', type: 'sale' },
    categoria: 'Blusas',
    marca: 'PatBo'
  },
  {
    name: 'Vestido Ombro a Ombro',
    brand: 'Lenny Niemeyer',
    price: 'R$ 759,00',
    originalPrice: null,
    installments: '10x R$ 75,90',
    color: '#e8e0d4',
    color2: '#d4ccc0',
    colorOptions: ['#faf8f5', '#d4b896'],
    sizes: ['P', 'M', 'G', 'GG'],
    rating: 5,
    reviews: 37,
    shape: SHAPES.dress,
    shapeColor: '#c9938a',
    badge: { label: 'Exclusivo', type: 'exclusive' },
    categoria: 'Vestidos',
    marca: 'Lenny Niemeyer'
  },
]


const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aure_db'
}

let mysqlPool = null
let useJsonFallback = false

async function initDatabase() {
  try {
    mysqlPool = mysql.createPool(dbConfig)

    const connection = await mysqlPool.getConnection()
    console.log(`\n✔ Conectado ao banco de dados MySQL no phpMyAdmin com sucesso!`)
    connection.release()

    await createMysqlTables()

    await seedMysqlData()

  } catch (error) {
    console.error(`\n======================================================================`)
    console.error(`⚠ ATENÇÃO: Falha ao conectar ao MySQL (phpMyAdmin) local!`)
    console.error(`Erro original: ${error.message}`)
    console.error(`----------------------------------------------------------------------`)
    console.error(`Para usar o MySQL:`)
    console.error(`1. Inicie o MySQL no painel do XAMPP / WampServer.`)
    console.error(`2. Acesse http://localhost/phpmyadmin/`)
    console.error(`3. Crie um banco de dados vazio chamado: "${dbConfig.database}"`)
    console.error(`4. Reinicie o servidor para carregar no MySQL automaticamente.`)
    console.error(`----------------------------------------------------------------------`)
    console.error(`💡 MODO SEGURO: Usando o banco de dados local "database.json" temporariamente.`)
    console.error(`======================================================================\n`)

    useJsonFallback = true
    initJsonDatabase()
  }
}


async function createMysqlTables() {
  const queryProducts = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      brand VARCHAR(255) NOT NULL,
      price VARCHAR(50) NOT NULL,
      originalPrice VARCHAR(50),
      installments VARCHAR(100),
      color VARCHAR(50) NOT NULL,
      color2 VARCHAR(50) NOT NULL,
      shape TEXT NOT NULL,
      shapeColor VARCHAR(50) NOT NULL,
      badge TEXT,
      sizes TEXT NOT NULL,
      colorOptions TEXT NOT NULL,
      rating FLOAT DEFAULT 5.0,
      reviews INT DEFAULT 0,
      categoria VARCHAR(100) NOT NULL,
      marca VARCHAR(100) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `

  const queryUsers = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(50),
      role VARCHAR(50) DEFAULT 'Cliente',
      date VARCHAR(50) NOT NULL,
      favorites TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `

  await mysqlPool.query(queryProducts)
  await mysqlPool.query(queryUsers)
  try {
    await mysqlPool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS favorites TEXT')
  } catch (e) {
  }
}

async function seedMysqlData() {
  const [[{ count: pCount }]] = await mysqlPool.query('SELECT COUNT(*) as count FROM products')
  if (pCount === 0) {
    console.log('🌱 Populando tabela "products" com catálogo padrão no MySQL...')
    for (const p of defaultProducts) {
      await mysqlPool.query(
        `INSERT INTO products (name, brand, price, originalPrice, installments, color, color2, shape, shapeColor, badge, sizes, colorOptions, rating, reviews, categoria, marca) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.name, p.brand, p.price, p.originalPrice, p.installments, p.color, p.color2, p.shape, p.shapeColor,
          p.badge ? JSON.stringify(p.badge) : null,
          JSON.stringify(p.sizes),
          JSON.stringify(p.colorOptions),
          p.rating, p.reviews, p.categoria, p.marca
        ]
      )
    }
  }

  const [[{ count: uCount }]] = await mysqlPool.query('SELECT COUNT(*) as count FROM users')
  if (uCount === 0) {
    console.log('🌱 Populando tabela "users" com administradores padrão no MySQL...')
    for (const u of defaultUsers) {
      await mysqlPool.query(
        `INSERT INTO users (name, email, phone, role, date) VALUES (?, ?, ?, ?, ?)`,
        [u.name, u.email, u.phone, u.role, u.date]
      )
    }
  }
}


function initJsonDatabase() {
  if (!fs.existsSync(DB_JSON_PATH)) {
    const seededData = { products: defaultProducts.map((p, i) => ({ id: i + 1, ...p })), users: defaultUsers.map((u, i) => ({ id: i + 1, ...u })) }
    fs.writeFileSync(DB_JSON_PATH, JSON.stringify(seededData, null, 2), 'utf-8')
  }
}

function loadJsonData() {
  const raw = fs.readFileSync(DB_JSON_PATH, 'utf-8')
  return JSON.parse(raw)
}

function saveJsonData(data) {
  fs.writeFileSync(DB_JSON_PATH, JSON.stringify(data, null, 2), 'utf-8')
}


app.get('/api/products', async (req, res) => {
  if (!useJsonFallback) {
    try {
      const [rows] = await mysqlPool.query('SELECT * FROM products ORDER BY id DESC')
      const formatted = rows.map(r => ({
        ...r,
        badge: r.badge ? JSON.parse(r.badge) : null,
        sizes: JSON.parse(r.sizes),
        colorOptions: JSON.parse(r.colorOptions)
      }))
      return res.json(formatted)
    } catch (e) {
      console.error('MySQL Fetch Products Error, falling back to JSON:', e)
    }
  }

  const db = loadJsonData()
  res.json(db.products)
})

app.post('/api/products', async (req, res) => {
  const p = req.body

  if (!useJsonFallback) {
    try {
      const [result] = await mysqlPool.query(
        `INSERT INTO products (name, brand, price, originalPrice, installments, color, color2, shape, shapeColor, badge, sizes, colorOptions, rating, reviews, categoria, marca) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.name, p.brand, p.price, p.originalPrice, p.installments, p.color, p.color2, p.shape, p.shapeColor,
          p.badge ? JSON.stringify(p.badge) : null,
          JSON.stringify(p.sizes),
          JSON.stringify(p.colorOptions),
          p.rating || 5.0, p.reviews || 1, p.categoria, p.marca
        ]
      )
      const newProd = { id: result.insertId, ...p }
      return res.status(201).json(newProd)
    } catch (e) {
      console.error('MySQL Insert Product Error, falling back to JSON:', e)
    }
  }

  const db = loadJsonData()
  const newProduct = {
    id: db.products.length ? Math.max(...db.products.map(p => p.id)) + 1 : 1,
    ...p
  }
  db.products.unshift(newProduct)
  saveJsonData(db)
  res.status(201).json(newProduct)
})

app.put('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const p = req.body

  if (!useJsonFallback) {
    try {
      await mysqlPool.query(
        `UPDATE products SET name=?, brand=?, price=?, originalPrice=?, installments=?, color=?, color2=?, shape=?, shapeColor=?, badge=?, sizes=?, colorOptions=?, categoria=?, marca=? 
         WHERE id=?`,
        [
          p.name, p.brand, p.price, p.originalPrice, p.installments, p.color, p.color2, p.shape, p.shapeColor,
          p.badge ? JSON.stringify(p.badge) : null,
          JSON.stringify(p.sizes),
          JSON.stringify(p.colorOptions),
          p.categoria, p.marca,
          id
        ]
      )
      const updated = { id, ...p }
      return res.json(updated)
    } catch (e) {
      console.error('MySQL Update Product Error, falling back to JSON:', e)
    }
  }

  const db = loadJsonData()
  const index = db.products.findIndex(p => p.id === id)
  if (index !== -1) {
    db.products[index] = { ...db.products[index], ...p, id }
    saveJsonData(db)
    return res.json(db.products[index])
  }
  res.status(404).json({ error: 'Product not found' })
})

app.delete('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  if (!useJsonFallback) {
    try {
      await mysqlPool.query('DELETE FROM products WHERE id=?', [id])
      return res.status(204).send()
    } catch (e) {
      console.error('MySQL Delete Product Error, falling back to JSON:', e)
    }
  }

  const db = loadJsonData()
  db.products = db.products.filter(p => p.id !== id)
  saveJsonData(db)
  res.status(204).send()
})

// 2. Users API Endpoints

app.get('/api/users', async (req, res) => {
  if (!useJsonFallback) {
    try {
      const [rows] = await mysqlPool.query('SELECT * FROM users ORDER BY id DESC')
      const formatted = rows.map(r => ({
        ...r,
        favorites: r.favorites ? JSON.parse(r.favorites) : []
      }))
      return res.json(formatted)
    } catch (e) {
      console.error('MySQL Fetch Users Error, falling back to JSON:', e)
    }
  }

  const db = loadJsonData()
  const formatted = db.users.map(u => ({ ...u, favorites: u.favorites || [] }))
  res.json(formatted)
})

app.post('/api/users', async (req, res) => {
  const u = req.body
  const dateStr = new Date().toLocaleDateString('pt-BR')
  const favs = u.favorites || []

  if (!useJsonFallback) {
    try {
      const [result] = await mysqlPool.query(
        `INSERT INTO users (name, email, phone, role, date, favorites) VALUES (?, ?, ?, ?, ?, ?)`,
        [u.name, u.email, u.phone, u.role || 'Cliente', dateStr, JSON.stringify(favs)]
      )
      const newUser = { id: result.insertId, ...u, date: dateStr, favorites: favs }
      return res.status(201).json(newUser)
    } catch (e) {
      console.error('MySQL Insert User Error, falling back to JSON:', e)
    }
  }

  const db = loadJsonData()
  const newUser = {
    id: db.users.length ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
    ...u,
    date: dateStr,
    favorites: favs
  }
  db.users.unshift(newUser)
  saveJsonData(db)
  res.status(201).json(newUser)
})

app.delete('/api/users/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  if (!useJsonFallback) {
    try {
      await mysqlPool.query('DELETE FROM users WHERE id=?', [id])
      return res.status(204).send()
    } catch (e) {
      console.error('MySQL Delete User Error, falling back to JSON:', e)
    }
  }

  const db = loadJsonData()
  db.users = db.users.filter(u => u.id !== id)
  saveJsonData(db)
  res.status(204).send()
})

app.put('/api/users/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const u = req.body

  if (!useJsonFallback) {
    try {
      const [[existing]] = await mysqlPool.query('SELECT * FROM users WHERE id=?', [id])
      if (!existing) {
        return res.status(404).json({ error: 'User not found' })
      }

      const name = u.name !== undefined ? u.name : existing.name
      const email = u.email !== undefined ? u.email : existing.email
      const phone = u.phone !== undefined ? u.phone : existing.phone
      const favoritesVal = u.favorites !== undefined ? JSON.stringify(u.favorites) : existing.favorites

      await mysqlPool.query(
        `UPDATE users SET name=?, email=?, phone=?, favorites=? WHERE id=?`,
        [name, email, phone, favoritesVal, id]
      )
      const [[updatedUser]] = await mysqlPool.query('SELECT * FROM users WHERE id=?', [id])
      if (updatedUser) {
        return res.json({
          ...updatedUser,
          favorites: updatedUser.favorites ? JSON.parse(updatedUser.favorites) : []
        })
      }
    } catch (e) {
      console.error('MySQL Update User Error, falling back to JSON:', e)
    }
  }

  const db = loadJsonData()
  const index = db.users.findIndex(user => user.id === id)
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...u, id }
    saveJsonData(db)
    return res.json({
      ...db.users[index],
      favorites: db.users[index].favorites || []
    })
  }
  res.status(404).json({ error: 'User not found' })
})


initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`◈ AURÊ Database API is running on http://localhost:${PORT}`)
  })
})
