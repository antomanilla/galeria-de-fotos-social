var logout = {
  logout: function (request, response) {
    request.session.usuario = undefined;
    request.session.id = undefined;
    request.session.nombre = undefined;
    request.session.apellido = undefined;
    response.redirect("/login");
  }
};

module.exports = logout;