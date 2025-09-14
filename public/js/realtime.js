const socket = io();

// Actualizar lista de productos en tiempo real
socket.on("updateProducts", (products) => {
    const list = document.getElementById("product-list");
    list.innerHTML = products.length
        ? products.map(p => `<li>${p.title} - $${p.price}</li>`).join("")
        : '<li>No hay productos.</li>';
});

// Enviar nuevo producto
const addForm = document.getElementById("add-product-form");
addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addForm);
    const product = {
        title: formData.get("title"),
        price: Number(formData.get("price"))
    };
    socket.emit("addProduct", product);
    addForm.reset();
});

// Eliminar producto
const deleteForm = document.getElementById("delete-product-form");
deleteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = deleteForm.elements["id"].value;
    socket.emit("deleteProduct", id);
    deleteForm.reset();
});
