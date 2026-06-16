const fs = require("fs")
const path = require("path")

const USUARIOS_RUTA = path.join(__dirname, "..", "data", "usuarios.json")

function leerUsuarios() {
  return JSON.parse(fs.readFileSync(USUARIOS_RUTA, "utf8"))
}

// Busca el usuario dueño de este token. Lee el archivo fresco cada vez,
// no cachea nada en memoria.
function verifyToken(token) {
  const usuarios = leerUsuarios()
  return usuarios.find((u) => u.tokens.includes(token)) || null
}

// Middleware: solo deja pasar si el request trae un token válido de un admin.
function requireAdmin(req, res, next) {
  const header = req.headers["authorization"]

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" })
  }

  const token = header.slice(7) // saca el "Bearer " y deja el UUID puro

  const usuario = verifyToken(token)
  if (!usuario) {
    return res.status(401).json({ error: "Token inválido" })
  }

  if (!usuario.esAdmin) {
    return res.status(403).json({ error: "Se requiere permisos de administrador" })
  }

  // queda disponible para los handlers siguientes en la cadena
  req.usuario = usuario
  req.token = token
  next()
}

module.exports = { verifyToken, requireAdmin }