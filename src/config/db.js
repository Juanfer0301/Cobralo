const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Usuario por defecto de XAMPP
    password: '',     // Password por defecto de XAMPP es vacío
    database: 'cobralo_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectado a MySQL:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL en XAMPP');
});

module.exports = connection;