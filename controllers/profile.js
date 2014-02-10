var Fotos;
var Users;

var profile = {

  showProfile: function (request, response) {
    if (request.session.nombre == undefined) {
      response.redirect("/login");
    } else {
      Fotos.findByUserId(request.session.idusuario, function (error, fotos){
        var data = { 
          usuario: request.session.nombre + " " + request.session.apellido,
          fotos: fotos
        };
        response.render("profile", data);
      });
    }
  },

  showPublic: function (request, response) {
    console.log(request.params);
    Users.findByUsername(request.params.user, function (error, user) {
      if (error) throw error;
      if (user) {
        Fotos.findByUserId(user.id, function (error, fotos){
          if (error) throw error;
          var lista = [];
          for (var i=0; i<fotos.length; i++) {
            lista.push(fotos[i].filename);
          }
          response.send(lista.toString());
        });
      } else {
        response.send("No existe el usuario " + request.params.user);
      }
    });
  }
};
var db;

module.exports = function (db_) {
  db = db_;
  Fotos = require("../models/foto")(db).Fotos;
  Users = require("../models/user")(db).Users;
  return profile;
}
