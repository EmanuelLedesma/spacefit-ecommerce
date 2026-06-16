const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use("/api/auth", require("./routes/auth"))
app.use("/api/productos", require("./routes/productos"))
app.use("/api/upload", require("./routes/upload"))

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
