const { Router } = require("express")
const crypto = require("crypto")
const fs = require("fs")
const path = require("path")

const router = Router()
const USUARIOS_RUTA = path.join(__dirname, "..", "data", "usuarios.json")

router.post("/login", (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: "Email y password requeridos" })
  }

  const usuarios = JSON.parse(fs.readFileSync(USUARIOS_RUTA, "utf8"))
  const usuario = usuarios.find((u) => u.email === email)
  if (!usuario) {
    return res.status(401).json({ error: "Credenciales inválidas" })
  }

  const hash = crypto.scryptSync(password, usuario.salt, 64)
  if (!crypto.timingSafeEqual(hash, Buffer.from(usuario.password, "hex"))) {
    return res.status(401).json({ error: "Credenciales inválidas" })
  }

  const token = crypto.randomUUID()
  usuario.tokens.push(token)
  fs.writeFileSync(USUARIOS_RUTA, JSON.stringify(usuarios, null, 2))

  res.json({
    token,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      esAdmin: usuario.esAdmin,
    },
  })
})

module.exports = router
