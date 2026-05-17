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

const corsOptions = {
  origin: [
    'https://ecommerceaure.netlify.app',   // produção no Netlify
    process.env.FRONTEND_URL,              // variável do painel do Render (fallback)
    'http://localhost:5173',               // Vite dev server
    'http://localhost:4173',               // Vite preview
    'http://localhost:3000',               // local
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

app.use(cors(corsOptions))
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
