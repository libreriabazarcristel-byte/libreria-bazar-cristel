import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let productos = [];
let categoriaActual = "Todos";

const productosContainer = document.getElementById("productos");
const buscador = document.getElementById("buscador");


// ===============================
// CARGAR PRODUCTOS DESDE FIREBASE
// ===============================

async function cargarProductos() {

    try {

        const consulta = await getDocs(
            collection(db, "productos")
        );

        productos = [];

        consulta.forEach((doc) => {

            productos.push({
                id: doc.id,
                ...doc.data()
            });

        });

        mostrarProductos();

    } catch (error) {

        console.error("Error al cargar productos:", error);

        if (productosContainer) {
            productosContainer.innerHTML = `
                <p>No se pudieron cargar los productos.</p>
            `;
        }
    }
}


// ===============================
// MOSTRAR PRODUCTOS
// ===============================

function mostrarProductos() {

    if (!productosContainer) {
        console.error("No se encontró el elemento #productos");
        return;
    }

    const texto = buscador
        ? buscador.value.toLowerCase()
        : "";

    const filtrados = productos.filter((producto) => {

        const nombre = (producto.nombre || "").toLowerCase();
        const categoria = (producto.categoria || "").toLowerCase();

        const coincideTexto =
            nombre.includes(texto) ||
            categoria.includes(texto);

        const coincideCategoria =
            categoriaActual === "Todos" ||
            categoria === categoriaActual.toLowerCase();

        return coincideTexto && coincideCategoria;
    });


    productosContainer.innerHTML = "";


    if (filtrados.length === 0) {

        productosContainer.innerHTML = `
            <p class="sin-productos">
                No se encontraron productos.
            </p>
        `;

        return;
    }


    filtrados.forEach((producto) => {

        const tarjeta = document.createElement("div");

        tarjeta.classList.add("producto");


        tarjeta.innerHTML = `
            
            <img
                src="${producto.imagen_url || "https://placehold.co/600x600?text=Producto"}"
                alt="${producto.nombre || "Producto"}"
            >

            <h3>
                ${producto.nombre || "Sin nombre"}
            </h3>

            <p class="categoria">
                ${producto.categoria || ""}
            </p>

            <p>
                ${producto.descripcion || ""}
            </p>

            <strong>
                S/ ${Number(producto.precio || 0).toFixed(2)}
            </strong>

            <button onclick="contactarWhatsApp('${producto.nombre || ""}')">
                💬 Consultar por WhatsApp
            </button>

        `;

        productosContainer.appendChild(tarjeta);

    });

}


// ===============================
// FILTRAR POR CATEGORÍA
// ===============================

window.filtrarCategoria = function(categoria) {

    categoriaActual = categoria;

    mostrarProductos();

};


// ===============================
// BUSCADOR
// ===============================

if (buscador) {

    buscador.addEventListener("input", () => {

        mostrarProductos();

    });

} else {

    console.warn(
        "No se encontró el buscador #buscador"
    );

}


// ===============================
// WHATSAPP
// ===============================

window.contactarWhatsApp = function(nombreProducto) {

    const numero = "51999999999";

    const mensaje =
        `Hola, quisiera consultar por el producto: ${nombreProducto}`;

    const url =
        `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");

};


// ===============================
// INICIAR
// ===============================

cargarProductos();