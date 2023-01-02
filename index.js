var productos = [];

const express = require("express");

const app = express();
app.use(express.json());

let mysql = require('mysql');
const path = require('path');

app.use(express.static('public'));
app.use('/public', express.static('public'));
app.disable('etag');

const port = 3001;
app.listen(port);
console.log(`Server is running on port ${port}`);

////////////////////////////
//LECTURA COMPLETA CON GET//
////////////////////////////
app.get('/productos/', (req, res) => {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);

    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'Diego',
        password: 'diego',
        database: 'tecnoshop'
    })
    connection.connect((err) => {
        if (err) throw err;
        console.log('Conexión satisfactiora a la base de datos tecnoshop');
    })
    connection.query('SELECT * FROM productos', (err, rows) => {
        // if (err) throw err;
        if (err) res.json({});
        productos = rows;
        res.json(productos);

    })
    connection.end();
});

/////////////////////////////////
//BÚSQUEDA DE REGISTROS CON GET//
/////////////////////////////////
app.get('/productos/:data', (req, res) => {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);

    const aBuscar = req.params.data;

    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'Diego',
        password: 'diego',
        database: 'tecnoshop'
    })
    connection.connect((err) => {
        if (err) throw err;
        console.log('Conexión satisfactiora a la base de datos tecnoshop');
    })
    connection.query(`SELECT * FROM productos WHERE UPPER(descripcion) LIKE UPPER('${aBuscar}%')`, (err, rows) => {
        if (err) throw err;
        productos = rows;
        res.json(productos);

    })
    connection.end();
    // res.statusCode = 200;
});

//////////////////////////////////
//BORRADO DE REGISTRO CON DELETE//
//////////////////////////////////
app.delete('/productos/:id', (req, res) => {
    const id = Number(req.params.id);

    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'Diego',
        password: 'diego',
        database: 'tecnoshop'
    })

    connection.connect((err) => {
        if (err) throw err;
        console.log('Conexión satisfactiora a la base de datos tecnoshop');
    })

    connection.query('DELETE FROM productos WHERE id = ' + id, (err, rows) => {
        if (err) throw err;
        console.log('Registros borrados: ' + rows.affectedRows);
    })

    console.log("Salgo del borrado, paso a la lectura de la tabla");
    connection.end();

    res.json('Producto borrado, id: ' + id);
    console.log('Producto borrado, id: ' + id);
})

////////////////////////////////////
//MODIFICACIÓN DE REGISTRO CON PUT//
////////////////////////////////////
app.put('/productos/:id', (req, res) => {
    const id = Number(req.params.id);
    console.log(id);
    const producto = req.body;

    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'Diego',
        password: 'diego',
        database: 'tecnoshop'
    })

    connection.connect((err) => {
        if (err) throw err;
        console.log('Conexión satisfactiora a la base de datos tecnoshop');
    })

    connection.query(`UPDATE productos SET descripcion = '${producto.descripcion}', imagen = '${producto.imagen}', precio = ${producto.precio}
            WHERE id = ${id}`, (err, rows) => {
        if (err) throw err;
    })

    connection.end();

    res.json('Producto actualizado, id: ' + id);
    console.log('Producto actualizado, id: ' + id);
})

//////////////////////////////////
//INSERCIÓN DE REGISTRO CON POST//
//////////////////////////////////
app.post('/productos/', (req, res) => {
    const producto = req.body;
    console.log("Producto en post: ",producto)
    
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'Diego',
        password: 'diego',
        database: 'tecnoshop'
    })

    connection.connect((err) => {
        if (err) throw err;
        console.log('Conexión satisfactiora a la base de datos tecnoshop');
    })

    connection.query(`INSERT INTO productos (descripcion, imagen, precio) VALUES ("${producto.descripcion}","${producto.imagen}",${producto.precio})`, (err, rows) => {
        if (err) throw err;
        console.log(rows);
        console.log(rows.affectedRows);
        res.json(rows.insertId)
    })

    connection.end();
    // console.log('Producto incorporado, id: ' + rows.insertId);
})

///////////////////////////////
//DROP DE LA TABLA CON DELETE//
///////////////////////////////
//NO PASO REQ XQ SE CONFUNDIRÍA CON DELETE DE PRODUCTOS
app.delete('/productos/', (req, res) => {

    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'Diego',
        password: 'diego',
        database: 'tecnoshop'
    })

    connection.connect((err) => {
        if (err) throw err;
        console.log('Conexión satisfactiora a la base de datos tecnoshop');
    })

    connection.query('DROP TABLE IF EXISTS productos', (err, rows) => {
        if (err) throw err;
    })

    connection.end();

    res.json('Tabla productos borrada');
})

/////////////////////////////////
//CREACIÓN DE LA TABLA CON POST//
/////////////////////////////////
app.post('/create/', (req, res) => {
    const data = req.body;
    console.log("Tabla en post: ", data);
    console.log(data.tabla);

    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'Diego',
        password: 'diego',
        database: 'tecnoshop'
    })

    connection.connect((err) => {
        if (err) throw err;
        console.log('Conexión satisfactiora a la base de datos tecnoshop');
    })

    connection.query(`CREATE TABLE IF NOT EXISTS tecnoshop.${data.tabla} (id INT NOT NULL AUTO_INCREMENT, descripcion VARCHAR(40) NOT NULL, precio FLOAT NOT NULL, imagen VARCHAR(200) NOT NULL, PRIMARY KEY (id)) ENGINE = InnoDB`, (err, rows) => {
        if (err) throw err;
        console.log(rows);
        console.log(rows.serverStatus);
    })

    connection.end();

    res.json('Tabla productos verificada o creada');
})
