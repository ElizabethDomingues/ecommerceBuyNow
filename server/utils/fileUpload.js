import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads')

export function saveBase64Image(base64Str) {
  if (!base64Str || !base64Str.startsWith('data:image/')) {
    return base64Str // Return as-is if it's already a URL, path, or empty
  }

  // Ensure uploads directory exists
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  }

  // Extract base64 content and mime type
  const matches = base64Str.match(/^data:image\/([a-zA-Z0-9+-]+);base64,(.+)$/)
  if (!matches || matches.length !== 3) {
    return base64Str
  }

  const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
  const data = matches[2]
  const buffer = Buffer.from(data, 'base64')

  const filename = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`
  const filepath = path.join(UPLOADS_DIR, filename)

  fs.writeFileSync(filepath, buffer)
  return `/uploads/${filename}`
}
