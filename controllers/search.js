var Fotos;
var db;

var search = {
  showResults: function(request, response) {
    Fotos.getByHashtag(request.query.search_hash, function (error, fotos) {
     var data = { 
        fotos: fotos
      };
      response.render("search_results", data);
    })
  }
}

module.exports = function(db_){
  db = db_;
  Fotos = require ("../models/foto")(db).Fotos;
  return search; 
}