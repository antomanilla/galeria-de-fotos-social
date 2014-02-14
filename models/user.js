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
  },
  findById: function (userid, callback) {
    db.get("select * from usuarios where id = ?", [userid], function(error, row){
      if (error) callback (error, undefined);
      else if (row) {
        var u = new User (row.id,
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
  /* findFriends quiero que busque el id de todos los amigos del usuario que 
  le paso como parametro y me los devuelva en un array de objetos del tipo User */
  findFriends: function (userid, callback) {
    db.all("select usuarios.id, usuarios.usuario, usuarios.password, usuarios.nombre, usuarios.apellido " +
           "from usuarios, amistades " +
           "where amistades.idamigo = usuarios.id and amistades.idusuario = ?", 
           [userid], function (error, rows){
      var friends = [];
      if (error) return callback (error, undefined);
      for (var i=0; i<rows.length; i++) {
          friends[i] = new User(rows[i].id, rows[i].usuario, rows[i].password, rows[i].nombre, rows[i].apellido); 
      } 
      callback(undefined, friends);
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
