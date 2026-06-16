<div align="center">
  <h1>🏋️ SPACEFIT</h1>
  <p><strong>E-commerce de indumentaria fitness</strong></p>
  <p>
    <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=fff" alt="HTML5">
    <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=fff" alt="CSS3">
    <img src="https://img.shields.io/badge/Sass-C69?logo=sass&logoColor=fff" alt="Sass">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000" alt="JavaScript">
    <img src="https://img.shields.io/badge/Bootstrap_5-7952B3?logo=bootstrap&logoColor=fff" alt="Bootstrap 5">
    <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=fff" alt="Node.js">
    <img src="https://img.shields.io/badge/Express-000?logo=express&logoColor=fff" alt="Express">
  </p>
</div>

---

## 📋 Descripción

SPACEFIT es un e-commerce de ropa y accesorios de gimnasio con **frontend en JavaScript vanilla + Bootstrap 5** y **backend en Node.js + Express**. Catálogo dinámico servido por API, panel de administración para gestión de productos, carrito persistente con localStorage y búsqueda en vivo.

---

## ✨ Funcionalidades

| | |
|---|---|---|
| 🛒 **Carrito dinámico** | Agregar, quitar, sumar y restar productos. Persiste en localStorage aunque cierres el navegador. |
| 🔍 **Búsqueda en vivo** | Filtra productos por nombre y descripción al instante desde cualquier página. |
| 📱 **Responsive total** | Header, grillas y layouts adaptados a mobile, tablet y desktop sin puntos de quiebre forzados. |
| 🧭 **Navbar sticky** | Barra superior fija al hacer scroll. Incluye banner de "3 cuotas" y navegación completa. |
| 🚚 **Envío gratis dinámico** | Banner que se actualiza solo: indica cuánto falta para envío gratis (umbral $80.000). |
| 🎨 **Interfaz limpia** | Paleta blanco y negro. Tipografía única Roboto. Jerarquía visual por peso y tamaño. |
| 👤 **Autenticación con UUID** | Login con tokens UUID en array `tokens[]`. Sin JWT, sin sessions. |
| 🔐 **Panel administrador** | CRUD de productos y categorías, subida de imágenes, toggle de destacados. |
| 🌀 **Microfeedback** | Botón "Agregar al carrito" con spinner y confirmación visual de 2 segundos. |

---

## 🛠 Tecnologías

| Área | Qué usé |
|------|---------|
| **Estructura** | HTML5 semántico (`header`, `main`, `footer`, `section`, `nav`) + atributos `data-*` de Bootstrap |
| **Estilos** | CSS3 con preprocesador **Sass** (archivos parciales, variables, nesting, media queries anidadas) |
| **Componentes UI** | **Bootstrap 5**: offcanvas (menú, carrito, búsqueda), modal (cuenta), carrusel, navbar, grid system |
| **Frontend** | **JavaScript vanilla** con clases ES6, `localStorage`, manipulación del DOM, eventos, métodos de array |
| **Backend** | **Node.js + Express** con rutas modulares, middlewares de autenticación, persistencia en JSON |
| **Auth** | UUID en `usuarios[].tokens[]`, hash con `crypto.scryptSync` + salt aleatorio, `timingSafeEqual` |
| **Imágenes** | Multer para subida al servidor |
| **Animaciones** | AOS (Animate On Scroll) en landing + transiciones CSS personalizadas |
| **Control de versiones** | Git |

---

## 📁 Estructura del proyecto

```text
├── server.js                       # Entry point Express
├── routes/
│   ├── auth.js                     # POST /api/auth/login
│   ├── productos.js                # CRUD /api/productos
│   └── categorias.js               # CRUD /api/categorias
├── middleware/
│   └── auth.js                     # verifyToken + requireAdmin
├── data/
│   ├── seed-admin.js               # AdminInitializer: genera admin hasheado
│   ├── usuarios.json               # Usuarios con hash + salt + tokens[]
│   ├── productos.json              # Catálogo de productos
│   └── categorias.json             # Categorías del catálogo
├── index.html                      # Home con productos destacados desde API
├── categoria.html                  # Template única (reemplaza páginas estáticas)
├── admin.html                      # Panel de administración
├── javascript/
│   ├── app.js                      # Clases, carrito, búsqueda, fetch a API
│   └── admin.js                    # Login + CRUD admin
├── scss/
│   ├── main.scss                   # Entry point
│   ├── _base.scss                  # Variables, resets
│   ├── components/                 # _header, _navbar, _carrusel, _categorias, _tarjetas, _boton, _footer
│   └── pages/                      # _index, _contacto, _politica
├── css/
│   └── stylesheet.css              # Compilado de Sass
└── Imagenes/
    ├── carrusel/
    ├── (carpetas por categoría)
    └── Iconos/
```

---

## 🧠 ¿Qué aprendí y practiqué?

### Backend

- API REST con Express, rutas modulares y middlewares
- Autenticación por UUID con `crypto.scryptSync` + salt aleatorio por usuario
- Panel admin con CRUD de productos, categorías y subida de imágenes
- Middleware `verifyToken` + `requireAdmin` para proteger rutas

### Frontend

- Clases ES6: `Producto`, `ControladorProductos`, `Carrito` con métodos y encapsulamiento
- Consumo de API con `fetch()` para productos y categorías
- `localStorage`: guardar, leer y rehidratar objetos planos a instancias de clase
- Manipulación del DOM: crear elementos, inyectar HTML, manejar eventos (`click`, `input`)
- Métodos de array funcionales: `some()`, `map()`, `filter()`, `forEach()`
- Lógica de carrito completa: agregar, aumentar/disminuir cantidad, eliminar, calcular total
- Búsqueda en vivo con filtro sobre array de productos
- Helper `imgPath()` para rutas de imágenes relativas funcionando desde cualquier página

### Bootstrap 5

- Navbar responsive con offcanvas en mobile y dos filas en desktop
- Offcanvas para tres usos distintos: menú, carrito lateral y búsqueda superior
- Modal con alternancia de vistas (login/registro)
- Grid system para grillas de productos y categorías
- Clases utilitarias sin escribir CSS extra (`sticky-top`, `shadow-sm`, `d-*`, `gap-*`)

---

## 🚀 Cómo levantar el proyecto

### Requisitos

- Node.js 18 o superior

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/EmanuelLedesma/spacefit-ecommerce.git
cd spacefit-ecommerce

# Instalar dependencias
npm install

# Generar el admin inicial (solo la primera vez)
node data/seed-admin.js
```

### Ejecutar

```bash
node server.js
```

El servidor arranca en `http://localhost:3000`.

### Admin demo

| Email | Password |
|-------|----------|
| `admin@spacefit.com` | `admin123` |

Ingresá a `http://localhost:3000/admin` y logueate con esas credenciales.

### Compilar SCSS (si modificás estilos)

```bash
npx sass scss/main.scss:css/stylesheet.css --no-source-map
```

---
