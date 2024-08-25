![image](/src/public/img/demo.PNG)
# BackEnd I - PreEntregable TP2
## _Servidor con endpoints y servicios para gestionar los productos y carritos de compra de un e-commerce integrando vistas Handlebars y websocket._  
  
### Vista previa / Preview
![image](/src/public/img/demo.gif)

### Depliegue / Deploy
[BackEnd I PreEntrega TP2](https://ecommbackend1b.netlify.app/) (No disponible por el momento.)

### Descripcion / Description
Aplicativo Backend para e-commerce realizado en javascript, express, Handlebars y websocket para el curso de Backend I en CoderHouse.  


### Construccion / Building
-  Javascript
-  node

# Install nodejs and verify version
   - node --version
   - npm --version

### Dependecias / Dependencies
-  express
-  express-handlebars
-  socket.io

## Instalacion / Installation
### Pasos / Steps
- Abrir VS Code / Open Vs Code
- Clonar repositorio / Clone Repository
   -  **git clone git@github.com:Tincho83/FullStack_4aBackEnd_I_TP2.git**  
   o  
   -  **git clone https://github.com/Tincho83/FullStack_4aBackEnd_I_TP2.git**

- Acceder a la carpeta del proyecto / Access to project folder
   - **cd FullStack_4aBackEnd_I_TP-main**

- Instalar todas las dependecias del proyecto/ Install dependencies
   - **npm install**
   o instalar dependencias individualmente
   - **npm install express**
   - **npm install express-handlebars@7.1.3**
   - **npm install socket.io**

- Instalar otras herramientas / Install others tools
   - **npm install -g nodemon** (instala nodemon de manera global. Esta herramienta reinicia el servidor cuando detecta cambios en el codigo.)
   
- Compilar / Compile
   - **npm run dev** (Para ejecutar en modo desarrollo)
   - **npm run start** (Para ejecutar en modo produccion)

### Estructura del proyecto / Project structure

#### Carpeta raiz del proyecto
   -  **src** (Carpeta que contiene los fuentes del proyecto)
   -  **.gitignore** (No disponible en el Repositorio. Solo para uso de git. Crear archivo .gitignore y agregar el texto (sin comillas): "node_modules" )
   -  **package.json** (Informacion y configuracion del proyecto. Se genera cuando se ejecuta el comando "npm init -y")
   -  **Readme.md** (Este archivo)   
   -  **node_modules** (No disponible en el repositorio, aparecera cuando instalen las dependencias del proyecto.)
   -  **nodemon.json**  (Utilizado por nodemon. Contiene la exclusion del monitoreo a archivos ".json" para evitar reiniciar el servidor cuando detecta cambios en estas extensiones de archivo.)

#### Carpeta SRC
   -  **dao** (Objeto de Acceso a Datos (Data Access Object) contiene los administradores para acceso a datos):
      - **CartsManager.js** (Administrador de acceso a datos para ABM del carrito.)
      - **ProductsManager.js**  (Administrador de acceso a datos para ABM de los productos.)
   -  **data** contiene los archivos para la persistencia de la informacion:
      -  **carrito.json** (datos de carritos y sus productos)
      -  **products.json** (datos de los productos)
   - **app.js** (aplicativo principal)
   -  **js** contiene otras aplicaciones
   - **public** contiene archivos de acceso publico
      - **css** hoja de estilos
      - **img** imagenes
      - **index.html** archivo principal html.
   - **routes** contiene las rutas para los endpoints
      - **carts.router.js** rutas para los endpoints del carrito.
      - **products.router.js** rutas para los endpoints de los productos.


### Contacto
[![N|Solid](/src/public/img/linkedin.png)](https://www.linkedin.com/in/martin-hernandez-9b7154215)
