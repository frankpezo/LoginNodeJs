//1. Módulo Mysql
const mysql = require('mysql');
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

conexion.connect((error) => {
    if (error) {
        console.log(`ERROR DE CONEXIÓN A LA BD ES: ${error}`);
        return;
    }
    console.log('CONEXIÓN ÉXITOSA');
});

module.exports = conexion; //Exportamos para requerirlo en los archivos necesarios