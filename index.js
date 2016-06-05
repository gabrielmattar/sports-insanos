var express = require('express');
var app = express();
var hbs = require('hbs');
var _ = require('underscore');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
var mongoURI = "mongodb://admin:teste123@ds023303.mlab.com:23303/heroku_xzs5xcn3";
var User = require('./models/users');
var Time = require('./models/time');
var Camp = require('./models/campeonato');
var ObjectId = require('mongodb').ObjectID;


var cookieParser = require('cookie-parser');
var session      = require('express-session');
var flash        = require('connect-flash');
app.use(cookieParser('lalala'));
app.use(session({
  secret: 'lalala',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());


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


app.get('/lista', function (req, res) {
  if(req.user){
    var cchave =[];
    Camp.find({adm: req.user.username} ,function(err, campeonato){
      if(err){
        console.log(err);
      } else {
        for(camp of campeonato){
          var conjunto = [];
          for(var i=0;i<camp.numerotimes;i++){
            if(Math.pow(2,i)==camp.numerotimes){
              var perct = (camp.chaves.length/i)*100;
              if(perct>=100){
                perct=100;
                var winner = _.last(camp.chaves);
                var winner = winner.times[0];

                conjunto.push(camp,perct,winner);
              }
              break;
            }
          }
          cchave.push(conjunto);
        }
        res.render('lista.hbs', {

          //campeonato : campeonato,
          cchave : cchave
        });
      }
    });
  }
  else{
    var cchave =[];
    Camp.find({},{},{limit : 10} ,function(err, campeonato){
      if(err){
        console.log(err);
      } else {
        for(camp of campeonato){
          var conjunto = [];
          for(var i=0;i<camp.numerotimes;i++){
            if(Math.pow(2,i)==camp.numerotimes){
              var perct = (camp.chaves.length/i)*100;
              if(perct>=100){
                perct=100;
                var winner = _.last(camp.chaves);
                var winner = winner.times[0];

                conjunto.push(camp,perct,winner);
              }
              break;
            }
          }
          cchave.push(conjunto);
        }
        res.render('lista.hbs', {

          //campeonato : campeonato,
          cchave : cchave
        });
      }
    });


  }
});


app.post('/Search', function(req, res){
  Camp.findOne({   nome: req.body.procuraCamp  }, function(err,campeonato){
    if (err){

      console.log(err);

    }
    else if (campeonato!= null){
      res.render('campeonatochaves.hbs', {
        campeonato : campeonato
      });

    }
    else{
      //req.flash('success', 'You are successfully using req-flash')/
      res.render('lista.hbs');
    }

  });
});
/*
app.get('/lista', function (req, res) {
  var cchave =[];
  Camp.find({}, function(err, campeonato){
    if(err){
      console.log(err);
    } else {

        for(camp of campeonato){
          var winner = _.last(camp.chaves);
          winner = winner.times[1];
          User.find({_id: ObjectId(winner)}, function(err, win){
            console.log(win);
            if(err){
              console.log(err);
            }
            else{
            var conjunto = [];
            for(var i=0;i<camp.numerotimes;i++){
              if(Math.pow(2,i)==camp.numerotimes){
                var perct = (camp.chaves.length/i)*100;
                if(perct>=100){
                  perct=100;

                  conjunto.push(camp,perct,win.nometime);
                    }
                }
                break;
              }
              cchave.push(conjunto);
            }

          });
        }


      res.render('lista.hbs', {

        //campeonato : campeonato,
        cchave : cchave
      });

    }
  });
});
*/
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

app.get('/campeonatochaves/:nome', function (req, res) {
  Camp.findOne({
    nome: req.params.nome
  }, function(err, campeonato){
    if(err){
      console.log(err);
    } else {
      res.render('campeonatochaves.hbs', {
        campeonato : campeonato
      });
    }
  });
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


app.listen(app.get('port'), '0.0.0.0', function() {
  console.log('Node app is running on port', app.get('port'));
});

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
