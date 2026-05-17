import { mysqlPool, useJsonFallback, loadJsonData, saveJsonData } from '../config/database.js'
import { saveBase64Image } from '../utils/fileUpload.js'

export async function getProducts(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
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
}

export async function addProduct(req, res) {
  const p = req.body
  const savedImagePath = saveBase64Image(p.image)
  const productData = { ...p, image: savedImagePath }

  if (!useJsonFallback) {
    try {
      const [result] = await mysqlPool.query(
        `INSERT INTO products (name, brand, price, originalPrice, installments, color, color2, shape, shapeColor, badge, sizes, colorOptions, rating, reviews, categoria, marca, image) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productData.name, productData.brand, productData.price, productData.originalPrice, productData.installments, productData.color, productData.color2, productData.shape, productData.shapeColor,
          productData.badge ? JSON.stringify(productData.badge) : null,
          JSON.stringify(productData.sizes || []),
          JSON.stringify(productData.colorOptions || []),
          productData.rating || 5.0, productData.reviews || 1, productData.categoria, productData.marca,
          productData.image || null
        ]
      )
      const newProd = { id: result.insertId, ...productData }
      return res.status(201).json(newProd)
    } catch (e) {
      console.error('MySQL Insert Product Error, falling back to JSON:', e)
    }
  }

  const db = loadJsonData()
  const newProduct = {
    id: db.products.length ? Math.max(...db.products.map(p => p.id)) + 1 : 1,
    ...productData
  }
  db.products.unshift(newProduct)
  saveJsonData(db)
  res.status(201).json(newProduct)
}

export async function updateProduct(req, res) {
  const id = parseInt(req.params.id)
  const p = req.body
  const savedImagePath = saveBase64Image(p.image)
  const productData = { ...p, image: savedImagePath }

  if (!useJsonFallback) {
    try {
      await mysqlPool.query(
        `UPDATE products SET name=?, brand=?, price=?, originalPrice=?, installments=?, color=?, color2=?, shape=?, shapeColor=?, badge=?, sizes=?, colorOptions=?, categoria=?, marca=?, image=? 
         WHERE id=?`,
        [
          productData.name, productData.brand, productData.price, productData.originalPrice, productData.installments, productData.color, productData.color2, productData.shape, productData.shapeColor,
          productData.badge ? JSON.stringify(productData.badge) : null,
          JSON.stringify(productData.sizes || []),
          JSON.stringify(productData.colorOptions || []),
          productData.categoria, productData.marca,
          productData.image || null,
          id
        ]
      )
      const updated = { id, ...productData }
      return res.json(updated)
    } catch (e) {
      console.error('MySQL Update Product Error, falling back to JSON:', e)
    }
  }

  const db = loadJsonData()
  const index = db.products.findIndex(p => p.id === id)
  if (index !== -1) {
    db.products[index] = { ...db.products[index], ...productData, id }
    saveJsonData(db)
    return res.json(db.products[index])
  }
  res.status(404).json({ error: 'Product not found' })
}

export async function deleteProduct(req, res) {
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
}
