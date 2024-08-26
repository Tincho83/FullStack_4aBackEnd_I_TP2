// ********  Ejemplo WebSocket On (Escucha) ******************
// Genero la variable global "socket = io(); para inicializar el websocket.
const socket = io(); // declarar una vez sobre el archivo.
// ***************************************************



// *****  Declaracion de variables y constantes  *****
let addstatus = true;
let divHora = document.getElementById("hhmm");

const inputTitle = document.getElementById("title");
const inputDescrip = document.getElementById("description");
const inputCode = document.getElementById("code");
const inputPrice = document.getElementById("price");
const inputStock = document.getElementById("stock");
const inputCateg = document.getElementById("category");
const btnSubmit = document.getElementById("btnSubmit");
const productListDiv = document.getElementById("product-list");
// ***************************************************



// ****************  Eventos DOM  y Funciones Principales ***********************

// *** Agregar Producto desde Boton.
btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    //console.log("Agregar un Producto. ",addstatus);

    if (document.getElementById('btnSubmit').value == "Add Product") {
        addstatus = true;

        const product = {
            title: inputTitle.value,
            description: inputDescrip.value,
            code: inputCode.value,
            price: parseFloat(inputPrice.value),
            stock: parseInt(inputStock.value),
            category: inputCateg.value
        };

        // Validar que todos los campos estén completos
        if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
            alert('Comprobar datos ingresados. Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await fetch(`/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            })
                .then(response => {
                    response.json()
                })
                .then(data => {
                    alert('Producto agregado correctamente.');
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Ocurrio un error al intentar agregar un producto.');
                });
        } catch (error) {
            console.error('Error:', error);
            alert('Un error occurrio al intentar agregar el producto.');
        }
    } else {
    }
});


// *** Funcion modificar Producto desde Boton.
function ModifyProduct(id, title, description, code, price, stock, category) {

    addstatus = false;

    document.getElementById('productId').value = id;
    document.getElementById('title').value = title;
    document.getElementById('description').value = description;
    document.getElementById('code').value = code;
    document.getElementById('price').value = price;
    document.getElementById('stock').value = stock;
    document.getElementById('category').value = category;

    // Cambiar el nombre del boton Submit a 'Modify Product'
    const submitButton = document.getElementById('btnSubmit');
    submitButton.innerText = 'Modify Product';
    document.getElementById('btnSubmit').value = "Modify Product";

    // Cambiar la funcion del boton para modificar el producto existente
    submitButton.onclick = function (event) {
        if (document.getElementById('btnSubmit').value == "Modify Product") {

            event.preventDefault();
            const updatedProductId = {
                id: parseInt(document.getElementById('productId').value, 10)
            };
            const updatedProduct = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                code: document.getElementById('code').value,
                price: parseFloat(document.getElementById('price').value),
                stock: parseInt(document.getElementById('stock').value, 10),
                category: document.getElementById('category').value
            };

            //console.log(updatedProductId);
            //console.log(JSON.stringify(updatedProduct));

            // Enviar la solicitud PUT para actualizar el producto
            fetch(`/api/products/${updatedProductId.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            })
                .then(response => response.json())
                .then(data => {                    
                    if (data.success) {
                        alert('Producto actualizado exitosamente.');
                        document.getElementById('btnSubmit').value = "Add Product";                        
                    } else {
                        console.log("Error: ", data);
                        alert('Error al actualizar el producto');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al actualizar el producto');
                });

            document.getElementById('productId').value = "";
            document.getElementById('title').value = "";
            document.getElementById('description').value = "";
            document.getElementById('code').value = "";
            document.getElementById('price').value = "";
            document.getElementById('stock').value = "";
            document.getElementById('category').value = "";
        };
    }
}


// *** Borrar Producto desde Boton.
function DeleteProduct(productId) {
    //console.log("Id: ", productId);
    if (confirm(`Deseas borrar el producto id ${productId}?`)) {
        fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    eliminarProductoDelDOM(productId);
                    alert('Producto borrado correctamente.');
                } else {
                    return response.json().then(error => {
                        alert(`Hubo un fallo al querer borrar el producto: ${error.message}`);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrio un error al intentar borrar el producto.');
            });
    }
}
// ******************************************************************************



// ********************  Escuchas WebSocket y funciones ************************

// *****************************************************************************
// A02. escucho evento de reloj y asigno a un componente DOM
socket.on("HoraServidor", datosrecib => {
    divHora.textContent = `Hora: ${datosrecib}`;
});
// *****************************************************************************



// *****************************************************************************
// B002.escucho evento y muestro en consola del navegador cliente el nuevo producto
socket.on("nuevoProducto", nuevoProd => {
    //console.log(`Se creo el producto "${nuevoProd.title} - ${nuevoProd.code}"`, nuevoProd);
    /*
    socket.emit("agregProd", nuevoProd.title);
    socket.on("HuboCambiosC", dato =>{
    console.log("Otra sesion agrego el prod id: ", dato);
    });
    */

    agregarProductoAlDOM(nuevoProd);
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
    //newItem.setAttribute('data-id', product.id);

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
            <div class="ItemCardFooter">
                <button onclick="DeleteProduct(${product.id})" id="btnDelete">Delete Product</button>
                <button onclick="ModifyProduct(${product.id}, '${product.title}', '${product.description}', '${product.code}', ${product.price}, ${product.stock}, '${product.category}' )" id="btnModify">Modify Product</button>
            </div>        
        </div>
    `;

    productList.appendChild(newItem);
}
// *****************************************************************************



// *****************************************************************************
// C002.escucho evento y muestro en consola del navegador cliente el producto actualizado
socket.on("ProductoActualizado", Prodactuald => {
    //console.log('Producto actualizado:', Prodactuald);
    /*
    socket.emit("ActuaProd", Prodactuald);
    socket.on("HuboCambiosU", dato =>{
        console.log("Otra sesion actualizo el prod id: ", dato);
    });
    */

    //actualizar la vista en otras sesiones
    actualizarProductoEnDOM(Prodactuald);
});

// Funcion para actualizar un producto del DOM
function actualizarProductoEnDOM(product) {
    const productElement = document.querySelector(`[data-id="${product.id}"]`);

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
// *****************************************************************************



// *****************************************************************************
// D002.escucho evento de producto actualizado.
socket.on("ProductoBorrado", Prodborrado => {
    //console.log('Producto borrado:', Prodborrado);    
    /*
    socket.emit("borreProd", Prodborrado);
    socket.on("HuboCambiosD", dato =>{
        console.log("Otra sesion borro el prod id: ", dato);
    });
    */

    //actualizar la vista en otras sesiones
    eliminarProductoDelDOM(Prodborrado);
});


// Funcion para eliminar un producto del DOM
function eliminarProductoDelDOM(productId) {
    const productItem = document.querySelector(`[data-id="${productId}"]`);
    if (productItem) {
        productItem.remove();
    }
}
// *****************************************************************************

