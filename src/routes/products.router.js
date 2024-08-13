const { Router } = require("express");
const ProductsManager = require("../dao/ProductsManager.js");

const router = Router();

ProductsManager.path = "./src/data/productos.json";

// Listar todos los productos de la base. Incluye uso de limit y skip (con sus validaciones).
// Ejemplo sin limit y skip: (App: Posman Metodo: GET tipo: JSON): http://localhost:8080/api/products
// Ejemplo con limit y skip: (App: Posman Metodo: GET tipo: JSON): http://localhost:8080/api/products?limit=19&skip=7
router.get("/", async (req, res) => {
    let prodss;

    try {
        prodss = await ProductsManager.getProducts();
    } catch (error) {
        console.log(error);
        res.setHeader('Content-type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor, vuelva a intentar mas tarde o contacte con el administrador.`,
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
        limit = prodss.length;
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

    let resultado = prodss.slice(skip, skip + limit);

    res.setHeader('Content-type', 'application/json');
    return res.status(200).json({ resultado });
});


// Listar solo el producto con el id proporcionado.
// Ejemplo: (App: Posman Metodo: GET tipo: JSON): http://localhost:8080/api/products/3
router.get("/:pid", async (req, res) => {
    let { pid } = req.params;
    pid = Number(pid);

    if (isNaN(pid)) {
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ error: `Debe ingresar un Id numerico.` });
    }

    let prods;

    try {
        prods = await ProductsManager.getProducts();
    } catch (error) {
        console.log(error);
        res.setHeader('Content-type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor, vuelva a intentar mas tarde.`,
            detalle: `${error.message}`
        });
    }

    let prod = prods.find(idp => idp.id === pid);

    if (!prod) {
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ error: `ID Product ${pid} not found.` });
    }

    res.setHeader('Content-type', 'application/json');
    return res.status(200).json({ payload: prod });

});


// Agregar un nuevo producto.
// Notas: Id autoincremental (No pasar desde el Body). Status es true por defecto. Thumbnails es un arreglo. 
//        Todos los atributos son obligatorios excepto thumbnails. No se permite el ingreso de un producto con atributo "code" ya existente.
// Ejemplo (App: Posman Metodo: POST Opcion: BODY SubOpcion: RAW tipo: JSON): url: http://localhost:8080/api/products
// {"title":"Queso", "description":"Queso Cremoso", "code":"QuesoAR", "price":14000, "stock": 3, "category": "Queso"}
router.post("/", async (req, res) => {

    // Status es true por defecto. 
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

    // Todos los campos son obligatorios, a excepcion de thumbnails.
    if (!title || !description || !code || !price || !stock || !category) {
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ error: 'Por favor complete todos los atributos, son obligatorios, excepto thumbnails' });
    }

    let prods = await ProductsManager.getProducts();

    //Almacenamos en variable si el codigo de producto existe. 
    let existe = prods.find(prod => prod.code.toLowerCase() === code.toLowerCase());

    if (existe) {
        console.log("Producto Existente: ", existe);        
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ error: `Ya existe un producto con codigo ${code}` });
    } else {
        console.log("Producto Existente: No");
    }

    //Al agregar producto nuevo es necesario fijar un valor inicial de id para el arreglo nuevo,
    //si el arreglo ya contiene datos el id debe ser autoincremental. 
    let id = 1;
    if (prods.length > 0) {
        id = prods[prods.length - 1].id + 1;
    }

    try {
        let prodnuevo = await ProductsManager.addProduct({ title, description, code, price, status, stock, category, thumbnails });

        res.setHeader('Content-type', 'application/json');
        return res.status(200).json({ prodnuevo });

    } catch (error) {
        console.log(error);
        res.setHeader('Content-type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor, vuelva a intentar mas tarde.`,
            detalle: `${error.message}`
        });
    }

});


// Actualizar producto desde campos enviados desde el body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.
// Ejemplo (App: Posman Metodo: PUT Opcion: BODY SubOpcion: RAW tipo: JSON): url: http://localhost:8080/api/products/25 
// {"title":"Queso Tybo", "description":"Queso Tybo", "code":"QUES010", "price":14000, "stock": 3, "category": "Queso"}
// {"description":"Queso Tybo Amarillo", "price":14600}
router.put("/:pid", async (req, res) => {

    let { pid } = req.params;
    pid = Number(pid);
    if (isNaN(pid)) {
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ error: `Debe ingresar un Id numerico.` });
    }

    let prods;
    try {
        prods = await ProductsManager.getProducts();
    } catch (error) {
        console.log(error);
        res.setHeader('Content-type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor, vuelva a intentar mas tarde.`,
            detalle: `${error.message}`
        });
    }

    let prod = prods.find(idp => idp.id === pid);

    if (!prod) {
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ error: `ID Product ${pid} not found.` });
    }

    let { ...aModificar } = req.body; // tambien puede ser let aModificar = req.body;

    delete aModificar.id;

    // validaciones
    if (aModificar.name) {
        let existe = prods.find(prod => prod.name.toLowerCase() === aModificar.name.toLowerCase() && prod.id !== pid);

        if (existe) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `Name Product ${aModificar.name} ya existe.` });
        }
    }

    try {
        let prodModific = await ProductsManager.updateProduct(pid, aModificar);
        res.setHeader('Content-type', 'application/json');
        return res.status(200).json({ prodModific });
    } catch (error) {
        console.log(error);
        res.setHeader('Content-type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor, vuelva a intentar mas tarde.`,
            detalle: `${error.message}`
        });
    }
});


// Borra producto con el id proporcionado.
// Ejemplo (App: Posman Metodo: PUT Opcion: BODY SubOpcion: RAW tipo: JSON): url: http://localhost:8080/api/products/24
router.delete("/:pid", async (req, res) => {

    let { pid } = req.params;
    pid = Number(pid);
    if (isNaN(pid)) {
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ error: `Debe ingresar un Id numerico.` });
    }

    try {
        let prodresult = await ProductsManager.deleteProduct(pid);
        if (prodresult > 0) {
            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({ payload: `Producto Id ${pid} eliminado.` });
        } else {
            res.setHeader('Content-type', 'application/json');
            return res.status(500).json({ error: `Error al eliminar.` });
        }

    } catch (error) {
        console.log(error);
        res.setHeader('Content-type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor, vuelva a intentar mas tarde.`,
            detalle: `${error.message}`
        });
    }

});

module.exports = { router };

