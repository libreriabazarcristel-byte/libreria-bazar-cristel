import { db, auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===============================
// INICIAR SESIÓN
// ===============================

window.iniciarSesion = async function () {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensajeLogin");

    if (!email || !password) {
        mensaje.textContent = "⚠️ Completa tu correo y contraseña.";
        return;
    }

    try {

        await signInWithEmailAndPassword(auth, email, password);

        mensaje.textContent = "✅ Sesión iniciada correctamente.";

    } catch (error) {

        console.error(error);

        mensaje.textContent =
            "❌ Correo o contraseña incorrectos.";

    }
};


// ===============================
// COMPROBAR SESIÓN
// ===============================

onAuthStateChanged(auth, (usuario) => {

    const login = document.getElementById("login");
    const panel = document.getElementById("panelAdmin");

    if (usuario) {

        console.log("Administrador conectado:", usuario.email);

        if (login) {
            login.style.display = "none";
        }

        if (panel) {
            panel.style.display = "block";
        }

        cargarProductos();

    } else {

        if (login) {
            login.style.display = "block";
        }

        if (panel) {
            panel.style.display = "none";
        }

    }

});


// ===============================
// AGREGAR PRODUCTO
// ===============================

window.agregarProducto = async function () {

    const nombre = document.getElementById("nombre").value;
    const categoria = document.getElementById("categoria").value;
    const precio = document.getElementById("precio").value;
    const descripcion = document.getElementById("descripcion").value;

    if (!nombre || !precio) {
        alert("⚠️ Completa el nombre y el precio.");
        return;
    }

    try {

        await addDoc(collection(db, "productos"), {

            nombre: nombre,
            categoria: categoria,
            precio: Number(precio),
            descripcion: descripcion,
            imagen_url: document.getElementById("imagen").value

        });

        alert("✅ Producto agregado correctamente.");

        document.getElementById("nombre").value = "";
        document.getElementById("precio").value = "";
        document.getElementById("descripcion").value = "";

        cargarProductos();

    } catch (error) {

        console.error("Error al guardar:", error);

        alert("❌ No se pudo guardar el producto.");

    }

};


// ===============================
// CARGAR PRODUCTOS
// ===============================

async function cargarProductos() {

    const lista = document.getElementById("listaProductos");

    if (!lista) return;

    lista.innerHTML = "Cargando productos...";

    try {

        const consulta = await getDocs(
            collection(db, "productos")
        );

        lista.innerHTML = "";

        consulta.forEach((producto) => {

            const datos = producto.data();

            const div = document.createElement("div");

            div.innerHTML = `
                <div>
                    <strong>${datos.nombre}</strong>
                    <br>
                    Categoría: ${datos.categoria}
                    <br>
                    Precio: S/ ${Number(datos.precio).toFixed(2)}
                    <br>
                    ${datos.descripcion || ""}
                    <br><br>

                    <button onclick="eliminarProducto('${producto.id}')">
                        🗑️ Eliminar
                    </button>
                    <button onclick="editarProducto('${producto.id}')">
    ✏️ Editar
</button>

                    <hr>
                </div>
            `;

            lista.appendChild(div);

        });

    } catch (error) {

        console.error(error);

        lista.innerHTML =
            "❌ No se pudieron cargar los productos.";

    }

}


// ===============================
// ELIMINAR PRODUCTO
// ===============================

window.eliminarProducto = async function (id) {

    if (!confirm("¿Seguro que quieres eliminar este producto?")) {
        return;
    }

    try {

        await deleteDoc(
            doc(db, "productos", id)
        );

        alert("✅ Producto eliminado.");

        cargarProductos();

    } catch (error) {

        console.error(error);

        alert("❌ No se pudo eliminar el producto.");

    }

};
// ===============================
// EDITAR PRODUCTO
// ===============================

window.editarProducto = async function(id) {

    const nombre = prompt("Nombre del producto:");

    if (!nombre) {
        return;
    }

    const categoria = prompt(
        "Categoría:\nCuadernos, Lapiceros, Colores, Manualidades u Otros"
    );

    if (!categoria) {
        return;
    }

    const precio = prompt("Precio:");

    if (!precio) {
        return;
    }

    const descripcion = prompt("Descripción:");

    const imagen = prompt("Enlace de la imagen:");


    try {

        const { updateDoc } =
            await import(
                "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
            );

        await updateDoc(
            doc(db, "productos", id),
            {
                nombre: nombre,
                categoria: categoria,
                precio: Number(precio),
                descripcion: descripcion || "",
                imagen_url: imagen || ""
            }
        );

        alert("✅ Producto actualizado correctamente.");

        cargarProductos();

    } catch (error) {

        console.error("Error al editar:", error);

        alert("❌ No se pudo actualizar el producto.");

    }

};