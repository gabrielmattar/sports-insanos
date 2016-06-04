var express = require('express');
var app = express();
var hbs = require('hbs');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
var mongoURI = "mongodb://admin:teste123@ds023303.mlab.com:23303/heroku_xzs5xcn3";

mongoose.connect(mongoURI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));



//Para poder ler os forms direitinho
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


fs.readdirSync(__dirname + '/models').forEach(function(filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});


app.get('/users', function(req, res) {
  mongoose.model('users').find(function(err, users) {
    res.send(users);
  });
});

app.get('/time', function(req, res) {
  mongoose.model('Time').find(function(err, time) {
    res.send(time);
  });
});

app.set('views', __dirname + '/views');
app.set('view engine', hbs);



app.get('/', function (req, res) {
  res.render('frontpage.hbs');
});

app.get('/cadastrocamp', function (req, res) {
  res.render('cadastrocamp.hbs');
});
app.get('/lista', function (req, res) {
  res.render('lista.hbs');
});

app.get('/cadastro', function (req, res) {
  res.render('cadastro.hbs');
});

//Receber o formulario de cadastro de usuario
app.post('/cadastro', function(req, res) {
  console.log(req.body.user.name);
});

app.get('/campeonatochaves', function (req, res) {
  res.render('campeonatochaves.hbs');
});

app.get('/criar-time', function (req, res) {
  res.render('criartime.hbs');
});

app.listen(app.get('port'), '0.0.0.0', function() {
  console.log('Node app is running on port', app.get('port'));
});


var User = require('./models/users');
var Time = require('./models/time');
// create a new user
var newusuario = User({
  nome: 'Sir',
  Sobrenome: 'Arthur',
  username: 'SA',
  password: 'password',
  sexo: 'Masculino'
});


var newtime = Time ({
  nome: 'Time de Teste',
  integrantes: ['malucobeleza','SA']
} );


// Comentei essa parte pq tava dando pau ja que tamo sempre salvando o mesmo manolo no BD
// // save the user
// newUser.save(function(err) {
//   if (err) throw err;
//
//   console.log('User created!');
// });
