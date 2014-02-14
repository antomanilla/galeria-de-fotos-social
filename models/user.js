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
  /* findByUsername toma un username, arma un objeto User para ese usuario
  y llama al callback pasandolo como parametro, si no existe pasa undefined */
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
  /* findFollowing quiero que busque el id de todos los amigos del usuario que 
  le paso como parametro y me los devuelva en un array de objetos del tipo User */
  findFollowing: function (userid, callback) {
    db.all("select usuarios.id, usuarios.usuario, usuarios.password, usuarios.nombre, usuarios.apellido " +
           "from usuarios, amistades " +
           "where amistades.idamigo = usuarios.id and amistades.idusuario = ?", 
           [userid], function (error, rows){
      var friends = [];
      if (error) return callback (error, undefined);
      for (var i=0; i<rows.length; i++) {
          friends[i] = new User(rows[i].id, rows[i].usuario, rows[i].password, rows[i].nombre, rows[i].apellido); 
      } 
      console.log("amigos: ", friends);
      callback(undefined, friends);
    });
  },
  follow: function (userid1, userid2,  callback) {
    db.run("insert into amistades (idusuario, idamigo) values (?,?)",
          [userid1, userid2],
          callback);
  },
  /* isFollowing recibe dos userids y si el primero sigue al segundo
  llama al callback con true como parametro, sino false */
  isFollowing: function(userid1, userid2, callback) {
    Users.findFollowing(userid1, function(error, friends){
      if (error) return callback(error);
      for (var i=0; i<friends.length; i++) {
        if (friends[i].id == userid2) {
          return callback(true);
        } 
      }
      callback(false);      
    });
  },
  signup: function (username, password, nombre, apellido, callback) {
    Users.findByUsername (username, function (error, user){
      if (!user) {
        db.run("insert into usuarios (usuario, password, nombre, apellido) values (?,?,?,?)",
               [username, password, nombre, apellido], callback );               
      } else {
        callback("error");
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
