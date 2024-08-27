const { Router } = require("express");
const CartsManager = require("../dao/CartsManager.js");
const ProductsManager = require("../dao/ProductsManager.js");

const router = Router();

CartsManager.path = "./src/data/carrito.json";

router.post("/", async (req, res) => {

    const { products = [] } = req.body;


    let carts = await CartsManager.getCarts();

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

    console.log("Productos del carrito '" + cid + "'", cart.products);

    res.setHeader('Content-type', 'application/json');
    return res.status(200).json({ payload: cart.products });

});


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

module.exports = { router };

