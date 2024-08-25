const logMiddleware = ( req, res, next) => {
console.log(`Fecha: ${new Date().toLocaleDateString()}, Metodo: "${req.method}" en url: "${req.url}"`);
    next();
}

module.exports = logMiddleware;