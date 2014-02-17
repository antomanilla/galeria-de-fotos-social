var express = require('express');
var app = express();
var engines = require('consolidate');
var sqlite = require('sqlite3');
var db = new sqlite.Database("galeria.db");
var login = require('./controllers/login')(db);
var profile = require('./controllers/profile')(db);
var logout = require('./controllers/logout');
var search = require('./controllers/search')(db);
var follow = require('./controllers/follow')(db);



app.use('/css', express.static(__dirname + '/css'));
app.use('/fotos', express.static(__dirname + '/fotos'));
app.use(express.logger("dev"));
app.use(express.cookieParser());
app.use(express.session({'secret': "parrilla"}));
app.use(express.bodyParser({uploadDir:'/tmp'}));


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
app.get('/logout', logout.logout);


app.get('/profile', profile.showProfile);
app.post('/profile', profile.upload);

app.get('/publico/:user', profile.showPublic);
app.get('/hashtags', search.showResults); 

app.post('/follow', follow.startFollowing);
console.log(profile);
app.post('/remove_photo', profile.removePhoto);

app.listen(3000);