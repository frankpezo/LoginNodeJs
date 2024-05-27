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
const { name } = require('ejs');


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

//Para poder realizar el registro
app.post('/register', async (req, res) => {
    //Capturamos datos y guardamos en la bd
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passHash = await bcrpytjs.hash(pass, 8);

    conexion.query('INSERT INTO user SET ?', { user: user, name: name, rol: rol, pass: passHash }, async (error, results) => {
        if (error) {
            console.log(`EL ERROR ES : ${error}`);
        } else {
            //Para que funcione el sweet alert
            res.render('register', {
                alert: true,
                alertTitle: 'Registro',
                alertMessage: '¡Se registró con éxito!',
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta: 'login'
            });
        }
    });

});

// Para poder autenticar los datos del login
app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;

    let passHash = await bcrpytjs.hash(pass, 8);

    if (user && pass) {
        conexion.query('SELECT * FROM user WHERE user = ?', [user], async (error, results) => {

            if (results.length == 0 || !(await bcrpytjs.compare(pass, results[0].pass))) {
                //Mensaje de error
                res.render('login', {
                    alert: true,
                    alertTitle: 'Error',
                    alertMessage: 'Usuario y/o contraseña incorrecta',
                    alertIcon: 'error',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'login'
                });
            } else {
                //Para la sesión
                req.session.loggedin = true;
                req.session.name = name;

                //Mensaje de confirmación
                res.render('login', {
                    alert: true,
                    alertTitle: 'Conexión éxitosa',
                    alertMessage: '¡Login correcto!',
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                });
            }

        })
    } else {
        //En caso los campos queden vacíos
        res.render('login', {
            alert: true,
            alertTitle: 'Advertencia',
            alertMessage: '¡Los campos no pueden quedar vacíos!',
            alertIcon: 'warning',
            showConfirmButton: true,
            timer: 4000,
            ruta: 'login'
        });
    }
});





//Servidor
const puerto = process.env.PORT || 5000;
app.listen(puerto, () => {
    console.log('Servidor funcionando en: http://localhost:5000')
});

