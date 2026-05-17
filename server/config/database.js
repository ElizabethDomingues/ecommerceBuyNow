import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise'
import { defaultProducts, defaultUsers } from '../data/defaultData.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const DB_JSON_PATH = path.join(__dirname, '..', '..', 'src', 'database.json')

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aure_db'
}

export let mysqlPool = null
export let useJsonFallback = false

export function setJsonFallback(value) {
  useJsonFallback = value
}

export async function initDatabase() {
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
      marca VARCHAR(100) NOT NULL,
      image LONGTEXT,
      description TEXT,
      stock INT DEFAULT 10,
      active TINYINT(1) DEFAULT 1
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
      password VARCHAR(255) DEFAULT NULL,
      favorites TEXT,
      status VARCHAR(50) DEFAULT 'Ativo'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `

  await mysqlPool.query(queryProducts)
  await mysqlPool.query(queryUsers)
  try { await mysqlPool.query('ALTER TABLE users ADD COLUMN favorites TEXT') } catch (e) {}
  try { await mysqlPool.query('ALTER TABLE users ADD COLUMN password VARCHAR(255) DEFAULT NULL') } catch (e) {}
  try { await mysqlPool.query("ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'Ativo'") } catch (e) {}
  try { await mysqlPool.query('ALTER TABLE products ADD COLUMN image LONGTEXT') } catch (e) {}
  try { await mysqlPool.query('ALTER TABLE products ADD COLUMN description TEXT') } catch (e) {}
  try { await mysqlPool.query('ALTER TABLE products ADD COLUMN stock INT DEFAULT 10') } catch (e) {}
  try { await mysqlPool.query('ALTER TABLE products ADD COLUMN active TINYINT(1) DEFAULT 1') } catch (e) {}
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
          JSON.stringify(p.sizes || []),
          JSON.stringify(p.colorOptions || []),
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
        `INSERT INTO users (name, email, phone, role, date, password, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [u.name, u.email, u.phone, u.role, u.date, u.password || null, u.status || 'Ativo']
      )
    }
  } else {
    try {
      await mysqlPool.query(
        `UPDATE users SET password = ? WHERE email = ? AND (password IS NULL OR password = '')`,
        ['admin', 'eliza@example.com']
      )
      await mysqlPool.query(
        `UPDATE users SET status = 'Ativo' WHERE status IS NULL OR status = ''`
      )
    } catch (err) {
      console.error('Falha ao migrar senha do admin no MySQL:', err)
    }
  }
}

function initJsonDatabase() {
  if (!fs.existsSync(DB_JSON_PATH)) {
    const seededData = { products: defaultProducts.map((p, i) => ({ id: i + 1, ...p })), users: defaultUsers.map((u, i) => ({ id: i + 1, ...u })) }
    fs.writeFileSync(DB_JSON_PATH, JSON.stringify(seededData, null, 2), 'utf-8')
  } else {
    try {
      const data = loadJsonData()
      let updated = false
      data.users = data.users.map(u => {
        if (u.email === 'eliza@example.com' && !u.password) {
          u.password = 'admin'
          updated = true
        }
        if (!u.status) {
          u.status = 'Ativo'
          updated = true
        }
        return u
      })
      if (updated) {
        saveJsonData(data)
        console.log('✔ Migração JSON: Senha e status atualizados.')
      }
    } catch (err) {
      console.error('Falha ao migrar JSON database:', err)
    }
  }
}

export function loadJsonData() {
  const raw = fs.readFileSync(DB_JSON_PATH, 'utf-8')
  return JSON.parse(raw)
}

export function saveJsonData(data) {
  fs.writeFileSync(DB_JSON_PATH, JSON.stringify(data, null, 2), 'utf-8')
}
