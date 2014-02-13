var Fotos;
var db;
var Users;

var search = {
  showResults: function(request, response) {
    if (request.session.nombre == undefined) {
      response.redirect("/login");
    } else {
      Fotos.getByHashtag(request.query.search_hash, function (error, fotos) {
        /* fotos es un array de objetos Foto, quiero recorrer el aarray y 
        por cada posicion agregarle una propiedad autor que saco corriendo User.findById( ) 
        pasandole como parametro id: fotos[i].idusuario, en cada posicion. */
        function sendResponse () {
          var data = { 
            usuario: request.session.nombre + " " + request.session.apellido,
            fotos: fotos
          };
          response.render("search_results", data);
        }
        if (fotos.length == 0) {
          sendResponse();
        } else {
          var semaphore = fotos.length;
          for (var i = 0; i < fotos.length; i++) {
            Users.findById(fotos[i].idusuario, function (_i) {
              return function (error, u){
                fotos[_i].autor = u.usuario;
                semaphore --; 
                if (semaphore == 0) {
                  sendResponse();
                }
              } 
            }(i)); 
          }
        }
      });
    }
  }
}

module.exports = function(db_){
  db = db_;
  Fotos = require ("../models/foto")(db).Fotos;
  Users = require ("../models/user")(db).Users;
  return search; 
}