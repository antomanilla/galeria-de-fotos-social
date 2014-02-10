var db;

function Foto(idusuario, filename, epigrafe, idfoto) {
  this.idusuario = idusuario;
  this.filename = filename;
  this.epigrafe = epigrafe;
  this.idfoto = idfoto;
  
};

var Fotos = {
  findByUserId: function (idusuario, callback) {
    var sql = 'select filename, epigrafe, idfoto from fotos where idusuario = ?';
    db.all(sql, idusuario, function(error, rows) {
      var fotos = [];
      for (var i=0; i<rows.length; i++) {
        fotos[i] = new Foto(idusuario, rows[i].filename, rows[i].epigrafe, rows[i].idfoto); 
      }
      if (error) callback(error);
      else if (rows){
        callback (undefined, fotos);
      } else {
        callback (undefined, undefined);
      }
    });
  } 
};

module.exports = function(db_) {
  db = db_;
  return {
    Fotos: Fotos,
    Foto: Foto
  };
};

