var db;
var crypto = require('crypto');
var sha1 = function (x) {
  var sha1sum = crypto.createHash("sha1");
  sha1sum.update(x);
  return sha1sum.digest("hex");
}
var Users;

function handle (request, response) {
  if (request.body.accion == "signin") {
    signin(request, response);
  } else {
    signup(request, response);
  }  
}

function signup (request, response) {
  Users.signup(request.body.username, sha1(request.body.password), request.body.nombre, 
               request.body.apellido, function(error){
    if (error) {
      response.send("Usuario ya existe. Por favor elija otro nombre de usuario.");
    } else {
      signin(request, response);
    } 
  });

}

function signin (request, response) {
  Users.findByUsernamePassword(request.body.username, sha1(request.body.password), function(error, usuario) {
    if (error) throw error;
    if (usuario) {
      request.session.usuario = usuario.usuario;
      request.session.idusuario = usuario.id;
      request.session.nombre = usuario.nombre;
      request.session.apellido = usuario.apellido;
      response.redirect('/profile');
    } else {
      response.send("Usuario o contraseña no existen. Intentelo nuevamente.");
    }
  });
}

function showForm (request, response) {
  if (request.session.apellido !== undefined) {
    response.redirect("/profile");
  } else {
    response.render("login");
  }
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


