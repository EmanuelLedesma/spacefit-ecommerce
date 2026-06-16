const { Router } = require("express")
const fs = require("fs")
const path = require("path")
const { requireAdmin } = require("../middleware/auth")

const router = Router()
const PRODUCTOS_RUTA = path.join(__dirname, "..", "data", "productos.json")

// Helper interno: leer productos del JSON
function leerProductos() {
  return JSON.parse(fs.readFileSync(PRODUCTOS_RUTA, "utf8"))
}

// Helper interno: guardar productos al JSON
function guardarProductos(productos) {
  fs.writeFileSync(PRODUCTOS_RUTA, JSON.stringify(productos, null, 2))
}

// GET /api/productos — públicos, sin auth
// Filtros combinables: ?categoria=remeras&genero=hombre&destacado=true&nuevo=true
router.get("/", (req, res) => {
  let productos = leerProductos()

  // Filtro por categoria (slug)
  if (req.query.categoria) {
    productos = productos.filter((p) => p.categoria === req.query.categoria)
  }

  // Filtro por genero: "hombre", "mujer", "unisex"
  if (req.query.genero) {
    productos = productos.filter((p) => p.genero === req.query.genero)
  }

  // Filtro por destacado: "true" → solo destacados
  if (req.query.destacado === "true") {
    productos = productos.filter((p) => p.destacado)
  }

  // Filtro por nuevo: "true" → solo nuevos
  if (req.query.nuevo === "true") {
    productos = productos.filter((p) => p.nuevo)
  }

  res.json(productos)
})

// POST /api/productos — requireAdmin
router.post("/", requireAdmin, (req, res) => {
  const { nombre, precio, imagen, descripcion, categoria, genero, destacado, nuevo } = req.body

  // Validación básica: nombre y precio son obligatorios
  if (!nombre || precio === undefined) {
    return res.status(400).json({ error: "nombre y precio son requeridos" })
  }

  const productos = leerProductos()

  // ID autoincremental simple: máximo id actual + 1
  const maxId = productos.reduce((max, p) => Math.max(max, p.id), 0)
  const producto = {
    id: maxId + 1,
    nombre,
    precio: Number(precio),
    imagen: imagen || "",
    descripcion: descripcion || "",
    categoria: categoria || "",
    genero: genero || "unisex",
    destacado: destacado === true || destacado === "true",
    nuevo: nuevo === true || nuevo === "true",
  }

  productos.push(producto)
  guardarProductos(productos)
  res.status(201).json(producto)
})

// PUT /api/productos/:id — requireAdmin
router.put("/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id)
  const productos = leerProductos()
  const idx = productos.findIndex((p) => p.id === id)

  if (idx === -1) {
    return res.status(404).json({ error: "Producto no encontrado" })
  }

  const { nombre, precio, imagen, descripcion, categoria, genero, destacado, nuevo } = req.body

  if (nombre !== undefined) productos[idx].nombre = nombre
  if (precio !== undefined) productos[idx].precio = Number(precio)
  if (imagen !== undefined) productos[idx].imagen = imagen
  if (descripcion !== undefined) productos[idx].descripcion = descripcion
  if (categoria !== undefined) productos[idx].categoria = categoria
  if (genero !== undefined) productos[idx].genero = genero
  if (destacado !== undefined) productos[idx].destacado = destacado === true || destacado === "true"
  if (nuevo !== undefined) productos[idx].nuevo = nuevo === true || nuevo === "true"

  guardarProductos(productos)
  res.json(productos[idx])
})

// DELETE /api/productos/:id — requireAdmin
router.delete("/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id)
  const productos = leerProductos()
  const idx = productos.findIndex((p) => p.id === id)

  if (idx === -1) {
    return res.status(404).json({ error: "Producto no encontrado" })
  }

  const eliminado = productos.splice(idx, 1)
  guardarProductos(productos)
  res.json(eliminado[0])
})

module.exports = router
