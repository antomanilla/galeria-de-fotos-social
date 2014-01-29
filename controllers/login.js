var db;
var crypto = require('crypto');
var sha1 = function (x) {
  var sha1sum = crypto.createHash("sha1");
  sha1sum.update(x);
  return sha1sum.digest("hex");
}
var User;

function handle (request, response) {
  console.log(User);
  User.findByUsernamePassword(request.body.username, sha1(request.body.password), function(error, usuario) {
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
  User = require("../models/user")(db);
  console.log("Apenas lo seteo, user es ", User);
  return { 
    handle: handle,
    showForm: showForm
  }
};


