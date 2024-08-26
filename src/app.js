// **********  Importar Componentes  *****************
const express = require("express");
const fs = require("fs");
const moment = require("moment");
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



// ****************   WebSockets  ********************
// Cada 1000ms (1seg) emito la hora actual para mostrarse en menu.handlebars
setInterval(() => {
    let horahhmmss = moment().format('DD/MM/yyyy hh:mm:ss');

    // A01. emito evento de reloj
    serverSocket.emit("HoraServidor", horahhmmss);
}, 500);
// ***************************************************



// ********  Configurar WebSocket  ******************
serverSocket.on('connection', (socket) => {

    let dato;
    let sessionTime = moment().format('DD/MM/yyyy hh:mm:ss');

    console.log(`Nuevo cliente conectado: ${socket.id} a las ${sessionTime}`);

    /*
        socket.on("borreProd", dato => {
            console.log(`El cliente ${socket.id} borro el prod: ${dato}`);
            socket.broadcast.emit("HuboCambiosD", dato);
        });
    
        socket.on("ActuaProd", dato => {
            console.log(`El cliente ${socket.id} actualizo el prod: ${dato.id}`);
            socket.broadcast.emit("HuboCambiosU", dato);
        });
    
        socket.on("agregProd", dato => {
            console.log(`El cliente ${socket.id} agrego el prod: ${dato}`);
            socket.broadcast.emit("HuboCambiosC", dato);
        });
    */

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});
// ***************************************************





