function imgPath(ruta) {
    const enSubpagina = window.location.pathname.includes("/pages/") || window.location.pathname.includes("\\pages\\")
    if (enSubpagina && ruta.startsWith("./")) {
        return "../" + ruta.slice(2)
    }
    if (!enSubpagina && ruta.startsWith("../")) {
        return "./" + ruta.slice(3)
    }
    return ruta
}

class Producto {
    constructor(id, nombre, precio, img, descripcion) {
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.cantidad = 1
        this.img = img
        this.descripcion = descripcion
    }

    aumentarCantidad() {
        this.cantidad++
    }

    disminuirCantidad(){
        if (this.cantidad>1){
            this.cantidad--
            return true
        }
        return false
    }

    descripcionHTML() {
        return   `<div class="tarjeta h-100">
        <div class="tarjeta__imagenContainer">
            <img src="${imgPath(this.img)}">
     </div>

    <div class="tarjeta-cuerpo d-flex flex-column">

        <h3 class="fs-6 text-truncate-2">${this.nombre}</h3>
        <span class="fs-6 fw-bold">$${this.precio}</span>

    
        <div class="contenedor-boton mt-auto" id="añadir_producto-${this.id}">
            <div class="btn btn-comprar btn-sm w-100 rounded-0" id="Añadir_producto-${this.id}">

            <span>Agregar al carrito</span>

            </div>

        </div>`
    }
}

class ControladorProductos {
    constructor() {
        this.listaProductos = []
        this.productosAMostrar = 4
    }

    agregar(producto) {
        this.listaProductos.push(producto)
    }

    buscarProductoPorID(id) {
        return this.listaProductos.find(producto => producto.id == id)
    }

    mostrarProductos() {
        let contenedor_tarjetas = document.getElementById("contenedor_tarjetas")
        if (!contenedor_tarjetas) return

        const row = document.createElement("div")
        row.className = "row justify-content-center g-3"

        const mostrar = this.listaProductos.slice(0, this.productosAMostrar)
        mostrar.forEach(producto => {
            const col = document.createElement("div")
            col.className = "col-6 col-md-4 col-lg-3 d-flex"
            col.innerHTML = producto.descripcionHTML()
            row.appendChild(col)
        })

        contenedor_tarjetas.innerHTML = ""
        contenedor_tarjetas.appendChild(row)

        this._actualizarBoton()
    }

    cargarMas() {
        const nuevos = this.listaProductos.slice(this.productosAMostrar, this.productosAMostrar + 4)
        this.productosAMostrar += 4

        const contenedor = document.getElementById("contenedor_tarjetas")
        if (!contenedor) return
        const row = contenedor.querySelector(".row")
        if (!row) return

        nuevos.forEach(producto => {
            const col = document.createElement("div")
            col.className = "col-6 col-md-4 col-lg-3 d-flex tarjeta-col--nueva"
            col.innerHTML = producto.descripcionHTML()
            row.appendChild(col)
        })

        this._actualizarBoton()
    }

    _actualizarBoton() {
        const btnContainer = document.getElementById("btn-ver-mas")
        if (btnContainer) {
            btnContainer.style.display = this.productosAMostrar >= this.listaProductos.length ? "none" : ""
        }
    }
}

class Carrito {
    constructor() {
        this.listaCarrito = []
    }
    
    levantarStorage() {
        const data = JSON.parse(localStorage.getItem("listaCarrito")) || []
        this.listaCarrito = data.map(p => {
            const prod = new Producto(p.id, p.nombre, p.precio, p.img, p.descripcion)
            prod.cantidad = p.cantidad
            return prod
        })
        this.actualizarBadge()
    }

    actualizarBadge() {
        const badges = document.querySelectorAll(".cart-badge")
        if (!badges.length) return
        const total = this.listaCarrito.reduce((acc, p) => acc + p.cantidad, 0)
        badges.forEach(b => {
            b.textContent = total
            b.classList.toggle("d-none", total === 0)
        })
    }

    guardarEnStorage() {
        let listaCarritoJSON = JSON.stringify(this.listaCarrito)
        localStorage.setItem("listaCarrito", listaCarritoJSON)
    }

