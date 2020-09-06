
require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

//Body Parser
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//const port = process.env.PORT || 3000;

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname,'../public')));

//Configuracion global de rutas
app.use(require('./routes/routes'));


mongoose.connect(process.env.URLDB,
                { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
                (err,res)  => {

    if(err) throw err;

    console.log('Base de Datos Online')
});


app.listen(process.env.PORT, ()=> {
  console.log(`Escuchando en el puerto: `,process.env.PORT);
});
