<div align="center">
  <h1>🏋️ SPACEFIT</h1>
  <p><strong>E-commerce de indumentaria fitness</strong></p>
  <p>
    <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=fff" alt="HTML5">
    <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=fff" alt="CSS3">
    <img src="https://img.shields.io/badge/Sass-C69?logo=sass&logoColor=fff" alt="Sass">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000" alt="JavaScript">
    <img src="https://img.shields.io/badge/Bootstrap_5-7952B3?logo=bootstrap&logoColor=fff" alt="Bootstrap 5">
  </p>
</div>

---

## 📋 Descripción

SPACEFIT es una tienda virtual de ropa y accesorios de gimnasio construida íntegramente con **HTML, CSS (SCSS), JavaScript vanilla y Bootstrap 5**. Doce páginas HTML que funcionan como un e-commerce real: landing page con carrusel y categorías visuales, secciones de productos por tipo (remeras, sudaderas, musculosas, pantalones, accesorios, suplementos), carrito persistente con localStorage, búsqueda en vivo, y páginas institucionales (contacto, política de devolución).

Ningún framework de JS. Ningún backend. Solo front-end puro con las herramientas fundamentales de la web.

---

## ✨ Funcionalidades

| | |
|---|---|
| 🛒 **Carrito dinámico** | Agregar, quitar, sumar y restar productos. Persiste en localStorage aunque cierres el navegador. |
| 🔍 **Búsqueda en vivo** | Filtra productos por nombre y descripción al instante desde cualquier página. |
| 📱 **Responsive total** | Header, grillas y layouts adaptados a mobile, tablet y desktop sin puntos de quiebre forzados. |
| 🧭 **Navbar sticky** | Barra superior fija al hacer scroll. Incluye banner de "3 cuotas" y navegación completa. |
| 🚚 **Envío gratis dinámico** | Un banner que se actualiza solo: indica cuánto falta para envío gratis (umbral $80.000). |
| 🎨 **Interfaz limpia** | Paleta blanco y negro. Tipografía única Roboto. Jerarquía visual por peso y tamaño, no por fuentes distintas. |
| 👤 **Modal de cuenta** | Inicio de sesión y registro simulados con alternancia de vistas sin recargar la página. |
| 🌀 **Microfeedback** | Botón "Agregar al carrito" con spinner y confirmación visual de 2 segundos. |

---

## 🛠 Tecnologías

| Área | Qué usé |
|------|---------|
| **Estructura** | HTML5 semántico (`header`, `main`, `footer`, `section`, `nav`) + atributos `data-*` de Bootstrap |
| **Estilos** | CSS3 con preprocesador **Sass** (archivos parciales, variables, nesting, media queries anidadas) |
| **Componentes UI** | **Bootstrap 5**: offcanvas (menú, carrito, búsqueda), modal (cuenta), carrusel, navbar, grid system |
| **Lógica** | **JavaScript vanilla** con clases ES6, `localStorage`, manipulación del DOM, eventos, métodos de array |
| **Animaciones** | AOS (Animate On Scroll) en landing + transiciones CSS personalizadas |
| **Control de versiones** | Git |

---

## 📁 Estructura del proyecto

```
├── index.html                       # Landing page con carrusel, categorías, best-sellers
├── pages/                           # 11 páginas internas
│   ├── hombres.html
│   ├── mujeres.html
│   ├── Remeras.html
│   ├── Sudaderas.html
│   ├── Musculosas.html
│   ├── Pantalones-shorts.html
│   ├── Accesorios gym.html
│   ├── Suplementos.html
│   ├── Nuevos_lanzamientos.html
│   ├── contacto.html
│   └── politica-devolucion.html
├── javascript/
│   └── app.js                       # Clases, carrito, búsqueda, eventos
├── scss/
│   ├── main.scss                    # Entry point
│   ├── _base.scss                   # Variables, resets
│   ├── components/                  # _header, _navbar, _carrusel, _categorias, _tarjetas, _boton, _footer
│   └── pages/                       # _index, _contacto, _politica
├── css/
│   └── stylesheet.css               # Compilado de Sass
└── Imagenes/
    ├── carrusel/
    ├── (carpetas por categoría)
    └── Iconos/
```

---

## 🧠 ¿Qué aprendí y practiqué?

### HTML

- Estructura semántica real con múltiples páginas interconectadas
- Uso intensivo de atributos `data-bs-*` para componentes Bootstrap
- Integración de tipografías externas (Google Fonts) y librerías CSS/JS

### CSS / SCSS

- Arquitectura modular con partials y `@import`
- Variables, nesting, selector `&`, media queries dentro del selector
- `aspect-ratio: 4/5` con `object-fit: cover` para imágenes de producto uniformes
- `position: sticky` + `z-index` para navbar fijo sin conflictos de capas
- Animaciones hover con pseudo-elementos `::after` y `transform: scale`
- Responsive design sin librerías externas (solo Bootstrap grid + media queries propias)

### JavaScript

- Clases ES6: `Producto`, `ControladorProductos`, `Carrito` con métodos y encapsulamiento
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

🔗 **Link del proyecto desplegado:** [https://spacefit-ecommerce.netlify.app/](https://spacefit-ecommerce.netlify.app/)

Si modificás los estilos SCSS:

```bash
npx sass scss/main.scss:css/stylesheet.css --no-source-map
```

---