    eliminar(productoEliminar) {
        let producto = this.listaCarrito.find(producto => producto.id == productoEliminar.id)
        let indice = this.listaCarrito.indexOf(producto)
        this.listaCarrito.splice(indice, 1)
    }

    agregar(productoAgregar) {
        let existeProducto = this.listaCarrito.some(producto => producto.id == productoAgregar.id);
        if (existeProducto) {
            let productoEncontrado = this.listaCarrito.find(producto => producto.id == productoAgregar.id);
            productoEncontrado.cantidad++
        } else {
            this.listaCarrito.push(productoAgregar);
        }
    }

    mostrarProductos() {
        let contenedor_carrito = document.getElementById("contenedor_carrito")
        let total = document.getElementById("total")
        if (!contenedor_carrito) return

        contenedor_carrito.innerHTML = ""
        this.listaCarrito.forEach(producto => {
            contenedor_carrito.innerHTML += `
            <div class="d-flex mb-4 align-items-center">
              <img src="${imgPath(producto.img)}" alt="${producto.nombre}" style="width: 80px; height: 100px; object-fit: cover;" class="me-3 border">
              <div class="d-flex flex-column w-100">
                <h6 class="mb-1 fw-bold text-dark" style="font-size: 0.9rem;">${producto.nombre}</h6>
                <span class="text-muted mb-2" style="font-size: 0.9rem;">$${producto.precio}</span>
                
                <div class="d-flex align-items-center justify-content-between mt-auto">
                  
                  <div class="d-flex align-items-center border border-secondary" style="width: 100px; height: 32px; background-color: white;">
                    <button id="menos-${producto.id}" type="button" class="border-0 bg-transparent flex-fill h-100 fs-5 d-flex align-items-center justify-content-center" style="color: black; cursor: pointer; outline: none;">-</button>
                    <input type="text" class="text-center border-0 p-0 h-100 fw-bold bg-transparent" value="${producto.cantidad}" readonly style="width: 35px; color: black; outline: none;">
                    <button id="mas-${producto.id}" type="button" class="border-0 bg-transparent flex-fill h-100 fs-5 d-flex align-items-center justify-content-center" style="color: black; cursor: pointer; outline: none;">+</button>
                  </div>

                  <button id="eliminar-${producto.id}" class="bg-transparent border-0 text-muted text-decoration-underline p-0" style="font-size: 0.8rem; cursor: pointer;">Eliminar</button>

                </div>
              </div>
            </div>`
        })

        this.listaCarrito.forEach(producto => {
            let btn_eliminar = document.getElementById(`eliminar-${producto.id}`);
            let btn_mas = document.getElementById(`mas-${producto.id}`);
            let btn_menos = document.getElementById(`menos-${producto.id}`);

            if (btn_eliminar) {
                btn_eliminar.addEventListener("click", () => {
                    this.eliminar(producto);
                    this.guardarEnStorage();
                    this.mostrarProductos();
                });
            }
            if (btn_mas) {
                btn_mas.addEventListener("click", () => {
                    producto.cantidad++;
                    this.guardarEnStorage();
                    this.mostrarProductos();
                });
            }
            if (btn_menos) {
                btn_menos.addEventListener("click", () => {
                    if (producto.cantidad > 1) {
                        producto.cantidad--;
                        this.guardarEnStorage();
                        this.mostrarProductos();
                    }
                });
            }
        })
        
        if (total) {
            total.innerHTML = this.calcularTotal()
        }
        this.actualizarBannerEnvio()
        this.actualizarBadge()
    }

    calcularTotal(){
        return this.listaCarrito.reduce((acumulador,producto) =>acumulador+producto.precio*producto.cantidad, 0)
    }

