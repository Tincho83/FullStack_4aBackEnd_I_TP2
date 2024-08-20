const express = require("express");
const fs = require("fs");
const { router: productsRouter } = require("../src/routes/products.router.js");
const { router: cartsRouter } = require("../src/routes/carts.router.js");
//
const exphbs = require("express-handlebars");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");


const PORT = 8080;
const app = express();
//
const server = http.createServer(app);
const io = socketIo(server);

// Configurar Handlebars
app.engine('handlebars', exphbs);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//
app.use(express.static('public'))

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts/", cartsRouter);

// Rutas para vistas
app.get("/products", async (req, res) => {
    let prodss;
    try {
        prodss = await ProductsManager.getProducts();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
    res.render('index', { products: prodss });
});

app.get("/realtimeproducts", async (req, res) => {
    let prodss;
    try {
        prodss = await ProductsManager.getProducts();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
    res.render('realTimeProducts', { products: prodss });
});

app.get("/", (req, res) => {
    console.log("url: ", req.url);

    res.setHeader('Content-type', 'text/plain');
    res.status(200).send("Pagina de Inicio de Express Server...[OK]");
});

// Configurar WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('addProduct', async (product) => {
        try {
            let newProduct = await ProductsManager.addProduct(product);
            io.emit('productAdded', newProduct);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            let result = await ProductsManager.deleteProduct(id);
            if (result > 0) {
                io.emit('productDeleted', id);
            }
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

 server.listen(PORT, () => console.log(`Servidor en línea sobre puerto ${PORT}`));
/*const server = app.listen(PORT, () => console.log(`

***************************************                                    
* Servidor en linea sobre puerto ${PORT} *
***************************************                                    

# Url:
    http://localhost:${PORT}

`));
*/