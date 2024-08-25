// ********  Ejemplo WebSocket On (Escucha) ******************
// Genero la variable global "socket = io(); para inicializar el websocket.
// Genero la variable "divHora", donde obtendra los datos del elemento ID "hhmm".
// Escucho el websocket (socket.on...) y solo el componente "HoraServidor", pasando estos datos a la variable "datos".
// Establezco en la variable "divHora" y en su atributo del componente HTML "textcontent" los datos escuchados del websocket.
const socket = io(); // declarar una vez sobre el archivo.

let addstatus = true;
let divHora = document.getElementById("hhmm");

const inputTitle = document.getElementById("title");
const inputDescrip = document.getElementById("description");
const inputCode = document.getElementById("code");
const inputPrice = document.getElementById("price");
const inputStock = document.getElementById("stock");
const inputCateg = document.getElementById("category");
const btnSubmit = document.getElementById("btnSubmit");


// ************  Eventos DOM  *******************

// Agregar Producto desde Boton.
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
            alert('All fields are required.');
            return;
        }

        try {
            const response = await fetch(`/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            })//;
                .then(response => response.json())
                .then(data => {
                    socket.emit('ProductoAgregado', data);
                    alert('Product added successfully!');
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while trying to add the product.');
                });
            //
            /*
         if (response.ok) {
             alert('Product added successfully!');
             //socket.emit('productAdded', (product.title, product.code));
             //location.reload(); // Recarga la página para mostrar el nuevo producto
             const nuevoProducto = await response.json();
             socket.emit('nuevoProductoAgregado', nuevoProducto);
         } else {
             const error = await response.json();
             alert(`Failed to add product: ${error.message}`);
         }
         */
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while trying to add the product.');
        }

    } else {
    }
});




// ***************************************************





// ************  Funciones Principales  *******************

// Maneja el clic en el botón Modify
function ModifyProduct(id, title, description, code, price, stock, category) {

    addstatus = false;
    console.log(addstatus);
    // Cargar los datos del producto en el formulario
    document.getElementById('productId').value = id;
    document.getElementById('title').value = title;
    document.getElementById('description').value = description;
    document.getElementById('code').value = code;
    document.getElementById('price').value = price;
    document.getElementById('stock').value = stock;
    document.getElementById('category').value = category;

    // Cambiar el nombre del botón Submit a Modify Product
    const submitButton = document.getElementById('btnSubmit');
    submitButton.innerText = 'Modify Product';
    document.getElementById('btnSubmit').value = "Modify Product";

    // Cambiar la función del botón a modificar el producto existente
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

            console.log(updatedProductId);
            console.log(JSON.stringify(updatedProduct));
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
                    console.log("ver:", data);
                    if (data.success) {
                        alert('Product updated successfully!');
                        document.getElementById('btnSubmit').value = "Add Product";
                        socket.emit('updateProduct', data.product);
                    } else {
                        console.log("Error: ", data);
                        alert('Error updating product');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error updating product');
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

// Evento para eliminar un producto
function DeleteProduct(productId) {
    //console.log("Id: ", productId);
    // Mostrar una confirmación antes de eliminar
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    socket.emit('ProductoBorradoOtro', { id: productId });
                    eliminarProductoDelDOM(productId);
                    // Si la eliminación fue exitosa, hacer algo como recargar la página o eliminar el producto del DOM
                    alert('Product deleted successfully!');
                    // Aquí podrías recargar la página o eliminar el elemento del DOM
                    //socket.emit('productDeleted', productId);
                    //location.reload(); // Recarga la página
                    //socket.emit('ProductoBorradoOtro', { id: productId });
                } else {
                    return response.json().then(error => {
                        // Manejar el error devuelto por el servidor
                        alert(`Failed to delete product: ${error.message}`);
                    });
                }
            })
            .catch(error => {
                // Manejar cualquier error de red u otro tipo de fallo
                console.error('Error:', error);
                alert('An error occurred while trying to delete the product.');
            });
    }
}

// 
// Función para eliminar un producto del DOM
function eliminarProductoDelDOM(productId) {
    const productItem = document.querySelector(`[data-id="${productId}"]`);
    if (productItem) {
        productItem.remove();
    }
}


// Función para agregar un nuevo producto al DOM
function agregarProductoAlDOM(product) {
    const productList = document.getElementById('product-list');

    const newItem = document.createElement('div');
    newItem.className = 'divCardItem';
    newItem.style.display = 'flex';
    newItem.style.justifyContent = 'center';
    newItem.style.alignItems = 'center';
    newItem.setAttribute('data-id', product.id);

    newItem.innerHTML = `
        <div class="CardItem" style="max-width: 300px;">
            <div style="position: relative;">
                <p>Disponible: ${product.status ? 'Si' : 'No'}</p>
            </div>
            <div class="Header">
                ${product.thumbnails && product.thumbnails.length ?
            product.thumbnails.map(thumbnail => `<img src="${thumbnail.urlmain}" alt="${product.title}" style="border-radius: 12px;" class="ImgPic" />`).join('') :
            `<img src="https://media.istockphoto.com/id/1216251206/vector/no-image-available-icon.jpg?s=612x612&w=0&k=20&c=6C0wzKp_NZgexxoECc8HD4jRpXATfcu__peSYecAwt0=" alt="Sin Imagen" style="border-radius: 12px;" class="ImgPic" />`
        }
                <div class="ItemData" style="margin-top: 24px; spacing: 12px;">
                    <p>${product.category}</p>
                    <h3 style="font-size: 1.5rem;">${product.title} - ${product.code}</h3>
                    ${product.description ? `<p>${product.description}</p>` : ''}
                    <p style="color: #007BFF; font-size: 24px;">Price: $ ${product.price}</p>
                </div>
            </div>
            <div class="ItemCardFooter">
                <button onclick="DeleteProduct(${product.id})" id="btnDelete">Delete Product</button>
                <button onclick="ModifyProduct(${product.id})" id="btnModify">Modify Product</button>
            </div>        
        </div>
    `;

    productList.appendChild(newItem);
}


// ***************************************************

// ************  Escuchas WebSocket  *******************

/*
const btnSubmit=document.getElementById("btnSubmit");
btnSubmit.addEventListener("click", async(e)=>{
e.preventDefault();
let email;
})
*/
// A02. escucho señal de reloj y asigno a un componente DOM
socket.on("HoraServidor", datosrecib => {
    divHora.textContent = `Hora: ${datosrecib}`;
});
// ***************************************************

// B02.escucho señal y muestro en consola del navegador cliente el nuevo producto
socket.on("nuevoProducto", nuevoProd => {
    console.log(`Se creo el producto "${nuevoProd.title} - ${nuevoProd.code}", ${nuevoProd}`);

    // B03.emito señal del nuevo producto agregado para que escuche el backend
    // (app.js) y que este emita la señal a todos los navegadores excepto el
    // creador del producto.
    socket.emit("nuevoProductoAgregado", nuevoProd);
    agregarProductoAlDOM(nuevoProd);

});
/* desde aca

// Escuchar cuando se elimina un producto
socket.on("productoBorradoaTodos", prodBorradoTodos => {
    console.log(`Otro usuario eliminó el producto con ID ${prodBorradoTodos}`);
    //location.reload(); // Recarga la página para actualizar la lista de productos
    eliminarProductoDelDOM(prodBorradoTodos.id);

    /*
    const productItem = document.querySelector(`[data-id="${prodBorradoTodos.id}"]`);
    if (productItem) {
        productItem.remove();
    } hasta aca*/ /* desde aca
});

// Escuchar eventos de socket y actualizar la vista
socket.on('ProductoAgregado', (product) => {
console.log('Producto agregado:', product);
agregarProductoAlDOM(product); // Llamar a la función para agregar el producto al DOM
});

// Escuchar cuando se agrega un producto
socket.on('productAdded', (product) => {
location.reload(); // Recarga la página
});

// Escuchar cuando se elimina un producto
socket.on('productDeleted', (productId) => {
location.reload(); // Recarga la página
});

socket.on("ProductoBorrado", prodBorra => {
console.log(`Se creo el producto "${prodBorra}`);

socket.emit("ProductoBorradoOtro", prodBorra);
});

