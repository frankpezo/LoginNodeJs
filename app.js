//1. Módulo Express
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false })); // Para capturar datos en distinas páginas
app.use(express.json()); //Para poder trabajar con formato JSOn()

//2. Módulo Dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' }); //Configuramos la ruta del archivo donde se encuentra las variables de entorno

//3. Para poder utilizar el direcctorio PUBLIC
app.use('/recursos', express.static('public'));
app.use('/recursos', express.static(__dirname + '/public'));
console.log(__dirname);
app.set('view engine', 'ejs'); //Seteamos la plantilla


//4. Módulo Bcrpytjs y Express-session
const bcrpytjs = require('bcryptjs');
const session = require('express-session');
app.use(session({
    secret: '12345',
    resave: true,
    saveUninitialized: true
}));

//5. Conexión a la BD
const conexion = require('./database/db');


//Rutas
app.get('/', (req, res) => {
    res.render('index.ejs');
});

//Mostamos el login
app.get('/login', (req, res) => {
    res.render('login.ejs');
});

//Mostramos register
app.get('/register', (req, res) => {
    res.render('register');
})
//Servidor
const puerto = process.env.PORT || 5000;
app.listen(puerto, () => {
    console.log('Servidor funcionando en: http://localhost:5000')
});

