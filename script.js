const productosConteiner = document.querySelector(".productos-container")
const carrito = []
const conteinerCantidad = document.querySelector("#conteiner-cantidad")
const bodyModal = document.querySelector(".modal-body")
const confirmarCompra = document.querySelector(".confirmarCompra")
const input = document.querySelector("#searchInput")
const carritoRecuperado = function(){
    const nuevoCarrito = JSON.parse(localStorage.getItem("carrito"))
     return nuevoCarrito
    }


function abrirAlerta(mensaje, tipo) {
    Toastify({
        text: `${mensaje}`,  
        duration: 3000,
        close: true,
        position: "top-left",
        style: ({
            background: `${tipo}`
        })
        
    }).showToast();
}

// Borra el contenido actual de bodyModal y agrega el nuevo
function renderizar () {
    bodyModal.innerHTML = ''

    carritoRecuperado().forEach(producto => {
        const productoCarrito = document.createElement("a")
        productoCarrito.className = "list-group-item list-group-item-action active lista-grupo"
        productoCarrito.setAttribute('aria-current', 'true')
            productoCarrito.innerHTML = ` 
            <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${producto.nombre}</h5>
            <button class="eliminar-producto laX" data-nombre="${producto.nombre}">x</button>
            </div>
            <p class="mb-1">${producto.descripcion}</p>
            <small>$${producto.precio}</small>
            `;
        bodyModal.appendChild(productoCarrito)
    })
}
function local(carrito){
    localStorage.setItem("carrito", JSON.stringify(carrito))
    carritoRecuperado()
}
function cuantosProductos (){
    const cantidadProductos = document.querySelector("#cantidadProductos")
    cantidadProductos.innerText = carritoRecuperado().length
}
function eliminarDelCarrito(titulo){
    const productoAEliminar = carrito.find((prod)=> prod.nombre === titulo)
     carrito.splice (carrito.indexOf (productoAEliminar), 1) 
     renderizar()
}
async function cargarProductos(){
    const respuesta = await fetch("./productos.json")
    const productos = await respuesta.json()
    mostrarProductos(productos)
}
function mostrarProductos(array){
    array.forEach(producto => {
        const card = document.createElement("div")
        card.className = "card"
        card.innerHTML = `
            <img src=${producto.imagen} class="card-img-top" alt="${producto.nombre}">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">${producto.descripcion}</p>
                <h5 class="card-title centrar">$${producto.precio}</h5>
                <a tipo="button" class="btn btn-primary centrar añadirAlCarrito liveAlertBtn">Agregar al carrito</a>
            </div>
        `;
        productosConteiner.appendChild(card)
    
        const botonAgregarCarrito = card.querySelector(".añadirAlCarrito")
        // Agregar producto al carrito
        botonAgregarCarrito.addEventListener("click", () => {
            carrito.push(producto)
            abrirAlerta('El producto se agregó correctamente!', '#85b1f2')
                
            // Agrega el carrito al local
            local(carrito)

            cuantosProductos ()
            renderizar()
        })
    })
}
cargarProductos()
bodyModal.addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminar-producto')) {
        const nombreProducto = event.target.getAttribute('data-nombre');
        eliminarDelCarrito(nombreProducto);
        renderizar();
        cuantosProductos()
        local(carrito)
    }
});
confirmarCompra.addEventListener("click", () => {
    abrirAlerta("Gracias por tu compra!!", "#a3cfbb");
});

input.addEventListener("change", () => {
    productosConteiner.innerHTML = ""
    const inputValue = input.value
    fetch("./productos.json")
    .then(response => response.json())
    .then(data => {
        const productosFiltrados = data.filter((prod) => 
        prod.nombre.includes(inputValue))
        mostrarProductos(productosFiltrados)
    })
})
