var Fotos;

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
    db.get("select id from usuarios where usuario = ?", [request.params.user], function(error, row){

      Fotos.findByUserId(row.id, function (error, fotos){
        var lista = [];
        for (var i=0; i<fotos.length; i++) {
          lista.push(fotos[i].filename);
        }
        response.send(lista.toString());
      });
    });
  }
};
var db;

module.exports = function (db_) {
  db = db_;
  Fotos = require("../models/foto")(db).Fotos;
  return profile;
}
