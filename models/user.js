var db;
var User = {
  findByUsernamePassword: function (username, password, callback) {
    db.get("select * from usuarios where usuario = ? and password = ?", [username, password], function (error, row) {
      if (error) callback (error, undefined);
      else if (row) { 
        callback (undefined, {
          usuario: row.username,
          id: row.id,
          nombre: row.nombre,
          apellido: row.apellido
        });
      } else {
        callback (undefined, undefined);
      }
    });
  } 
};

module.exports = function(db_) {
  db = db_;
  return User;
};
