const socket = io();

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

btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault();

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


function ModifyProduct(id, title, description, code, price, stock, category) {

    addstatus = false;

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    document.getElementById('productId').value = id;
    document.getElementById('title').value = title;
    document.getElementById('description').value = description;
    document.getElementById('code').value = code;
    document.getElementById('price').value = price;
    document.getElementById('stock').value = stock;
    document.getElementById('category').value = category;

    const submitButton = document.getElementById('btnSubmit');
    submitButton.innerText = 'Modify Product';
    document.getElementById('btnSubmit').value = "Modify Product";

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


function DeleteProduct(productId) {
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

socket.on("HoraServidor", datosrecib => {
    divHora.textContent = `Hora: ${datosrecib}`;
});

socket.on("nuevoProducto", nuevoProd => {
    agregarProductoAlDOM(nuevoProd);
});

function agregarProductoAlDOM(product) {
    const productList = document.getElementById('product-list');

    if (!productList) {
        console.error('El elemento con id "product-list" no existe en el DOM.');
        return;
    }

    const newItem = document.createElement('div');
    newItem.className = 'divCardItem';
    //newItem.style.display = 'flex';
    //newItem.style.justifyContent = 'center';
    //newItem.style.alignItems = 'center';
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
        <div class="CardItem">
            <div class="diviCartItem">
                <p>Disponible: ${disp}</p>
            </div>
            <div class="Header">
                <img src="${img}" alt="${alt}" class="ImgPic" />
                <div class="ItemData">
                    <p>${product.category}</p>
                    <h3 style="font-size: 1.5rem;">${product.title} - ${product.code}</h3>
                    <p class="ItemDataPrice">Price: $ ${product.price}</p>
                </div>
            </div>
            <div class="ItemCardFooter">
                <button onclick="DeleteProduct(${product.id})" id="btnDelete">Delete Product</button>
                <button onclick="ModifyProduct(${product.id}, '${product.title}', '${product.description}', '${product.code}', ${product.price}, ${product.stock}, '${product.category}')" id="btnModify">Modify Product</button>
            </div>        
        </div>
    `;

    productList.appendChild(newItem);
}


socket.on("ProductoActualizado", Prodactuald => {
    //console.log("Evento *ProductoActualizado* recibido", Prodactuald);
    actualizarProductoEnDOM(Prodactuald);
});

function actualizarProductoEnDOM(product) {
    const productElement = document.querySelector(`[data-id="${product.id}"]`);

    if (productElement) {
        //console.log("Producto encontrado en DOM, actualizando...");
        productElement.querySelector('.ItemData p').innerText = product.category;
        productElement.querySelector('.ItemData h3').innerText = `${product.title} - ${product.code}`;
        productElement.querySelector('.ItemDataPrice').innerText = `Price: $ ${product.price}`;

        const btnModify = productElement.querySelector('#btnModify');
        if (btnModify) {
            btnModify.setAttribute('onclick', `ModifyProduct(${product.id}, '${product.title}', '${product.description}', '${product.code}', ${product.price}, ${product.stock}, '${product.category}')`);
        }
    } else {
        //console.log("Producto no encontrado en el DOM");
    }
}


socket.on("ProductoBorrado", Prodborrado => {
    eliminarProductoDelDOM(Prodborrado);
});


function eliminarProductoDelDOM(productId) {
    const productItem = document.querySelector(`[data-id="${productId}"]`);
    if (productItem) {
        productItem.remove();
    }
}

let pFecha = document.getElementById("DateLastAccess");

formatCurrentDate();

function formatCurrentDate() {
    const today = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const formattedDate = formatter.format(today);

    pFecha.textContent = `Fecha de Último Acceso: ${formattedDate}`;
}
