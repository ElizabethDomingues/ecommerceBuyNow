import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { initDatabase } from './server/config/database.js'
import productRoutes from './server/routes/productRoutes.js'
import userRoutes from './server/routes/userRoutes.js'
import authRoutes from './server/routes/authRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,        // URL do Netlify (definida no painel do Render)
  'http://localhost:5173',          // Vite dev server
  'http://localhost:4173',          // Vite preview
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Permite requests sem origin (ex: Postman, curl) e origins permitidas
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS bloqueado para origin: ${origin}`))
    }
  },
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.get('/uploads/:filename', (req, res) => {
  const filepath = path.join(__dirname, 'uploads', req.params.filename)
  res.sendFile(filepath)
})

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/admin', authRoutes)

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`◈ AURÊ Database API is running on http://localhost:${PORT}`)
  })
})
