//LA API FETCH PROPORCIONA UNA INTERFAZ PARA RECUPERAR RECURSOS (INCLUSO, A TRAVÉS DE LA RED)
//EXPRESS JS -> Permite crear APIs y aplicaciones web fácilmente, provee un conjunto de características como manejo de rutas (direccionamiento), archivos estáticos, uso de motor de plantillas, integración con bases de datos, manejo de errores, middlewares entre otras.
//MIDDLEWARES -> Lógica de intercambio de información entre aplicaciones (req y res)

let salir_busq = document.querySelector("#salir_busqueda");
salir_busq.disabled = true;
// salir_busq.style.display = 'none';
//ASIGNACIÓN DE VARIABLES A ELEMENTOS DEL DOM
let titulo = document.querySelector("#titulo");
let seccion_producto = document.querySelector("#producto");
let descripcion = document.querySelector("#desc");
let url_imagen = document.querySelector("#dirImg");
let precio = document.querySelector("#precio");
let boton_uno = document.querySelector("#btn_uno");
let boton_dos = document.querySelector("#btn_dos");

let productos = [];
let item;   //VARIABLE PARA EL OBJETO PRODUCTO, QUE SE EMPLEA EN MODIFICAR Y AGREGAR

//FUNCIÓN PARA BUSCAR LOS PRODUCTOS EN EL SERVIDOR - METHOD GET
//RECIBE EN btns LAS LEYENDAS "con botones" O "sin botones"
function traeProductos(btns) {
    fetch('/productos/')
        .then(response => response.json())
        .then(data => {
            if (data === null) {
                document.querySelector("#producto").innerHTML = "";
            } else {
                armaTemplate(data, btns);
            }
        })
}

//ARMA LOS PRODUCTOS EN EL INDEX.HTML CON BOTONES O SIN, SEGÚN btns
function armaTemplate(data, btns) {
    let template = "";
    productos = data;   //ASIGNA LA DATA TRAÍDA DE LA BD AL ARRAY GLOBAL PRODUCTOS
    for (let i = 0; i < productos.length; i++) {
        let producto = productos[i];
        if (btns === "con botones") {
            template += `<article>
                            <div class="trash" onclick="eliminarItem(${producto.id})"><img src="eliminar.png"></div>
                            <div class="edit" onclick="editarItem(${producto.id})"><img src="edit1.png"></div>
                            <h3 class="descripcion">${producto.descripcion}</h3>
                            <img src="${producto.imagen}" class="imagen">
                            <p>Precio ${new Intl.NumberFormat('es-AR').format(producto.precio)}</p>
                        </article>`;
        } else {
            template += `<article>
                            <h3 class="descripcion">${producto.descripcion}</h3>
                            <img src="${producto.imagen}" class="imagen">
                            <p>Precio ${new Intl.NumberFormat('es-AR').format(producto.precio)}</p>
                        </article>`;
        }
    }
    document.querySelector("#producto").innerHTML = template;
}

//LISTADO, LEE DE LA BASE DE DATOS, Y ARMA LA VENTANA MODAL - METHOD GET
//PODRÍA HABER LEIDO DE LA TABLA PRODUCTOS, PERO SE PRACTICÓ EL GET
//SE LLAMA MODAL, PORQUE SE SUPERPONE AL SITIO Y HAY QUE CERRARLA PARA VOLVER AL MISMO 
function listado() {
    //MUESTRA LA VENTANA MODAL
    modal.style.opacity = 1;
    modal.style.visibility = "visible";
    fetch('/productos/')
        .then(response => response.json())
        .then(data => armaModal(data));
}

//FUNCION DERIVADA DE LISTADO MODAL QUE ARMA LA VENTANA PROPIA
function armaModal(productos) {
    let html = "<table><thead><th>Descripción </th><th>Imagen </th><th>Precio </th></thead><tbody>";
    for (let i = 0; i < productos.length; i++) {
        let producto = productos[i];
        html += `<tr><td>${producto.descripcion}</td><td><img src="${producto.imagen}"></td><td>${new Intl.NumberFormat('es-AR').format(producto.precio)}</td></tr>`;
    }
    html += "</tbody></table>";
    document.querySelector(".tabla").innerHTML = html;
}

//FUNCIÓN PARA ELIMINAR PRODUCTOS - METHOD DELETE
let eliminarItem = (nroProd) => {
    console.log("Borrando registro: ", nroProd);
    fetch('/productos/' + nroProd, { method: 'DELETE' })
        .then(Swal.fire('Producto borrado'))
        .then(traeProductos("con botones"))

}

