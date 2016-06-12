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

  res.render('cadastrocamp.hbs', {
    error : req.flash('error'),
    success : req.flash('success')

  });
});
app.post('/cadastroc', function (req, res) {
  var camp = new Camp();

//  camp.Cria(req.body.numerot, req.body.nomec, 'marchezinixd', req.body.nomet, User, Time);
  let tamanho=req.body.numerot;
  let nomec=req.body.nomec;
  let admin='marchezinixd';
  let nomet = req.body.nomet;
  var timesc = nomet;
  var times = [];
    for(var time of timesc){
      Time.findOne({nometime: time}, function(err, team){
        if(!team){
          req.flash('error', 'Algum dos times não existe');
          res.redirect('/cadastrocamp');
        }
        else if(err){
          console.log(err);
          req.flash('error', 'Ocorreu um error');
          res.redirect('/cadastrocamp');
        }
        else {
          User.findOne({username: admin}, function(err, admi){
            if(!admi){
              req.flash('error', 'Administrador inválido');
              res.redirect('/cadastrocamp');

            }
            else if(err){
              console.log(err);
              req.flash('error', 'Ocorreu um error');
              res.redirect('/cadastrocamp');
            }
            else {
              times.push(team);
              if(times.length == tamanho) {
                var keys = [];
                keys.push({
                  times: times
                })
                var i = times.length/2;
                //Nessa sessao abaixo usamos um time em branco para preencher o resto das chaves
                //Se a entrada foram 8 times entao vao haver 3 chaves, a primeira com 8 times a
                //segunda com 4 a terceira com 2 e a primeira com 1
                Time.findOne({nometime: '-'}, function(err, branco){
                  while(i >= 1){
                    var brancos = [];
                    for(var j = 0; j < i; j++){
                      brancos.push(branco._id);
                    }
                    keys.push({
                      times: brancos
                    })
                    i=i/2;
                  }
                  var newCamp =  Camp({
                    nome: nomec,
                    numerotimes: tamanho,
                    chaves: keys,
                    adm:admi
                  } );

                  newCamp.save(function(err) {
                    if (err) {
                      console.log(err);
                      req.flash('error', 'Já existe um time com esse nome');
                      res.redirect('/cadastrocamp');
                    }
                    else{
                      req.flash('success', 'Campeonato Criado!!');
                      res.redirect('/cadastrocamp');
                    }
                  });
                });

              }
            }
          });
        }
      });
    }
  //req.flash('success', 'Campeonato Criado!!');
  //res.redirect('/cadastrocamp');
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



    //req.flash('success', 'O usuário foi criado com sucesso');
  newUser.save(function(err) {
      if (err) {
      //  console.log(err);
        req.flash('error','Username já existe :( tente outro)');
        console.log(err);
        res.redirect('/cadastro');
      }
      else{
        req.flash('success','Usuário criado com sucesso XD');
        console.log('user criado');
        res.redirect('/');
      }
  });//{console.log('hue');}
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

    res.render('criartime.hbs', {
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
        if(!usuario){
            req.flash('error', 'Time Não foi criado!! Algum usuário não existe');

            res.redirect('/criar-time');
        }
        else if(usuario) {
          UsersId.push(usuario._id);

          if(UsersId.length == req.body.numjogadores) {
            var newTime = Time ({
              nometime: req.body.nomet,
              integrantes: UsersId
            } );

            newTime.save(function(err) {
              if (err) {
              //  console.log(err);
                req.flash('error','Nome do Time já existe');
                console.log(err);
                res.redirect('/criar-time');
              }
              else{
                req.flash('success','Time criado com sucesso. Já pode criar e participar de campeonatos');
                console.log('user criado');
                res.redirect('/cadastrocamp');
              }

            });
          }
        }
        else if(err){
          req.flash('error', 'Um erro aconteceu');
          console.log(err);
          res.redirect('/criar-time');
        }

      });
    }


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
