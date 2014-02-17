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
        Users.findFollowing(request.session.idusuario, function(error, friends){
          if (error) throw error;
          var data = { 
            usuario: request.session.nombre + " " + request.session.apellido,
            fotos: fotos,
            isYou: true,
            followees: friends,
            following: true,
            partials: { user_nav: "user_nav" }
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
            /* si estoy logueada */
            Users.isFollowing(request.session.idusuario, user.id, function(isfollowing){
              var data = { 
                  fotos: fotos,
                  usuario: request.session.nombre + " " + request.session.apellido,
                  userid: user.id,
                  partials: { user_nav: "user_nav" }
              }
              if (isfollowing) {
                data.following = true;
              }
              response.render("profile", data);           
            });
          } else {
            //si no estoy logueada
            var data = { 
              fotos: fotos,
              partials: { user_nav: "user_nav" }
            };
            response.render("profile", data);
          }
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
    Fotos.addPhoto(foto, function(error, idfoto){
      if (error) {
        return response.send("No se pudo insertar la foto");
      }
      Hashtags.add(request.body.hashtag, idfoto, function () {
        response.redirect("back");  
      });
    });
  },

  /* Profile.removePhoto, chequea que la foto que esta pidiendo ser removida
  pertenezca al mismo usuario que esta logueado. Siendo asi, llama a Fotos.remove
  para que elimine la foto de la db. responde al browser si todo salio bien. */
  removePhoto: function (request, response) {
    var idfoto = request.body.idfoto;
    Fotos.findByUserId(request.session.idusuario, function(error, photos) {
      if (error) return response.send ("Error: " + error.toString());
      for (var i = 0; i < photos.length; ++i) {
        if (photos[i].idfoto == idfoto) {
          Fotos.remove(idfoto, function(error) {
            if (error) {
              response.send("Error: " + error.toString());
            } else {
              response.send("Ok");
            }
          });
          return;
        }
      }
      response.send("Access denied.");
    });
  }
};

var db;

module.exports = function (db_) {
  db = db_;
  var fotos = require("../models/foto")(db);
  Hashtags = require("../models/hashtag")(db);
  Foto = fotos.Foto;
  Fotos = fotos.Fotos;
  Users = require("../models/user")(db).Users;
  return profile;
}
