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
        sizes: r.sizes ? JSON.parse(r.sizes) : [],
        colorOptions: r.colorOptions ? JSON.parse(r.colorOptions) : [],
        stock: r.stock !== null && r.stock !== undefined ? parseInt(r.stock) : 10,
        active: r.active === 1 || r.active === true
      }))
      return res.json(formatted)
    } catch (e) {
      console.error('MySQL Fetch Products Error, falling back to JSON:', e)
    }
  }

  const db = loadJsonData()
  const formatted = db.products.map(p => ({
    ...p,
    stock: p.stock !== null && p.stock !== undefined ? parseInt(p.stock) : 10,
    active: p.active !== false && p.active !== 0
  }))
  res.json(formatted)
}

export async function addProduct(req, res) {
  const p = req.body
  const savedImagePath = saveBase64Image(p.image)
  const productData = { ...p, image: savedImagePath }

  if (!useJsonFallback) {
    try {
      const [result] = await mysqlPool.query(
        `INSERT INTO products (name, brand, price, originalPrice, installments, color, color2, shape, shapeColor, badge, sizes, colorOptions, rating, reviews, categoria, marca, image, description, stock, active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productData.name, productData.brand, productData.price, productData.originalPrice, productData.installments, productData.color, productData.color2, productData.shape, productData.shapeColor,
          productData.badge ? JSON.stringify(productData.badge) : null,
          JSON.stringify(productData.sizes || []),
          JSON.stringify(productData.colorOptions || []),
          productData.rating || 5.0, productData.reviews || 1, productData.categoria, productData.marca,
          productData.image || null,
          productData.description || "",
          productData.stock !== undefined ? parseInt(productData.stock) : 10,
          productData.active !== undefined ? (productData.active ? 1 : 0) : 1
        ]
      )
      const newProd = { id: result.insertId, ...productData, active: productData.active !== false && productData.active !== 0 }
      return res.status(201).json(newProd)
    } catch (e) {
      console.error('MySQL Insert Product Error, falling back to JSON:', e)
    }
  }

  const db = loadJsonData()
  const newProduct = {
    id: db.products.length ? Math.max(...db.products.map(p => p.id)) + 1 : 1,
    ...productData,
    stock: productData.stock !== undefined ? parseInt(productData.stock) : 10,
    active: productData.active !== undefined ? !!productData.active : true,
    description: productData.description || ""
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
        `UPDATE products SET name=?, brand=?, price=?, originalPrice=?, installments=?, color=?, color2=?, shape=?, shapeColor=?, badge=?, sizes=?, colorOptions=?, categoria=?, marca=?, image=?, description=?, stock=?, active=? 
         WHERE id=?`,
        [
          productData.name, productData.brand, productData.price, productData.originalPrice, productData.installments, productData.color, productData.color2, productData.shape, productData.shapeColor,
          productData.badge ? JSON.stringify(productData.badge) : null,
          JSON.stringify(productData.sizes || []),
          JSON.stringify(productData.colorOptions || []),
          productData.categoria, productData.marca,
          productData.image || null,
          productData.description || "",
          productData.stock !== undefined ? parseInt(productData.stock) : 10,
          productData.active !== undefined ? (productData.active ? 1 : 0) : 1,
          id
        ]
      )
      const updated = { id, ...productData, active: productData.active !== false && productData.active !== 0 }
      return res.json(updated)
    } catch (e) {
      console.error('MySQL Update Product Error, falling back to JSON:', e)
    }
  }

  const db = loadJsonData()
  const index = db.products.findIndex(p => p.id === id)
  if (index !== -1) {
    db.products[index] = { 
      ...db.products[index], 
      ...productData, 
      id,
      stock: productData.stock !== undefined ? parseInt(productData.stock) : 10,
      active: productData.active !== undefined ? !!productData.active : true,
      description: productData.description || ""
    }
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

export async function decreaseStock(req, res) {
  const { productIds } = req.body
  console.log('◈ Backend decreaseStock received productIds:', productIds)
  if (!Array.isArray(productIds)) {
    return res.status(400).json({ error: 'productIds must be an array' })
  }

  if (!useJsonFallback) {
    try {
      for (const id of productIds) {
        await mysqlPool.query(
          'UPDATE products SET stock = GREATEST(0, stock - 1) WHERE id = ?',
          [id]
        )
      }
      return res.json({ success: true })
    } catch (e) {
      console.error('MySQL Decrease Stock Error, falling back to JSON:', e)
    }
  }

  const db = loadJsonData()
  for (const id of productIds) {
    const index = db.products.findIndex(p => p.id === id)
    if (index !== -1) {
      const currentStock = db.products[index].stock !== undefined ? parseInt(db.products[index].stock) : 10
      db.products[index].stock = Math.max(0, currentStock - 1)
    }
  }
  saveJsonData(db)
  res.json({ success: true })
}

