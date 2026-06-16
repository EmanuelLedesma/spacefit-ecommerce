// Módulos nativos de Node — no son dependencias, ya vienen instalados.
const crypto = require("crypto") // Herramientas de criptografía (hashear, generar bytes random).
const fs = require("fs")         // Leer y escribir archivos en el disco.
const path = require("path")     // Construir rutas de archivos de forma segura (Windows/Linux).

// Credenciales del admin inicial.
// "admin123" es texto plano, pero OJO: nunca se guarda así en el archivo final.
// Solo se usa como entrada para calcular el hash más abajo.
const email = "admin@spacefit.com"
const password = "admin123"

// SALT: 16 bytes completamente aleatorios, convertidos a texto hexadecimal.
// Es un "ingrediente extra" único que se mezcla con la contraseña antes de hashear.
// Sirve para que dos usuarios con la misma contraseña NUNCA tengan el mismo hash guardado.
// No es secreto — se guarda junto al hash, porque se necesita para verificar el login después.
const salt = crypto.randomBytes(16).toString("hex")

// HASH: acá pasa la parte central de seguridad.
// scrypt es un algoritmo diseñado específicamente para contraseñas (a diferencia de
// MD5/SHA, que son rápidos y por eso malos para esto). Es deliberadamente LENTO,
// para que probar millones de contraseñas por fuerza bruta sea costoso.
// El resultado (64 bytes, en hexadecimal) es matemáticamente impracticable de revertir
// para recuperar la contraseña original.
const hash = crypto.scryptSync(password, salt, 64).toString("hex")

// Objeto que representa al usuario admin que se va a guardar.
const usuario = {
  id: 1,            // Seed corre una sola vez sobre un archivo vacío: id=1 es correcto, no "mágico".
  email,
  password: hash,    // Se guarda el HASH, nunca "admin123" en texto plano.
  salt,              // Se guarda para poder re-hashear el password recibido en el login y comparar.
  nombre: "Admin",
  esAdmin: true,     // Flag que el middleware requireAdmin va a chequear más adelante.
  tokens: []         // Arranca vacío: todavía no inició sesión nadie.
}

// __dirname = carpeta donde está este script. path.join arma la ruta completa
// al archivo usuarios.json, sin importar el sistema operativo.
const ruta = path.join(__dirname, "usuarios.json")

// JSON.stringify convierte el objeto a texto JSON dentro de un array
// (usuarios.json va a contener una LISTA de usuarios, aunque hoy tenga solo uno).
// El "2" es solo indentación, para que el archivo quede legible si lo abrís.
// writeFileSync crea el archivo si no existe, o lo sobreescribe entero si ya existe.
fs.writeFileSync(ruta, JSON.stringify([usuario], null, 2))

console.log("Admin creado: admin@spacefit.com / admin123")

// RECORDATORIO para cuando armes routes/auth.js:
// El login NO puede "deshacer" el hash. Lo que hace es:
//   1) Buscar el usuario por email.
//   2) Tomar el password recibido del formulario.
//   3) Re-hashearlo usando el MISMO salt guardado en usuarios.json.
//   4) Comparar ese hash recién calculado contra el hash guardado,
//      usando crypto.timingSafeEqual (no "===" plano, para evitar timing attacks).
//   Si coinciden -> password correcto -> generar UUID y pushearlo a tokens[].
