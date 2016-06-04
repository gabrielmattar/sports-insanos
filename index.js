//<<<<<<< HEAD
//=======
var express = require('express');
var app = express();
var hbs = require('hbs');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
var mongoURI = "mongodb://admin:teste123@ds023303.mlab.com:23303/heroku_xzs5xcn3";
var User = require('./models/users');
var Time = require('./models/time');

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


app.set('views', __dirname + '/views');
app.set('view engine', hbs);

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

  // create a new user
  var newUser = User({
    nome: req.body.fname,
    Sobrenome: req.body.lname,
    username: req.body.uname,
    password: req.body.senha,
    sexo: req.body.sex
  });

  newUser.save(function(err) {
    if (err) throw err;

    console.log('User created!');
  });

  res.render('frontpage.hbs');
});

app.get('/campeonatochaves', function (req, res) {
  res.render('campeonatochaves.hbs');
});

app.get('/criar-time', function (req, res) {
  res.render('criartime.hbs');
});


app.post('/novotime', function (req, res) {
  var Usernames = req.body.unamep;
  var UsersId = [];
    for(var Username of Usernames){
      User.findOne({username: Username}, function(err, usuario){
        if(err){
          console.log(err);
        }
        else {
          UsersId.push(usuario._id);
          if(UsersId.length == req.body.numjogadores) {
            var newTime = Time ({
              nometime: req.body.nomet,
              integrantes: UsersId
            } );

            newTime.save(function(err) {
              if (err) throw err;

              console.log('Time created!');
            });
          }
        }
      });
    }

  res.render('frontpage.hbs');
});

app.post('/cadastroc', function (req, res) {
  var timesc = req.body.nomet;
  var times = [];
    for(var time of timesc){
      Time.findOne({nometime: time}, function(err, team){
        if(err){
          console.log(err);
        }
        else {
          //User.findOne({username: req.user.username}, function(err, admi){
          User.findOne({username: 'fegemo'}, function(err, admi){
            if(err){
              console.log(err);
            }
            else {
              times.push(team._id);
              if(times.length == req.body.numerot) {
                var newCamp =  Camp({
                  nome: req.body.nomec,
                  numerotimes: req.body.numerot,
                  chaves: {times: times},
                  adm:admi
                } );

                newCamp.save(function(err) {
                  if (err) throw err;

                  console.log('Campeonato created!');
                });
              }
            }
          });
        }
      });
    }

  res.render('frontpage.hbs');
});

app.listen(app.get('port'), '0.0.0.0', function() {
  console.log('Node app is running on port', app.get('port'));
});


//<<<<<<< HEAD
var User = require('./models/users');

var Time = require('./models/time');
var Camp = require('./models/campeonato');
/*console.log(db.collection('users').toObject());*/
/*
db.collection('users').findOne({})
var newtime = Time ({
  nometime: 'Time de Teste',
  integrantes: [User.findOne({ nome: 'Gabriel' }),User.findOne({ nome: 'guilherme' })]
} );



newtime.save(function(err) {
  if (err) throw err;

  console.log('time saved successfully!');
});*/
//>>>>>>> c46787aeeb377d951fa48aca96911e92285826d7
//=======
//Exemplo de uso do findOne
app.get('/user/:uname', function(req, res) {

  User.findOne({
    username: req.params.uname
  }, function(err, usuario){
    if(err){
      console.log(err);
    } else {
      res.json(usuario);
      console.log(usuario);
    }
  });
});
//>>>>>>> 3fcb53a820c5c37078d4c427e9765a38266603ea
