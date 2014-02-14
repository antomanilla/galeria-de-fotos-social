var Fotos;
var Foto;
var Users;

var profile = {

  showProfile: function (request, response) {
    if (request.session.nombre == undefined) {
      response.redirect("/login");
    } else {
      Fotos.findByUserId(request.session.idusuario, function (error, fotos){
        if (error) throw error;
        Users.findFriends(request.session.idusuario, function(error, friends){
          if (error) throw error;
          var data = { 
            usuario: request.session.nombre + " " + request.session.apellido,
            fotos: fotos,
            isYou: true,
            amistades: friends
          };
          response.render("profile", data);
        });
      });
    }
  },

  showPublic: function (request, response) {
    Users.findByUsername(request.params.user, function (error, user) {
      if (error) throw error;
      if (user) {
        Fotos.findByUserId(user.id, function (error, fotos){
          if (error) throw error;
          if (request.session.nombre) {
            var data = { 
              fotos: fotos,
              usuario: request.session.nombre + " " + request.session.apellido,
            };
          } else {
            var data = { 
              fotos: fotos,
            };
          }
          response.render("profile", data);
        });
      } else {
        response.send("No existe el usuario " + request.params.user);
      }
    });
  },

  upload: function (request, response) {
    var foto = new Foto(request.session.idusuario,
             request.files.f.path,
             request.body.epigrafe);
    Fotos.addPhoto(foto, function(){
      response.redirect("back");  
    });
  }
};
var db;

module.exports = function (db_) {
  db = db_;
  var fotos = require("../models/foto")(db);
  Foto = fotos.Foto;
  Fotos = fotos.Fotos;
  Users = require("../models/user")(db).Users;
  return profile;
}
