// **********  Importar Componentes  *****************
const express = require("express");
const fs = require("fs");
const { join, path } = require("path");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io");

const { router: productsRouter } = require("../src/routes/products.router.js");
const { router: cartsRouter } = require("../src/routes/carts.router.js");
const { router: viewsRouter } = require("../src/routes/views.router.js");

const logMiddleware = require('./middlewares/logMiddleware.js');
// ***************************************************



// *****  Declaracion de variables y constantes  *****
const PORT = 8080;
let serverSocket; // Para poder importar desde CommonJS o ECS
// ***************************************************



// ************  Iniciar Express  ********************
const app = express();
// ***************************************************



// ************  Middleware  ************************
// *******  Para manejar JSON desde express  ********
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let ruta = join(__dirname, "public"); // Para Recurso estatico
app.use(express.static(ruta));
//console.log(ruta);

app.use(logMiddleware);
// ***************************************************



// ************  Handlebars  *************************
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
let rutaviews = join(__dirname, '/views'); // Para vistas
app.set('views', rutaviews);
//console.log(rutapub);
//app.set('views', './src/views');
// ***************************************************



// ********  Definir Routers Endpoints   ***************
//app.use("/api/products", productsRouter);
app.use("/api/products", //Middleware para usar websocket en productsRouter
    (req, res, next) => {
        req.socket = serverSocket;
        next();
    }, productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/", (req, res, next) => {
    req.socket = serverSocket;
    next();
}, viewsRouter);
// ***************************************************



// ************  Server HTTP  ************************
const serverHTTP = app.listen(PORT, () => console.log(`

***************************************                                    
* Servidor en linea sobre puerto ${PORT} *
***************************************                                    

# Url:
    http://localhost:${PORT}

`));
// ***************************************************



// ************  Server WebSocket  *******************
serverSocket = new Server(serverHTTP);
// ***************************************************



// ********  Configurar WebSocket  ******************
serverSocket.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);

    // B04.escucho el nuevo producto agregado proveniente de realtimeproducts.js
    //    muestro en consola del app.js.
    socket.on("nuevoProductoAgregado", nuevoProd => {
        console.log('Producto agregado:', nuevoProd);
        
        // B05.emito señal de notificacion a todos menos al creador del
        //    producto.
        //socket.emit('nuevoProductoAgregadoaTodos', nuevoProd);
        //socket.broadcast.emit("nuevoProductoAgregadoaTodos", nuevoProd);
    });

    socket.on("ProductoBorradoOtro", prodBorrado => {
        console.log('Producto eliminado:', prodBorrado);
        socket.emit('productoBorradoaTodos', prodBorrado);
        socket.broadcast.emit("productoBorradoaTodos", prodBorrado);
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});
// ***************************************************



// ********  Ejemplo WebSocket Emit (Emitir) ************
// Cada 1000ms (1seg) guardo en la variable "horahhmm" la hora actual y luego
// la emito por websocket el valor de esa variable (horahhmm) como "HoraServidor".
// Desde el archivo.js que quiera obtener esta informacion debo hacer "un socket.on"
setInterval(() => {
    //let fecha = new Date().toLocaleDateString();
    let horahhmm = new Date();
    //console.log(horahhmm);

    // A01. emito señal de reloj
    serverSocket.emit("HoraServidor", horahhmm);
}, 1000);
// ***************************************************

