const express = require("express");
const fs = require("fs");
const { router: productsRouter } = require("../src/routes/products.router.js");
const { router: cartsRouter } = require("../src/routes/carts.router.js");

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRouter);
app.use("/api/carts/", cartsRouter);

app.get("/", (req, res) => {
    console.log("url: ", req.url);

    res.setHeader('Content-type', 'text/plain');
    res.status(200).send("Pagina de Inicio de Express Server...[OK]");
});

const server = app.listen(PORT, () => console.log(`

***************************************                                    
* Servidor en linea sobre puerto ${PORT} *
***************************************                                    

# Url:
    http://localhost:${PORT}

`));