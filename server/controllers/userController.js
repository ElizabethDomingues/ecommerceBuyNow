import { mysqlPool, useJsonFallback, loadJsonData, saveJsonData } from '../config/database.js'

export async function getUsers(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  if (!useJsonFallback) {
    try {
      const [rows] = await mysqlPool.query('SELECT * FROM users ORDER BY id DESC')
      const formatted = rows.map(r => ({
        ...r,
        favorites: r.favorites ? JSON.parse(r.favorites) : [],
        status: r.status || 'Ativo'
      }))
      return res.json(formatted)
    } catch (e) {
      console.error('MySQL Fetch Users Error, falling back to JSON:', e)
    }
  }

  const db = loadJsonData()
  const formatted = db.users.map(u => ({ ...u, favorites: u.favorites || [], status: u.status || 'Ativo' }))
  res.json(formatted)
}

export async function addUser(req, res) {
  const u = req.body
  const dateStr = new Date().toLocaleDateString('pt-BR')
  const favs = u.favorites || []
  const status = u.status || 'Ativo'

  if (!useJsonFallback) {
    try {
      const [result] = await mysqlPool.query(
        `INSERT INTO users (name, email, phone, role, date, favorites, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [u.name, u.email, u.phone, u.role || 'Cliente', dateStr, JSON.stringify(favs), status]
      )
      const newUser = { id: result.insertId, ...u, date: dateStr, favorites: favs, status }
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
    favorites: favs,
    status
  }
  db.users.unshift(newUser)
  saveJsonData(db)
  res.status(201).json(newUser)
}

export async function updateUser(req, res) {
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
      const role = u.role !== undefined ? u.role : existing.role
      const status = u.status !== undefined ? u.status : existing.status
      const favoritesVal = u.favorites !== undefined ? JSON.stringify(u.favorites) : existing.favorites

      await mysqlPool.query(
        `UPDATE users SET name=?, email=?, phone=?, role=?, status=?, favorites=? WHERE id=?`,
        [name, email, phone, role, status, favoritesVal, id]
      )
      const [[updatedUser]] = await mysqlPool.query('SELECT * FROM users WHERE id=?', [id])
      if (updatedUser) {
        return res.json({
          ...updatedUser,
          favorites: updatedUser.favorites ? JSON.parse(updatedUser.favorites) : [],
          status: updatedUser.status || 'Ativo'
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
}

export async function deleteUser(req, res) {
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
}