    actualizarBannerEnvio() {
        const banner = document.getElementById("banner-envio");
        if (!banner) return;

        const total = this.calcularTotal();
        const limite = 80000;

        if (total === 0) {
            banner.innerHTML = `¡Agrega $${limite.toLocaleString("es-AR")} para obtener envío gratis!`;
            banner.classList.remove("text-success", "fw-bold");
            banner.classList.add("text-muted");
        } else if (total < limite) {
            const faltante = limite - total;
            banner.innerHTML = `¡Agrega $${faltante.toLocaleString("es-AR")} más para obtener envío gratis!`;
            banner.classList.remove("text-success", "fw-bold");
            banner.classList.add("text-muted");
        } else {
            banner.innerHTML = "¡Felicidades! Tienes envío gratis 🚚";
            banner.classList.remove("text-muted");
            banner.classList.add("text-success", "fw-bold");
        }
    }
}

const p1 = new Producto(1, "Yogger ambitius Youngla", 30000, "../Imagenes/Pantalones/Yogger-ambitius-Youngla.png", "Yogger ambitius Youngla, pantalon con tela de alta calidad, muy confortable y estiloso para entrenar ")
const p2 = new Producto(2, "Remera Shark slimfit", 8000, "../Imagenes/remeras/Remera-Shark-slimfit.png", "Remera entallada negra shark slimfit")
const p3 = new Producto(3, "Hummingbird hoodie", 17000, "../Imagenes/Sudaderas/HUMMINGBIRD-hoodie.png", "buzo corto y lindo para chicas")
const p4 = new Producto(4, "Roman tees Youngla", 14000, "../Imagenes/remeras/Roman-tees-Youngla.png", "Remera essensial de alta calidad y algodon que tiene que estar en tu guardaropa de youngla")
const p5 = new Producto(5, "Momentum tanks", 14000, "../Imagenes/Musculosas/MOMENTUM-TANKS.png", "Musculosa cerrada negra Youngla")
const p6 = new Producto(6, "Collegiate Hoodie", 20000, "../Imagenes/Sudaderas/COLLEGIATE-HOODIE.png", "buzo gymshark color crema estiloso y comodo para salir o entrenar")
const p7 = new Producto(7, "Short negro Youngla", 15000, "../Imagenes/Pantalones/Short-negro-Youngla.png", "Short negro Youngla de alta calidad para entrenar y tener una buena movilidad")
const p8 = new Producto(8, "Straps wildfitness", 7000, "../Imagenes/accesorios/Straps.png", "Straps wildfitness para un mejor rendimiento en ejercicios que carguen el antebrazo")

const carrito = new Carrito()
const controlador_productos = new ControladorProductos()

controlador_productos.agregar(p1)
controlador_productos.agregar(p2)
controlador_productos.agregar(p3)
controlador_productos.agregar(p4)
controlador_productos.agregar(p5)

controlador_productos.agregar(p6)
controlador_productos.agregar(p7)
controlador_productos.agregar(p8)

document.addEventListener("DOMContentLoaded", () => {
    carrito.levantarStorage()
    carrito.mostrarProductos()
    controlador_productos.mostrarProductos()

    const btnFinalizar = document.getElementById("finalizar_compra")
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", () => {
            if (carrito.listaCarrito.length === 0) {
                alert("El carrito está vacío")
                return
            }
            carrito.listaCarrito = []
            carrito.guardarEnStorage()
            carrito.mostrarProductos()
            alert("Compra finalizada. Gracias por tu compra en SPACEFIT")
        })
    }

    const btnVerMas = document.getElementById("btn-ver-mas")
    if (btnVerMas) {
        btnVerMas.addEventListener("click", () => {
            controlador_productos.cargarMas()
        })
    }
})

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-comprar")
    if (!btn) return
    if (btn.classList.contains("btn--loading") || btn.classList.contains("btn--added")) return

    const span = btn.querySelector("span")
    const originalHTML = span.innerHTML

    span.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
    btn.classList.add("btn--loading")

    setTimeout(() => {
        span.innerHTML = `\u00a1Agregado! \u2713`
        btn.classList.remove("btn--loading")
        btn.classList.add("btn--added")
    }, 500)

    setTimeout(() => {
        span.innerHTML = originalHTML
        btn.classList.remove("btn--added")
    }, 2000)

    const idBoton = btn.id;
    const idProducto = idBoton ? idBoton.split("-").pop() : null;
    
    let productoBase = null;
    if (idProducto) {
        productoBase = controlador_productos.buscarProductoPorID(idProducto);
    }
    
    let productoParaCarrito;
    if (productoBase) {
        productoParaCarrito = new Producto(
            productoBase.id, 
            productoBase.nombre, 
            productoBase.precio, 
            productoBase.img, 
            productoBase.descripcion
        );
    } else {
        const tarjeta = btn.closest(".tarjeta")
        const nombre = tarjeta.querySelector("h3").textContent.trim()
        const precioTexto = tarjeta.querySelector(".tarjeta-cuerpo span, .tarjeta_cuerpo span").textContent.trim()
        const precio = parseInt(precioTexto.replace(/[^0-9]/g, ""))
        const img = tarjeta.querySelector("img").getAttribute("src")
        productoParaCarrito = new Producto(nombre, nombre, precio, img, "")
    }
    carrito.agregar(productoParaCarrito);
    carrito.guardarEnStorage();
    carrito.mostrarProductos();
})

