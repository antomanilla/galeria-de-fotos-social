var db;
var crypto = require('crypto');
var sha1 = function (x) {
  var sha1sum = crypto.createHash("sha1");
  sha1sum.update(x);
  return sha1sum.digest("hex");
}


function handle (request, response) {
  db.get("select * from usuarios where usuario = ? and password = ?", [request.body.username, sha1(request.body.password)], function (error, row) {
    console.log (row);
    if (row) {
      request.session.usuario = row.usuario;
      request.session.id = row.id;
      request.session.nombre = row.nombre;
      request.session.apellido = row.apellido;
      response.send("Bienvenido/a " + row.nombre + " " + row.apellido);
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
  return { 
    handle: handle,
    showForm: showForm
  }
};
