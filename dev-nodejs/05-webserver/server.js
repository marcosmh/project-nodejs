const express = require('express');
const app = express();


app.use(express.static(__dirname +  '/public'));

// app.get('/', (req, res) => {
//     let salida = {
//         nombre: 'Marcos',
//         apellido: 'Magaña',
//         url: req.url
//     }
//
//   res.send(salida);
//
// });

app.listen(3000, ()=> {
  console.log('Escuchando en el puerto: 3000');
});
