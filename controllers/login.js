var db;
var crypto = require('crypto');
var sha1 = function (x) {
  var sha1sum = crypto.createHash("sha1");
  sha1sum.update(x);
  return sha1sum.digest("hex");
}
var Users;

function handle (request, response) {
  console.log(Users);
  Users.findByUsernamePassword(request.body.username, sha1(request.body.password), function(error, usuario) {
    if (error) throw error;
    if (usuario) {
      request.session.usuario = usuario.usuario;
      request.session.id = usuario.id;
      request.session.nombre = usuario.nombre;
      request.session.apellido = usuario.apellido;
      response.send("Bienvenido/a " + usuario.nombre + " " + usuario.apellido);
    } else {
      response.send("Usuario o contraseña no existen. Intentelo nuevamente.");
    }
  });
}

function showForm (request, response) {
  response.render("login");
}

module.exports = function(db_) {
  db = db_;
  Users = require("../models/user")(db).Users;
  console.log("Apenas lo seteo, user es ", Users);
  return { 
    handle: handle,
    showForm: showForm
  }
};


