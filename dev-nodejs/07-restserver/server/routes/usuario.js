const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();



app.get('/usuario', verificaToken, (req, res) => {

  let desde = Number(req.query.desde) || 0;
  let limite = Number(req.query.limite) || 5;

  Usuario.find({ estado: true },'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err,usuarios) =>{

           if(err) {
               return res.status(400).json({
                   ok: false,
                   err
               });
           }


           Usuario.count({ estado: true},(err,registros) => {
             res.json({
               ok: true,
               usuarios,
               registros
             });
           });

         });
});


app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
  let body = req.body;

  let usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      password: bcrypt.hashSync(body.password,10),
      role: body.role
  });

  usuario.save( (err,usuarioDB) => {

      if(err) {
          return res.status(400).json({
              ok: false,
              err
          });
      }

      usuarioDB.password = null;

      res.json({
        ok: true,
        usuario: usuarioDB
      });

  });


});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body,['nombre', 'email', 'img', 'role', 'estado']);

  console.log("id: "+id);

  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true}, (err,usuarioBD) => {

    console.log("error: "+err);
    console.log("usuario_bd: "+usuarioBD);

      if(err) {
          return res.status(400).json({
              ok: false,
              err
          });
      }

      res.json({
        ok: true,
        usuario: usuarioBD
      });


    });

});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;

   let  cambiaEstado = {
     estado: false
   }

    //Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioEliminado) => {
      if(err) {
          return res.status(400).json({
              ok: false,
              err
          });
      }

      if(!usuarioEliminado) {
        return res.status(400).json({
            ok: false,
            err: {
              message: 'Usuario no encontrado'
            }
        });
      }

      res.json({
        ok: true,
        usuario: usuarioEliminado
      });


    });
});


module.exports = app;
