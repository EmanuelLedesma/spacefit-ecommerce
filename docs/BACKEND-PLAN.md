# Backend Spacefit — Plan MVP

## Stack

- **Runtime:** Node.js
- **Framework:** Express (única dependencia nueva)
- **Persistencia:** Archivos JSON (`data/productos.json`, `data/usuarios.json`)
- **Hash de passwords:** `crypto.scryptSync` (stdlib, cero dependencias extra)
- **Token de sesión:** UUID simple (sin JWT, sin passport)
- **Estructura:** 1 archivo (`server.js`), cero abstracciones

## Archivos

```
spacefit-ecommerce/
  server.js          ← Todo acá: setup Express, rutas, handlers
  data/
    productos.json   ← Catálogo extraído de app.js
    usuarios.json    ← Se crea solo al primer registro
```

## Endpoints

| Método | Ruta | Body / Headers | Respuesta |
|--------|------|----------------|-----------|
| `POST` | `/api/register` | Body: `{ nombre, email, password }` | `{ token, usuario }` |
| `POST` | `/api/login` | Body: `{ email, password, carritoLocal }` | `{ token, usuario, carritoFusionado }` |
| `GET` | `/api/productos` | — | `[ ... productos ]` |
| `GET` | `/api/carrito` | Headers: `Authorization: Bearer <token>` | `[ ... items ]` |
| `POST` | `/api/carrito` | Body: `{ productoId, cantidad }` + Headers: `Authorization: Bearer <token>` | Carrito actualizado |
| `DELETE` | `/api/carrito/:productoId` | Headers: `Authorization: Bearer <token>` | Carrito actualizado |

## Contrato de errores

Todos los errores devuelven `{ error: "mensaje" }` con el código HTTP correspondiente:

| Código | Situación |
|--------|-----------|
| `409` | `POST /api/register` — el email ya existe |
| `401` | `POST /api/login` — email no existe o password no coincide |
| `401` | Rutas protegidas — token faltante o inválido |
| `500` | Error inesperado del servidor |

## Lógica de auth y seguridad

**Register:** validar campos → check si email existe → `crypto.scryptSync` para hash con salt → guardar en `usuarios.json` → generar UUID token y agregarlo al array `tokens[]` del usuario → devolver `{ token, usuario }`.

**Login y fusión:** buscar por email → comparar hash → generar UUID token y agregarlo al array `tokens[]` → recibir carrito de localStorage y fusionarlo con el guardado en el JSON → devolver `{ token, usuario, carritoFusionado }`.

**Tokens múltiples (sesiones simultáneas):** El campo `token` en `usuarios.json` es un array `tokens[]`. Cada login agrega un nuevo UUID al array en lugar de sobreescribir. La validación en rutas protegidas acepta cualquier token del array. Al cerrar sesión se elimina solo ese token del array.

**Seguridad:** El frontend **jamás** pasa el token por la URL. Se envía estrictamente a través del header `Authorization: Bearer <token>`.

**CORS:** El middleware CORS manual en `server.js` responde `200` a requests con método `OPTIONS` (preflight) antes de que lleguen a las rutas. Sin esto, `DELETE` y requests con header `Authorization` son bloqueados por el browser.

## Conexión con frontend

- Los `alert()` simulados de login/registro en `app.js` se reemplazan por `fetch()` a los endpoints.
- En las peticiones protegidas (rutas de carrito), el frontend inyecta el token leyéndolo de `localStorage` hacia los headers de la petición.
- Los productos se obtienen de `GET /api/productos` en lugar de estar hardcodeados.
- El carrito funciona offline en `localStorage`. Al momento de hacer login, ese `localStorage` se envía al backend para consolidarse con la base de datos (resolución del carrito híbrido).
- **Manejo de 401:** si cualquier respuesta protegida devuelve `401`, el frontend borra solo el `token` de `localStorage` (NO toca `listaCarrito`), limpia el estado de usuario en memoria y muestra el modal de login. El carrito offline sobrevive intacto. Al re-loguearse, entra la lógica de fusión del paso 7.

## Orden de implementación

1. `server.js` con Express, CORS manual (sin package), JSON body parser.
2. `POST /api/register`
3. `POST /api/login` (aún sin lógica de fusión de carrito).
4. Extraer `data/productos.json` + `GET /api/productos`.
5. Endpoints de carrito (`GET/POST/DELETE`) validando el header `Authorization`.
6. Conectar frontend (reemplazar `alert()` por `fetch()` e implementar envío de headers).
7. Fase final: implementar la lógica de fusión del carrito local con el carrito del backend durante el login.