document.addEventListener("DOMContentLoaded", () => {
    const inputBuscador = document.getElementById("input_buscador");
    const contenedorResultados = document.getElementById("resultados_busqueda");

    if (inputBuscador && contenedorResultados) {
        inputBuscador.addEventListener("input", (e) => {
            const textoBusqueda = e.target.value.toLowerCase().trim();
            contenedorResultados.innerHTML = "";

            if (textoBusqueda === "") return;

            const resultados = controlador_productos.listaProductos.filter(prod =>
                prod.nombre.toLowerCase().includes(textoBusqueda) ||
                prod.descripcion.toLowerCase().includes(textoBusqueda)
            );

            if (resultados.length === 0) {
                contenedorResultados.innerHTML = "<p class='text-muted mt-3'>No encontramos productos con esa búsqueda.</p>";
                return;
            }

            resultados.forEach(producto => {
                const col = document.createElement("div");
                col.className = "col-12 col-md-6 col-lg-4 d-flex";
                col.innerHTML = `
                    <div class="d-flex align-items-center w-100 p-2 border">
                        <img src="${imgPath(producto.img)}" alt="${producto.nombre}" style="width: 70px; height: 90px; object-fit: cover;" class="me-3">
                        <div>
                            <h6 class="mb-1 fw-bold text-dark" style="font-size: 0.9rem;">${producto.nombre}</h6>
                            <span class="text-muted" style="font-size: 0.9rem;">$${producto.precio}</span>
                            <div class="mt-2 text-decoration-underline text-dark" style="font-size: 0.8rem; cursor: pointer;">Ver producto</div>
                        </div>
                    </div>
                `;
                contenedorResultados.appendChild(col);
            });
        });
    }

    // Simulated login alert
    const btnIngresar = document.getElementById("btn-ingresar");
    if (btnIngresar) {
        btnIngresar.addEventListener("click", (e) => {
            e.preventDefault();
            alert("¡Iniciaste sesión correctamente en SPACEFIT!");
            const modalElement = document.getElementById("modalCuenta");
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        });
    }

    // Simulated register alert
    const btnRegistrarse = document.getElementById("btn-registrarse");
    if (btnRegistrarse) {
        btnRegistrarse.addEventListener("click", (e) => {
            e.preventDefault();
            alert("¡Cuenta creada con éxito! Bienvenido a SPACEFIT.");
            const modalElement = document.getElementById("modalCuenta");
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        });
    }

    // Toggle login / registro modal
    const btnMostrarRegistro = document.getElementById("btn-mostrar-registro");
    const btnMostrarLogin = document.getElementById("btn-mostrar-login");
    const vistaLogin = document.getElementById("vista-login");
    const vistaRegistro = document.getElementById("vista-registro");

    if (btnMostrarRegistro && btnMostrarLogin && vistaLogin && vistaRegistro) {
        btnMostrarRegistro.addEventListener("click", () => {
            vistaLogin.classList.add("d-none");
            vistaRegistro.classList.remove("d-none");
        });

        btnMostrarLogin.addEventListener("click", () => {
            vistaRegistro.classList.add("d-none");
            vistaLogin.classList.remove("d-none");
        });
    }
});