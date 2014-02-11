var db;

function Foto(idusuario, filename, epigrafe, idfoto) {
  this.idusuario = idusuario;
  this.filename = filename;
  this.epigrafe = epigrafe;
  this.idfoto = idfoto;
  
};


var Fotos = {
/*Fotos.findByUserId() toma un idusuario, y un callback. Llama al callback con 
un posible error y un array de objetos del tipo Foto. [{},{},{}] */
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
  },

/*Fotos.addPhoto() toma un objeto User, un objeto Foto y un callback. Llama al callback con 
un posible error. Mueve la foto al directorio fotos y agrega la foto a la tabla
fotos de la base de datos para este usuario */
  addPhoto: function(foto, callback) {
    Fotos.findByUserId(foto.idusuario, function (error, fotos) {
      var ext = path.extname(foto.filename);
      var finalFileName = foto.idusuario + "_" + (fotos.length + 1) + ext;
      var epigrafe = foto.epigrafe;
      fs.readFile(foto.filename, function (error, data) {
        var newPath = __dirname + "/.." + "/fotos/" + finalFileName;
        fs.writeFile(newPath, data, function (error) {
          db.run("insert into fotos (idusuario, filename, epigrafe) values (?,?,?)",
                 [foto.idusuario, finalFileName, epigrafe],
                 function (error) {
            callback(error);
          });
        });
      });
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

