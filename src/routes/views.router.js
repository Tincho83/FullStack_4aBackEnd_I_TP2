const { Router } = require("express");
const ProductsManager = require("../dao/ProductsManager.js");

const router = Router();

router.get("/", (req, res) => {
    console.log("url: ", req.url);
    let titulo = "Bienvenido al Portal de Acceso a Productos";
    res.setHeader('Content-type', 'text/html');
    res.status(200).render("home", { titulo });
});

router.get('/products', async (req, res) => {

    let { detalle } = req.query;
    if (detalle) {
        console.log(detalle);
    }

    let titulo = "Productos";
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


    res.setHeader('Content-type', 'text/html');
    res.status(200).render("index", {
        detalle,
        titulo,
        prodss
    });
})

router.get('/realtimeproducts', async (req, res) => {

    let { detalle } = req.query;
    if (detalle) {
        console.log(detalle);
    }

    let titulo = "Productos en tiempo Real";
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

    res.setHeader('Content-type', 'text/html');
    res.status(200).render("realTimeProducts", {
        titulo,
        prodss
    });
});

module.exports = { router };


