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
  res.render('frontpage.hbs',{
    error : req.flash('error'),
    success : req.flash('success')

  });
});

app.post('/novapagc', function(req,res){
    var numerob = req.body.numerot;
    var vetor =[];
    for(var i=0;i<numerob;i++){
      vetor.push(i+1);
    }
    var enviacamp = req.body.nomeca;
    res.render('cadastrocamp.hbs', {
      vetor : vetor,
      enviacamp :enviacamp,
      error : req.flash('error'),
      success : req.flash('success')
    });

});

app.get('/cadastrocamp', function (req, res) {
  console.log('aaa');
  res.render('cadastrocamp.hbs', {
    error : req.flash('error'),
    success : req.flash('success')

  });
});
app.post('/cadastroc', function (req, res) {
  var camp = new Camp();
  camp.Cria(req.body.numerot, req.body.nomec, 'fegemo', req.body.nomet, User, Time);
  req.flash('success', 'Campeonato Criado!!');
  res.redirect('/cadastrocamp');
});




app.get('/lista', function (req, res) {
  if(req.user){
    var cchave =[];
    Camp.find({adm: req.user.username}, function(err, campeonato){
      if(err){
        console.log(err);
      } else {
        for(camp of campeonato){

          var conjunto = [];
          for(var i=0;i<camp.numerotimes;i++){
            if(Math.pow(2,i)==camp.numerotimes){
              for (var j = 0; j<camp.chaves.length ;j++){
                if((camp.chaves[j].times[0].nometime)=="-"){
                  atual=j-1;
                  break;
                }
              }
              var perct = (atual/i)*100;
              if(perct==100){

                var winner = _.last(camp.chaves);
                var winner = winner.times[0];

                conjunto.push(camp,perct,winner);
              }
              else{

                var winner = "-";

                conjunto.push(camp,perct,winner);

              }
              break;
            }
          }
          cchave.push(conjunto);
        }
        res.render('lista.hbs', {
          error : req.flash('error'),
          success : req.flash('success'),
          //campeonato : campeonato,
          cchave : cchave
        });
      }
    });
  }
  else{
    var cchave =[];
    Camp.find({},{},{limit : 10}, function(err, campeonato){
      if(err){
        console.log(err);
      } else {

        for(camp of campeonato){
          var conjunto = [];
          for(var i=0;i<camp.numerotimes;i++){
            if(Math.pow(2,i)==camp.numerotimes){
              //var atual = camp.chaves.length ;
              for (var j = 0; j<camp.chaves.length ;j++){
                if((camp.chaves[j].times[0].nometime)=="-"){
                  atual=j-1;
                  break;
                }
              }
              var perct = (atual/i)*100;

              if(perct==100){

                var winner = _.last(camp.chaves);    uls[i].classList.toggle('aparece');
              }
              else{

                var winner = "-";

                conjunto.push(camp,perct,winner);

              }
              break;
            }
          }
          cchave.push(conjunto);
        }
        res.render('lista.hbs', {
          error : req.flash('error'),
          success : req.flash('success'),
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
        campeonato : campeonato,
        error : req.flash('error'),
        success : req.flash('success')
      });

    }
    else{
      req.flash('success', 'Campeonato não encontrado');
      res.redirect('/lista');
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
  res.render('cadastro.hbs', {

    error : req.flash('error'),
    success : req.flash('success')
  });
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
  try{
    newUser.save(function(err) {

        if (err) console.log(err);


    });

  }
  catch(ex){
    req.flash('error', 'Esse username provavelmente já existe, use outro XD');

    res.redirect('/');
  }
  req.flash('success', 'O usuário foi criado com sucesso');
  res.redirect('/');
});


app.get('/criar-time', function (req, res) {
  res.render('criartime.hbs',{

    success : req.flash('success'),
    error : req.flash('error')
  });
});

app.post('/novapag', function(req,res){
    var numerob = req.body.numbero;
    var vetor =[];
    for(var i=0;i<numerob;i++){
      vetor.push(i+1);
    }

    res.render('/criartime.hbs', {
      vetor : vetor,
      error : req.flash('error'),
      success : req.flash('success'),
      numerob :numerob
    });

});


app.post('/novotime', function (req, res) {


  var Usernames = req.body.unamep;
  var UsersId = [];
    for(var Username of Usernames){
      User.findOne({username: Username}, function(err, usuario){
        if(err){
            req.flash('error', 'Time Não foi criado!! Algum usuário não existe XD');
        }
        else {
          UsersId.push(usuario._id);

          if(UsersId.length == req.body.numjogadores) {
            var newTime = Time ({
              nometime: req.body.nomet,
              integrantes: UsersId
            } );

            newTime.save(function(err) {
              if (err) {
                req.flash('error', 'Time Não foi criado!! Utilize um nome de time diferente XD');

              }
              else{
              req.flash('success', 'Time Criado!!');
            }
            });
          }
        }
      });
    }

  res.render('cadastrocamp.hbs',{
    error : req.flash('error'),
    success : req.flash('success')

  });
});


app.listen(app.get('port'), '0.0.0.0', function() {
  console.log('Node app is running on port', app.get('port'));
});

hbs.registerHelper('if_even', function(conditional, options) {
  if((conditional % 2) == 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
hbs.registerHelper('if_odd', function(conditional, options) {
  if((conditional % 2) != 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