*/
//>>>>hasta aca

// B06.escucho cuando otro cliente agrega un producto a la base y muestro
//    el consola el producto.
//    socket.on("nuevoProductoAgregadoaTodos", nuevoProdAgregado => {
//    console.log(`Otro usuario creó el producto "${nuevoProdAgregado.title} - ${nuevoProdAgregado.code}"`);
//location.reload(); // Recarga la página para mostrar los nuevos productos
// B07.agrego producto al DOM
//    agregarProductoAlDOM(nuevoProdAgregado);

/*
const productList = document.getElementById('product-list');

const newItem = document.createElement('div');
newItem.className = 'divCardItem';
newItem.style.display = 'flex';
newItem.style.justifyContent = 'center';
newItem.style.alignItems = 'center';
newItem.setAttribute('data-id', nuevoProdAgregado.id);

newItem.innerHTML = `
    <div class="CardItem" style="max-width: 300px;">
        <div style="position: relative;">
            <p>Disponible: ${nuevoProdAgregado.status ? 'Si' : 'No'}</p>
        </div>
        <div class="Header">
            ${nuevoProdAgregado.thumbnails.length ?
        nuevoProdAgregado.thumbnails.map(thumbnail => `<img src="${thumbnail.urlmain}" alt="${nuevoProdAgregado.title}" style="border-radius: 12px;" class="ImgPic" />`).join('') :
        `<img src="https://media.istockphoto.com/id/1216251206/vector/no-image-available-icon.jpg?s=612x612&w=0&k=20&c=6C0wzKp_NZgexxoECc8HD4jRpXATfcu__peSYecAwt0=" alt="Sin Imagen" style="border-radius: 12px;" class="ImgPic" />`
    }
            <div class="ItemData" style="margin-top: 24px; spacing: 12px;">
                <p>${nuevoProdAgregado.category}</p>
                <h3 style="font-size: 1.5rem;">${nuevoProdAgregado.title} - ${nuevoProdAgregado.code}</h3>
                ${nuevoProdAgregado.description ? `<p>${nuevoProdAgregado.description}</p>` : ''}
                <p style="color: #007BFF; font-size: 24px;">Price: $ ${nuevoProdAgregado.price}</p>
            </div>
        </div>
        <div class="ItemCardFooter">
            <button onclick="DeleteProduct(${nuevoProdAgregado.id})" id="btnDelete">Delete Product</button>
            <button onclick="ModifyProduct(${nuevoProdAgregado.id})" id="btnModify">Modify Product</button>
        </div>
    </div>
`;

productList.appendChild(newItem);
*/
//});


// ***************************************************

/*

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Manejar la actualización de la lista de productos
    socket.on('productAdded', (product) => {
        const ul = document.getElementById('product-list');
        const li = document.createElement('li');
        li.textContent = `${product.title} - ${product.price}`;
        ul.appendChild(li);
    });

    socket.on('productDeleted', (id) => {
        const ul = document.getElementById('product-list');
        const items = ul.querySelectorAll('li');
        items.forEach((item) => {
            if (item.textContent.includes(`ID: ${id}`)) {
                ul.removeChild(item);
            }
        });
    });

    // Manejar el envío de productos
    document.getElementById('add-product-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const title = event.target.elements.title.value;
        const price = event.target.elements.price.value;

        socket.emit('addProduct', { title, price });
    });

    // Manejar la eliminación de productos
    document.getElementById('product-list').addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const id = event.target.dataset.id;
            socket.emit('deleteProduct', id);
        }
    });
});


*/