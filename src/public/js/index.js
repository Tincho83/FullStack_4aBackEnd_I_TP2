const socket = io();

let divHora = document.getElementById("hhmm");

socket.on("HoraServidor", datosrecib => {
    divHora.textContent = `Hora: ${datosrecib}`;
});

socket.on("nuevoProducto", nuevoProd => {
    console.log(`RealtimeProd. Se creo el producto "${nuevoProd.title} - ${nuevoProd.code}"`, nuevoProd);
    agregarProductoAlDOM(nuevoProd);
});


socket.on("ProductoActualizado", Prodactuald => {
    console.log('RealtimeProd. Producto actualizado:', Prodactuald);
    actualizarProductoEnDOM(Prodactuald);
});


socket.on("ProductoBorrado", Prodborrado => {
    console.log('RealtimeProd. Producto borrado:', Prodborrado);
    eliminarProductoDelDOM(Prodborrado);
});

// Función para agregar un nuevo producto al DOM
function agregarProductoAlDOM(product) {
    const productList = document.getElementById('product-list');

    // Verifica si productList existe
    if (!productList) {
        console.error('El elemento con id "product-list" no existe en el DOM.');
        return;
    }

    const newItem = document.createElement('div');
    newItem.className = 'divCardItem';
    newItem.style.display = 'flex';
    newItem.style.justifyContent = 'center';
    newItem.style.alignItems = 'center';
    newItem.dataset.id = product.id;

    let disp = product.status ? "Si" : "No";

    let img = "";
    let alt = "";
    if (product.thumbnails > 0) {
        alt = product.title;
        img = product.th.urlmain;

    } else {
        img = "https://media.istockphoto.com/id/1216251206/vector/no-image-available-icon.jpg?s=612x612&w=0&k=20&c=6C0wzKp_NZgexxoECc8HD4jRpXATfcu__peSYecAwt0=";
        alt = "Sin Imagen";
    }

    newItem.innerHTML = `
        <div class="CardItem" style="max-width: 300px;">
            <div style="position: relative;">
                <p>Disponible: ${disp}</p>
            </div>
            <div class="Header">
                <img src="${img}" alt="${alt}" style="border-radius: 12px;" class="ImgPic" />
                <div class="ItemData" style="margin-top: 24px; spacing: 12px;">
                    <p>${product.category}</p>
                    <h3 style="font-size: 1.5rem;">${product.title} - ${product.code}</h3>
                    <p style="color: #007BFF; font-size: 24px;">Price: $ ${product.price}</p>
                </div>
            </div>            
        </div>
    `;

    productList.appendChild(newItem);
}
// ***************************************************

function actualizarProductoEnDOM(product) {
    const productElement = document.querySelector(`[data-id="${product.id}"]`);
    console.log(productElement);

    if (productElement) {
        productElement.querySelector('.ItemData p').innerText = product.category;
        productElement.querySelector('.ItemData h3').innerText = `${product.title} - ${product.code}`;
        productElement.querySelector('.ItemDataPrice').innerText = `Price: $ ${product.price}`;

        const btnModify = productElement.querySelector('#btnModify');
        if (btnModify) {
            btnModify.setAttribute('onclick', `ModifyProduct(${product.id}, '${product.title}', '${product.description}', '${product.code}', ${product.price}, ${product.stock}, '${product.category}')`);
        }
    }
}

// Función para eliminar un producto del DOM
function eliminarProductoDelDOM(productId) {
    const productItem = document.querySelector(`[data-id="${productId}"]`);
    if (productItem) {
        productItem.remove();        
    }
}
// ***************************************************




