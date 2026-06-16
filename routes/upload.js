const { Router } = require("express")
const multer = require("multer")
const path = require("path")
const { requireAdmin } = require("../middleware/auth")

const router = Router()

// Configuración de multer: dónde guardar y cómo nombrar el archivo
const storage = multer.diskStorage({
  // destination: carpeta Imagenes/ en la raíz del proyecto
  destination: path.join(__dirname, "..", "Imagenes"),
  // filename: mantenemos el nombre original del archivo
  // Si quisieras evitar colisiones, podrías anteponer Date.now()-
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

// POST /api/upload — requireAdmin
// Recibe un campo "imagen" de tipo file (multipart/form-data)
router.post("/", requireAdmin, upload.single("imagen"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se envió ningún archivo" })
  }

  // Devolvemos la ruta relativa para guardar en el producto
  // Ej: "../Imagenes/mi-foto.png"
  res.json({
    ruta: path.join("..", "Imagenes", req.file.filename).replace(/\\/g, "/"),
  })
})

module.exports = router
