var db;

function Hashtag(id, hashtag) {
  this.id = id;
  this.hashtag = hashtag;
}

var Hashtags = {
  /* busca los hashtags de la foto con este id,
     y llama a callback con un posible error, y un array
     de los Hashtag de esta foto. */
  getByFotoId: function(idfoto, callback) {
    db.all("select hashtags.hashtag, hashtags.idhash " + 
         "from hashtags, fotohash " +
         "where fotohash.idhash = hashtags.idhash and " + 
               "fotohash.idfoto = ? ",[idfoto], function(error, rows) {
      if (error) callback(error);
      else {
        var hashtags = [];
        for (var i = 0; i < rows.length; i++) {
          hashtags.push(new Hashtag(rows[i].idhash, rows[i].hashtag));
        }
        callback(undefined, hashtags);
      }
    });
  },
  /*Hashtags.exists recibe un hashtag y llama al callback con un objeto hashtag is existe y 
  con undefined sino. el primer parametro del callback es un error, si hay error */
  getByHashtag: function(hashtag, callback) {
    db.get("select idhash from hashtags where hashtag = ?",[hashtag], function(error, row){
      if (error) callback (error);
      else if (row) {
        var obj = new Hashtag(row.idhash, hashtag);
        callback(undefined, obj);
      } else {
        callback(undefined, undefined);
      }
    });
  },

  /* Hashtags.add recibe un hashtag, un idfoto y un callback. llama a getByHashtag para chequear
  si el hashtag ya existe en la base de datos. si existe entonces solo quiero agregarselo a la foto,
  es decir a la tabla idhash. si no existe en la base de datos lo agrego a la tabla de id
  y tambien a idhash */
  add: function(hashtag, idfoto, callback) {
    Hashtags.getByHashtag(hashtag, function(error, ht) {
      if (error) return callback (error);
      if (!ht) {
        //si no existe el # en la db quiero agregarlo.
        db.run("insert into hashtags (hashtag) values (?)", hashtag, function(error) {
          if (error) callback(error);
          else {
            Hashtags.getByHashtag(hashtag, function(error,hashtag){
              var idhash = hashtag.id;
              db.run("insert into fotohash (idhash, idfoto) values (?,?)", [idhash, idfoto], callback);
            }); 
          }
        });  
      } else { 
        //si existe el hashtag, solo quiero agregarlo en la tabla fotohash
        db.run("insert into fotohash (idhash, idfoto) values (?,?)", [ht.id, idfoto], callback);
      }
    });
  } 
}

module.exports = function(db_) {
  db = db_;
  return Hashtags;
};
