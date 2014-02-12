var db;
var path = require("path");
var fs = require("fs");
var Hashtags;


function Foto(idusuario, filename, epigrafe, idfoto, hashtags) {
  this.idusuario = idusuario;
  this.filename = filename;
  this.epigrafe = epigrafe;
  this.idfoto = idfoto;
  this.hashtags = hashtags || [];
};


var Fotos = {
/*Fotos.findByUserId() toma un idusuario, y un callback. Llama al callback con 
un posible error y un array de objetos del tipo Foto. [{},{},{}] */
  findByUserId: function (idusuario, callback) {
    var sql = 'select filename, epigrafe, idfoto from fotos where idusuario = ?';
    db.all(sql, idusuario, function(error, rows) {
      var fotos = [];
      var semaphore = rows.length;
      for (var i=0; i<rows.length; i++) {
        fotos[i] = new Foto(idusuario, rows[i].filename, rows[i].epigrafe, rows[i].idfoto); 
        // aca quiero llenar los hashtags de fotos[i]
        // quiero que fotos[i].hashtags sean los hashtags de esta foto
        Hashtags.getByFotoId(fotos[i].idfoto, (function(i_) {
          return function(error, hashtags) {
            fotos[i_].hashtags = hashtags;
            semaphore--;
            if (semaphore == 0) {
              if (error) callback(error);
              else if (fotos){
                callback (undefined, fotos);
              } else {
                callback (undefined, undefined);
              }
            }
          };
        })(i));
      }
    });
  },

/*Fotos.addPhoto() toma un objeto Foto y un callback. Llama al callback con 
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
  },

/* Fotos.getByHashtag toma un hashtag y llama a un callback con un posible error
y un array de las fotos que contengan ese hashtag*/
  getByHashtag: function(hashtag, callback) {
    db.all("select fotos.filename, fotos.idfoto, fotos.idusuario, fotos.epigrafe " +
            "from fotos, fotohash, hashtags " +
            "where hashtags.idhash = fotohash.idhash and fotohash.idfoto = fotos.idfoto " + 
            "and hashtags.hashtag = ?", [hashtag], function (error, rows) {
      if (rows.length == 0) return callback(error, undefined);
      var fotos = [];
      var semaphore = rows.length;
      for (var i = 0; i < rows.length; i++) {
        fotos.push(new Foto(rows[i].idusuario, rows[i].filename, rows[i].epigrafe, 
                              rows[i].idfoto));
        Hashtags.getByFotoId(fotos[i].idfoto, (function(i_) {
          return function(error, hashtags) {
            fotos[i_].hashtags = hashtags;
            semaphore--;
            if (semaphore == 0) {
              if (error) callback(error);
              else if (fotos){
                callback (undefined, fotos);
              } else {
                callback (undefined, undefined);
              }
            }
          };
        })(i));
      }
    });
  }

};

module.exports = function(db_) {
  db = db_;
  Hashtags = require ("./hashtag")(db);
  return {
    Fotos: Fotos,
    Foto: Foto
  };
};

