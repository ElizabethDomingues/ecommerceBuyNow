import { mysqlPool, useJsonFallback, loadJsonData } from '../config/database.js'

export async function adminLogin(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' })
  }

  const normalizedEmail = email.toLowerCase().trim()

  if (!useJsonFallback) {
    try {
      const [[user]] = await mysqlPool.query(
        'SELECT * FROM users WHERE LOWER(email) = ?',
        [normalizedEmail]
      )

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas ou usuário não cadastrado.' })
      }

      if (user.status === 'Inativo') {
        return res.status(403).json({ error: 'Acesso bloqueado. Esta conta administrativa está inativa.' })
      }

      if (user.role !== 'Administrador' && user.role !== 'Estoquista') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores ou estoquistas podem acessar o painel.' })
      }

      const correctPassword = user.password || 'admin'
      if (password !== correctPassword) {
        return res.status(401).json({ error: 'Senha incorreta.' })
      }

      const formattedUser = {
        ...user,
        favorites: user.favorites ? JSON.parse(user.favorites) : []
      }
      delete formattedUser.password
      return res.json(formattedUser)
    } catch (e) {
      console.error('MySQL Admin Login Error, falling back to JSON:', e)
    }
  }

  // Fallback JSON
  const db = loadJsonData()
  const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail)

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas ou usuário não cadastrado.' })
  }

  if (user.status === 'Inativo') {
    return res.status(403).json({ error: 'Acesso bloqueado. Esta conta administrativa está inativa.' })
  }

  if (user.role !== 'Administrador' && user.role !== 'Estoquista') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores ou estoquistas podem acessar o painel.' })
  }

  const correctPassword = user.password || 'admin'
  if (password !== correctPassword) {
    return res.status(401).json({ error: 'Senha incorreta.' })
  }

  const formattedUser = {
    ...user,
    favorites: user.favorites || []
  }
  delete formattedUser.password
  res.json(formattedUser)
}
