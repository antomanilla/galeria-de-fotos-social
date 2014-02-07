var express = require('express');
var app = express();
var engines = require('consolidate');
var sqlite = require('sqlite3');
var db = new sqlite.Database("galeria.db");
var login = require('./controllers/login')(db);
var profile = require('./controllers/profile')(db);
var logout = require('./controllers/logout');



app.use('/css', express.static(__dirname + '/css'));
app.use('/fotos', express.static(__dirname + '/fotos'));
app.use(express.logger("dev"));
app.use(express.cookieParser());
app.use(express.session({'secret': "parrilla"}));
app.use(express.bodyParser())


app.set('view engine', 'html');
app.engine('html', engines.handlebars)


app.get('/', function(request, response) {
  response.redirect('/login');
});

app.get('/contador', function(request, response) {
  if (request.session.veces !== undefined) {
    request.session.veces ++;
    response.send ("Has entrado " + request.session.veces + " veces.");
  } else {
    request.session.veces = 1;
    response.send ("Has entrado 1 vez");
  }
});


app.get('/login', login.showForm);
app.post('/login', login.handle);

app.get('/profile', profile.showProfile);
app.get('/logout', logout.logout);

app.get('/publico/:user', profile.showPublic); 

app.listen(3000);