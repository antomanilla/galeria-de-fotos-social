var Fotos;
var db;

var search = {
  showResults: function(request, response) {
    if (request.session.nombre == undefined) {
      response.redirect("/login");
    } else {
      Fotos.getByHashtag(request.query.search_hash, function (error, fotos) {
       var data = { 
          usuario: request.session.nombre + " " + request.session.apellido,
          fotos: fotos
        };
        response.render("search_results", data);
      });
    }
  }
}

module.exports = function(db_){
  db = db_;
  Fotos = require ("../models/foto")(db).Fotos;
  return search; 
}