//FUNCIÓN PARA EDITAR PRODUCTOS EN PANTALLA
//DE ACEPTAR LA MODIFICACIÓN, LLAMA A LA FUNCION MODIFICAR()
let editarItem = (nroProd) => {
    console.log("Actualizando registro: ", nroProd);
    console.log("Productos: ", productos);
    traeProductos("sin botones");
    document.querySelector("#titulo").innerHTML = "Edición de Producto";
    boton_uno.value = "Modificar";
    boton_uno.classList.add("color_green");
    boton_dos.value = "Cancelar";
    boton_dos.classList.add("color_red");
    boton_uno.setAttribute("onclick", `modificar(${nroProd})`);
    boton_dos.setAttribute("onclick", "limpiar_cancelar()");
    let producto = productos.find(element => element.id === nroProd);
    console.log("Producto a edición: ", producto);
    descripcion.value = producto.descripcion;
    url_imagen.value = producto.imagen;
    precio.value = producto.precio;
}

//FUNCIÓN PARA ESTABLECER LA MODIFICACIÓN DEL PRODUCTO EN LA BASE DE DATOS - METHOD PUT
function modificar(nroProd) {
    console.log("Modificando registro: ", nroProd);
    let des = descripcion.value.trim();
    let img = url_imagen.value.trim();
    let pre = precio.value.trim();
    if (des.length === 0 || img.length === 0 || pre.length === 0) return;
    //item = productos.find(element => element.id === nroProd);
    //let posicion = productos.indexOf(item);
    item = {
        'id': nroProd,
        'descripcion': des,
        'imagen': img,
        'precio': Number(pre),
    };
    //productos.splice(posicion, 1, item);    //REEMPLAZO EL PRODUCTO EN EL ARRAY

    fetch('/productos/' + nroProd, {
        method: "PUT",
        body: JSON.stringify(item),
        headers: { "Content-type": "application/json; charset=UTF-8" },
    })
        .then(response => response.json())
        .then(json => console.log(json))
        .then(Swal.fire('Producto actualizado'))
        .then(traeProductos("con botones"))

    limpiar_cancelar();
}

//FUNCIÓN PARA AGREGAR UN PRODUCTO A LA BASE DE DATOS - METHOD POST
function agregar() {
    console.log("Agregando registro");

    let des = descripcion.value.trim();
    let img = url_imagen.value.trim();
    let pre = precio.value.trim();
    if (des.length === 0 || img.length === 0 || pre.length === 0) return;

    item = {
        'id': 0,
        'descripcion': des,
        'imagen': img,
        'precio': Number(pre),
    };


    fetch('/productos/', {
        method: "POST",
        body: JSON.stringify(item),
        headers: { "Content-type": "application/json; charset=UTF-8" },
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .then(Swal.fire('Producto incorporado'))

        .then(traeProductos("con botones"))

    limpiar_cancelar();

}

//FUNCION PARA BUSCAR PRODUCTOS EN LA BASE DE DATOS - METHOD GET - (EN INDEX.JS -> SELECT LIKE)
function busqueda() {
    document.querySelector("#agrego").classList.add("disable");
    salir_busq.disabled = false;
    let aBuscar = document.querySelector("#aBuscar").value;
    if (aBuscar.trim().length === 0) {
        traeProductos("sin botones");
    } else {
        console.log("Leyendo con select lo pedido");
        fetch('/productos/' + aBuscar, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                armaTemplate(data, "sin botones")
            });
    }
}

function salir_busqueda() {
    aBuscar.value = "";
    traeProductos("con botones");
    document.querySelector("#agrego").classList.remove("disable");
    salir_busq.disabled = true;
}

function limpiar_cancelar() {
    descripcion.value = "";
    url_imagen.value = "";
    precio.value = "";
    titulo.innerHTML = "Nuevo Producto";
    boton_uno.value = "Agregar";
    boton_uno.classList.remove("color_green");
    boton_dos.value = "Listado";
    boton_dos.classList.remove("color_red");
    boton_uno.setAttribute("onclick", "agregar()");
    boton_dos.setAttribute("onclick", "listado()");
    traeProductos("con botones");
}

//FUNCIÓN PARA BORRAR LA TABLA DE LA BASE DE DATOS - METHOD DELETE (SE PODRÍA HABER USADO OTRO)
function dropTable() {
    console.log('Estoy en Drop Table');
    fetch('/productos/', { method: 'DELETE' },
    )
        .then(Swal.fire('Tabla productos borrada'))
        .then(document.querySelector("#producto").innerHTML = "")
        .then(createTableProductos())
}

//FUNCIÓN PARA CREAR EVENTUALMENTE LA TABLA PRODUCTOS - METHOD POST (SE PODRÍA HABER USADO OTRO) - OBSERVAR EL CAMBIO DE RUTA
function createTableProductos() {
    fetch('/create/', {
        method: "POST",
        body: JSON.stringify({ "tabla": "productos" }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
    })
        .then(response => response.json())
        .then(console.log("Tabla productos verificada o creada"))
}

//FUNCTION MAIN - DONDE SE INICIA TODO
(function main() {
    createTableProductos();
    traeProductos("con botones");
})();
