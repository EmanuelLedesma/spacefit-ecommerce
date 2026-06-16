# Plan Refactor — Spacefit Ecommerce

## Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Persistencia:** Archivos JSON (`data/*.json`)
- **Auth:** UUID en `usuarios[].tokens[]` (sin JWT, sin sessions)
- **Hash:** `crypto.scryptSync` (stdlib)
- **Imágenes:** Multer a `Imagenes/`

## Archivos

```text
spacefit-ecommerce/
  server.js                   ← Entry point
  routes/
    auth.js                   ← POST /api/auth/login
    productos.js              ← CRUD /api/productos
    categorias.js             ← CRUD /api/categorias
  middleware/
    auth.js                   ← verifyToken + requireAdmin
  data/
    seed-admin.js             ← Script único: genera admin hasheado en usuarios.json
    usuarios.json             ← Creado por seed-admin.js (hash, nunca texto plano)
    productos.json            ← Catálogo extraído de HTML + app.js
    categorias.json           ← Seed inicial
  Imagenes/                   ← Subida de imágenes vía multer
  javascript/
    app.js                    ← Refactor: fetch a API, navbar dinámico
    admin.js                  ← Login + CRUD admin
  admin.html                  ← Panel admin
  categoria.html              ← Template única reemplaza 11 páginas
  index.html                  ← Home (productos destacados desde API)
```

## Endpoints

### Auth

| Método | Ruta              | Body                 | Respuesta           |
| ------ | ----------------- | -------------------- | ------------------- |
| `POST` | `/api/auth/login` | `{ email, password }` | `{ token, usuario }` |

### Productos

| Método   | Ruta                            | Auth         | Respuesta            |
| -------- | ------------------------------- | ------------ | -------------------- |
| `GET`    | `/api/productos`                | —            | `[ ... productos ]`  |
| `GET`    | `/api/productos?categoria=slug` | —            | Productos filtrados  |
| `GET`    | `/api/productos?destacado=true` | —            | Solo destacados      |
| `POST`   | `/api/productos`                | requireAdmin | Producto creado      |
| `PUT`    | `/api/productos/:id`            | requireAdmin | Producto actualizado |
| `DELETE` | `/api/productos/:id`            | requireAdmin | Producto eliminado   |

### Categorías

| Método   | Ruta                  | Auth         | Respuesta             |
| -------- | --------------------- | ------------ | --------------------- |
| `GET`    | `/api/categorias`     | —            | `[ ... categorias ]`  |
| `POST`  | `/api/categorias`     | requireAdmin | Categoría creada      |
| `PUT`    | `/api/categorias/:id` | requireAdmin | Categoría actualizada |
| `DELETE`| `/api/categorias/:id` | requireAdmin | Categoría eliminada   |

### Imágenes

| Método | Ruta          | Auth         | Respuesta                             |
| ------ | ------------- | ------------ | ------------------------------------- |
| `POST` | `/api/upload` | requireAdmin | `{ ruta: "../Imagenes/archivo.png" }` |

## Auth — verifyToken + requireAdmin

- **verifyToken(token):** busca
  `usuarios.find(u => u.tokens.includes(token))` y devuelve el usuario
  o `null`.
- **requireAdmin:** middleware que lee `Authorization: Bearer <uuid>`,
  llama a verifyToken, y si no existe o `esAdmin !== true`, responde
  `401`/`403`.

## Frontend — cambios clave

### app.js (refactor)

- `ControladorProductos` ya no tiene productos hardcodeados. `init()`
  hace `fetch("/api/productos?destacado=true")` para home y
  `fetch("/api/productos?categoria=X")` para categoría.
- Navbar se construye dinámicamente desde `GET /api/categorias`.

### categoria.html (nuevo)

- Reemplaza `hombres.html`, `mujeres.html`, `remeras.html`, etc.
- Lee `?slug=` de la URL, fetchea productos por categoría, renderiza grilla.
- Misma estructura de navbar + carrito que las páginas actuales.

### admin.html + admin.js (nuevo)

- Login: pide email+password, recibe UUID, lo guarda en localStorage.
- Panel con tabla de productos: crear, editar, eliminar, toggle destacado.
- Formulario con `<input type="file">` para subir imagen.
- Gestión de categorías: crear/renombrar/eliminar.

### Eliminar

- `pages/hombres.html`, `pages/mujeres.html`, etc. (11 páginas de categoría).
- Productos hardcodeados en `app.js` (líneas 258-278).

## Migración de datos

Extraer todos los productos de:

- `javascript/app.js` (líneas 258-265)
- `pages/hombres.html`, `pages/mujeres.html`, etc. (tarjetas HTML)

Unificarlos en `data/productos.json` con schema:

```json
{
  "id": 1,
  "nombre": "Yogger ambitius Youngla",
  "precio": 30000,
  "imagen": "../Imagenes/Pantalones/Yogger-ambitius-Youngla.png",
  "descripcion": "...",
  "categoria": "pantalones",
  "destacado": false
}
```

## Seed admin

El admin inicial se genera con un script descartable (`data/seed-admin.js`) que:

1. Toma credenciales fijas (`admin@spacefit.com` / `admin123`)
2. Genera el hash con `crypto.scryptSync` (mismo salt+scrypt que usa `routes/auth.js`)
3. Escribe `data/usuarios.json` con el usuario, `esAdmin: true`, `tokens: []`

Se corre una vez con `node data/seed-admin.js` y se elimina o se ignora después.
Nunca se guarda el password en texto plano en el repo.
El hash generado es estable porque usa un salt fijo (consistente con `routes/auth.js`).

Las credenciales se documentan en el README como "usuario demo" para que el reclutador entre sin pedir acceso.

## Notas de implementación

- **imgPath() no se toca.** Ya resuelve rutas relativas según la página. `categoria.html` está en la raíz como `index.html`, el helper corrige `../Imagenes/` a `./Imagenes/` automáticamente.
- **Carrito intacto.** Sigue con localStorage, fuera del alcance del refactor.
- **Paginación client-side.** El slice existente en `ControladorProductos` (4 en 4) es suficiente para el catálogo actual (~40-50 productos). Paginación backend sería sobreingeniería acá.
- **Login existente sin duplicar.** El modal de login actual se mantiene (mismo HTML, mismo flujo visual). Solo cambia el handler del submit: en vez de `alert()`, hace fetch a `POST /api/auth/login`, guarda el token, y si `usuario.esAdmin === true` redirige a `admin.html`; si no, cierra el modal y continúa como cliente logueado.

## Orden de implementación

1. Seed admin (`node data/seed-admin.js` genera `data/usuarios.json`)
2. Seed data (`data/productos.json`, `data/categorias.json`)
3. Middleware auth (`verifyToken` + `requireAdmin`)
4. Ruta `POST /api/auth/login`
5. Ruta `GET /api/productos` (con filtros)
6. Ruta `POST /api/upload` (multer)
7. Rutas protegidas: POST/PUT/DELETE `/api/productos`, CRUD `/api/categorias`
8. Refactor `app.js` (fetch a API, navbar dinámico)
9. `categoria.html` (template única)
10. `admin.html` + `admin.js` (panel)
11. Eliminar páginas estáticas de categoría
