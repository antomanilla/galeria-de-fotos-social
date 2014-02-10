var db;

function User(id, usuario, password, nombre, apellido) {
  this.id = id;
  this.usuario = usuario;
  this.password = password;
  this.nombre = nombre;
  this.apellido = apellido;
};

var Users = {
  findByUsernamePassword: function (username, password, callback) {
    db.get("select * from usuarios where usuario = ? and password = ?", [username, password], function (error, row) {
      if (error) callback (error, undefined);
      else if (row) { 
        var u = new User(row.id,
                         row.usuario,
                         row.password,
                         row.nombre,
                         row.apellido);

        callback (undefined, u);
      } else {
        callback (undefined, undefined);
      }
    });
  },
  findByUsername: function (username, callback) {
    db.get("select * from usuarios where usuario = ?", [username], function(error, row){
      if (error) callback (error, undefined);
      else if (row) {
        var us = new User (row.id,
                           row.usuario,
                           row.password,
                           row.nombre,
                           row.apellido);
        callback (undefined, us);
      } else {
        callback (undefined, undefined);
      }
    });
  }
};

module.exports = function(db_) {
  db = db_;
  return {
    Users: Users,
    User: User
  };
};
