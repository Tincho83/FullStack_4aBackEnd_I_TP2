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

const PORT = 8080;
let serverSocket;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let ruta = join(__dirname, "public"); 
app.use(express.static(ruta));

app.use(logMiddleware);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
let rutaviews = join(__dirname, '/views'); 
app.set('views', rutaviews);

app.use("/api/products", 
    (req, res, next) => {
        req.socket = serverSocket;
        next();
    }, productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/", (req, res, next) => {
    req.socket = serverSocket;
    next();
}, viewsRouter);


const serverHTTP = app.listen(PORT, () => console.log(`

***************************************                                    
* Servidor en linea sobre puerto ${PORT} *
***************************************                                    

# Url:
    http://localhost:${PORT}

`));

serverSocket = new Server(serverHTTP);

setInterval(() => {
    let horahhmmss = moment().format('DD/MM/yyyy hh:mm:ss');

    serverSocket.emit("HoraServidor", horahhmmss);
}, 500);


serverSocket.on('connection', (socket) => {

    let dato;
    let sessionTime = moment().format('DD/MM/yyyy hh:mm:ss');

    console.log(`Nuevo cliente conectado: ${socket.id} a las ${sessionTime}`);

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});