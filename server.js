const express = require('express')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const app = express()
const PORT = process.env.PORT || 3000
const DATA_DIR = path.join(__dirname, 'data')

// CORS manual (sin package)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

app.use(express.json())

// Crear data/ si no existe
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

// Helper: leer JSON
function leerJSON(archivo) {
  const ruta = path.join(DATA_DIR, archivo)
  if (!fs.existsSync(ruta)) return []
  return JSON.parse(fs.readFileSync(ruta, 'utf8'))
}

// Helper: escribir JSON
function escribirJSON(archivo, data) {
  fs.writeFileSync(path.join(DATA_DIR, archivo), JSON.stringify(data, null, 2))
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Spacefit API corriendo en http://localhost:${PORT}`)
})
