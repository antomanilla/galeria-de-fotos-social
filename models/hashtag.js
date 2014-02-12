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
  }
}

module.exports = function(db_) {
  db = db_;
  return Hashtags;
};
