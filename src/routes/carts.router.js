const { Router } = require("express");
const CartsManager = require("../dao/CartsManager.js");
const ProductsManager = require("../dao/ProductsManager.js");

const router = Router();

CartsManager.path = "./src/data/carrito.json";


// Agregar un nuevo carrito.
// Notas: Id autoincremental (No pasar desde el Body). products es un arreglo que contendra los objetos de productos. 
// Ejemplo (App: Posman Metodo: POST Opcion: BODY SubOpcion: RAW tipo: JSON): url: http://localhost:8080/api/carts
// {"products": [] }  *** Para probar Error
// {"products": [ { "product": 7, "quantity": 3 }  ] }
router.post("/", async (req, res) => {

    const { products = [] } = req.body;
    //console.log("products: ", products);

    //Validaciones
    if (!products) {
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ error: 'Por favor agregue productos al carrito.' });
    }

    if (products.length === 0) {
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ error: 'Por favor agregue productos al carrito.' });
    }

    let carts = await CartsManager.getCarts();

    //Al agregar producto nuevo es necesario fijar un valor inicial de id para el arreglo nuevo,
    //si el arreglo ya contiene datos el id debe ser autoincremental. 
    let id = 1;
    if (carts.length > 0) {
        id = carts[carts.length - 1].id + 1;
    }

    try {
        let cartnuevo = await CartsManager.addCart({ products });

        console.log("Carrito Nuevo: ", cartnuevo);

        res.setHeader('Content-type', 'application/json');
        return res.status(200).json({ cartnuevo });

    } catch (error) {
        console.log(error);
        res.setHeader('Content-type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor, vuelva a intentar mas tarde.`,
            detalle: `${error.message}`
        });
    }
});



// Listar solo los productos del carrito con el id proporcionado.
// Ejemplo: (App: Posman Metodo: GET tipo: JSON): http://localhost:8080/api/carts/2
router.get("/:cid", async (req, res) => {
    let { cid } = req.params;
    cid = Number(cid);

    if (isNaN(cid)) {
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ error: `Debe ingresar un Id numerico.` });
    }

    let carts;

    try {
        carts = await CartsManager.getCarts();
    } catch (error) {
        console.log(error);
        res.setHeader('Content-type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor, vuelva a intentar mas tarde.`,
            detalle: `${error.message}`
        });
    }

    let cart = carts.find(idc => idc.id === cid);

    if (!cart) {
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ error: `ID Cart ${cid} not found.` });
    }

    // "cart.products" para solo los productos del carrito proporcionado, si se desea ver todos los atributos usar "cart"
    console.log("Productos del carrito '" + cid +"'", cart.products);

    res.setHeader('Content-type', 'application/json');
    return res.status(200).json({ payload: cart.products });

});


// Agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
// product [id producto], quantity [cantidad unidades del producto]
//
// Ejemplo (App: Posman Metodo: POST Opcion: BODY SubOpcion: RAW tipo: JSON): url: http://localhost:8080/api/carts/2/product/1
//{"products": [ { "quantity": 1 }  ] }
router.post("/:cid/product/:pid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    if (isNaN(cid) || isNaN(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Los ids deben ser numericos.` })
    }

    carts = await CartsManager.getCarts();
    let cart = carts.find(c => c.id === cid)
    if (!cart) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Carrito inexistente ${cid}` })
    }

    let prodss = await ProductsManager.getProducts();
    let existe = prodss.find(c => c.id === pid)
    if (!existe) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Producto ${pid} inexistente...!!!` })
    }

    try {
        await CartsManager.addProductToCart(cid, pid);
        res.setHeader('Content-type', 'application/json');
        res.status(200).json('Producto agregado al carrito');
    } catch (error) {
        res.setHeader('Content-type', 'application/json');
        res.status(500).send('Error al agregar el producto al carrito');
    }

});


// Listar todos los carritos de la base y su contenido. Incluye uso de limit y skip (con sus validaciones).
// Ejemplo sin limit y skip: (App: Posman Metodo: GET tipo: JSON): http://localhost:8080/api/carts
// Ejemplo con limit y skip: (App: Posman Metodo: GET tipo: JSON): http://localhost:8080/api/carts?limit=2&skip=2
router.get("/", async (req, res) => {
    let carts;

    try {
        carts = await CartsManager.getCarts();
    } catch (error) {
        console.log(error);
        res.setHeader('Content-type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor, vuelva a intentar mas tarde.`,
            detalle: `${error.message}`
        });
    }

    let { limit, skip } = req.query;

    if (limit) {
        limit = Number(limit);
        if (isNaN(limit)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `El argumento limit debe ser numerico.` });
        }
    } else {
        limit = carts.length;
    }

    if (skip) {
        skip = Number(skip);
        if (isNaN(skip)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `El argumento skip debe ser numerico.` });
        }
    } else {
        skip = 0;
    }

    let resultado = carts.slice(skip, skip + limit);

    res.setHeader('Content-type', 'application/json');
    return res.status(200).json({ resultado });
});

module.exports = { router };

