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
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;


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
app.use(passport.initialize());
app.use(passport.session());


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




passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password!=password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                    failureRedirect: '/',
                                    failureFlash: true
                                    })
);


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/', function (req, res) {
  if(typeof req.user ==="undefined" ){
    res.render('frontpage.hbs',{
      error : req.flash('error'),
      success : req.flash('success'),
      userlog: "Não Logado"

    });

  }
  else{
    res.render('frontpage.hbs',{
      error : req.flash('error'),
      success : req.flash('success'),
      userlog:  req.user.username

    });

  }
});


/*app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));*/

app.post('/novapagc', function(req,res){
    var numerob = req.body.numerot;
    var vetor =[];
    for(var i=0;i<numerob;i++){
      vetor.push(i+1);
    }
    var enviacamp = req.body.nomeca;
    if(typeof req.user ==="undefined" ){
      res.render('cadastrocamp.hbs', {
        vetor : vetor,
        enviacamp :enviacamp,
        error : req.flash('error'),
        success : req.flash('success'),
        userlog: "Não Logado"
      });
    }
      else{
        res.render('cadastrocamp.hbs',{
          vetor : vetor,
          enviacamp :enviacamp,
          error : req.flash('error'),
          success : req.flash('success'),
          userlog:  req.user.username

        });
  }
});

app.get('/cadastrocamp', function (req, res) {

  if(typeof req.user ==="undefined" ){
    res.render('cadastrocamp.hbs', {

      error : req.flash('error'),
      success : req.flash('success'),
      userlog: "Não Logado"
    });
  }
    else{
      res.render('cadastrocamp.hbs',{
        error : req.flash('error'),
        success : req.flash('success'),
        userlog:  req.user.username

      });
    }
});
app.post('/cadastroc', function (req, res) {
  var camp = new Camp();

//  camp.Cria(req.body.numerot, req.body.nomec, 'marchezinixd', req.body.nomet, User, Time);
  var tamanho=req.body.numerot;
  var nomec=req.body.nomec;
  var admin;
  var nomet = req.body.nomet;
  var timesc = nomet;
  var times = [];

  if(req.user){
    admin = req.user.username;
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
  } else{
    req.flash('error', 'Por favor faca a gentileza de logar, n doi nada');
    res.redirect('/cadastrocamp');
  }
});


//Funcao para avancar time quando ganha
app.get('/avanca/:campeonato/:chave/:time/:indice', function(req, res){
  var campeonato = req.params.campeonato;
  var chave = req.params.chave;
  var time = req.params.time;
  var index = req.params.indice;

  var chaveprox = Number(chave) + 1;
  var indexprox = Math.floor(index/2);



  Camp.findOne({nome : campeonato}, function(err, campeonato){
    if(err){
      res.status(500);
      res.render('5XX.hbs');
    }else if (req.user && req.user.username == campeonato.adm.username) {

      Time.findOne({nometime:time}, function(err, time){
        if(err){
          res.status(500);
          res.render('5XX.hbs');
        }else{
          campeonato.chaves[chaveprox].times[indexprox] = time;
          console.log("Inserindo " + time.nometime + " em chave: " + chaveprox + " posicao: "+ indexprox);
          campeonato.markModified('chaves');
          campeonato.save();
        }
      });
    }
  });
});


app.get('/lista', function (req, res) {
  if(req.user){

    var cchave =[];
    User.findOne({username: req.user.username}, function(err, user){
      Camp.find({ adm : user}).exec(function(err, campeonato){
        if(err){
          res.status(500);
          res.render('5XX.hbs');
        } else {

          for(camp of campeonato){
            var conjunto = [];
            var atual=0;
            var total=0;
            for(var i=0;i<camp.numerotimes;i++){
              if(Math.pow(2,i)==camp.numerotimes){
                //var atual = camp.chaves.length ;
                for (var j = 1; j<camp.chaves.length ;j++){
                  for(var ka=0;ka<camp.chaves[j].times.length;ka++)
                  if((camp.chaves[j].times[ka].nometime)!="-"){
                    atual=atual+1 ;
                    total=total +1;

                  }
                  else{
                    total= total +1;
                  }

                }/*
                if(j==camp.chaves.length){
                  atual=j-1;
                }*/

                var perct = (atual/total)*100;
                perct = Math.round(perct * 100) / 100;

                if(perct==100){

                  var winner = _.last(camp.chaves);
                  var winner = winner.times[0];
                  //uls[i].classList.toggle('aparece');
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

          if(typeof req.user ==="undefined" ){
            res.render('lista.hbs', {
              cchave : cchave,

              error : req.flash('error'),
              success : req.flash('success'),
              userlog: "Não Logado"
            });
          }
            else{
              res.render('lista.hbs',{
                cchave : cchave,
                error : req.flash('error'),
                success : req.flash('success'),
                userlog:  req.user.username

              });
          }
        }
      });
    });

  }
  else{
    var cchave =[];
    Camp.find({},{},{limit : 10}, function(err, campeonato){
      if(err){
        res.status(500);
        res.render('5XX.hbs');
      } else {

        for(camp of campeonato){
          var conjunto = [];
          var atual=0;
          var total=0;
          for(var i=0;i<camp.numerotimes;i++){
            if(Math.pow(2,i)==camp.numerotimes){
              //var atual = camp.chaves.length ;
              for (var j = 1; j<camp.chaves.length ;j++){
                for(var ka=0;ka<camp.chaves[j].times.length;ka++)
                if((camp.chaves[j].times[ka].nometime)!="-"){
                  atual=atual+1 ;
                  total=total +1;

                }
                else{
                  total= total +1;
                }

              }/*
              if(j==camp.chaves.length){
                atual=j-1;
              }*/

              var perct = (atual/total)*100;
              perct = Math.round(perct * 100) / 100;

              if(perct==100){

                var winner = _.last(camp.chaves);
                var winner = winner.times[0];
                //uls[i].classList.toggle('aparece');
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
        if(typeof req.user ==="undefined" ){
          res.render('lista.hbs', {
            cchave : cchave,

            error : req.flash('error'),
            success : req.flash('success'),
            userlog: "Não Logado"
          });
        }
          else{
            res.render('lista.hbs',{
              cchave : cchave,
              error : req.flash('error'),
              success : req.flash('success'),
              userlog:  req.user.username

            });
      }
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

      if(typeof req.user ==="undefined" ){
        res.render('campeonatochaves.hbs', {
          campeonato : campeonato,

          error : req.flash('error'),
          success : req.flash('success'),
          userlog: "Não Logado"
        });
      }
        else{
          res.render('campeonatochaves.hbs',{
            campeonato : campeonato,
            error : req.flash('error'),
            success : req.flash('success'),
            userlog:  req.user.username

          });
    }

    }
    else{
      req.flash('error', 'Campeonato não encontrado');
      res.redirect('/lista');
    }

  });
});

app.get('/cadastro', function (req, res) {

  if(typeof req.user ==="undefined" ){
    res.render('cadastro.hbs', {


      error : req.flash('error'),
      success : req.flash('success'),
      userlog: "Não Logado"
    });
  }
    else{
      res.render('cadastro.hbs',{

        error : req.flash('error'),
        success : req.flash('success'),
        userlog:  req.user.username

      });
    }

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

  if(typeof req.user ==="undefined" ){
    res.render('criartime.hbs',{
      error : req.flash('error'),
      success : req.flash('success'),
      userlog: "Não Logado"

    });
  }
  else{
    res.render('criartime.hbs',{
      error : req.flash('error'),
      success : req.flash('success'),
      userlog:  req.user.username

    });

  }
});




app.post('/novapag', function(req,res){
    var numerob = req.body.numbero;
    var vetor =[];
    for(var i=0;i<numerob;i++){
      vetor.push(i+1);
    }


    if(typeof req.user ==="undefined" ){
      res.render('criartime.hbs',{
        error : req.flash('error'),
        success : req.flash('success'),
        userlog: "Não Logado",
        numerob :numerob,
        vetor : vetor
      });
    }
    else{
      res.render('criartime.hbs',{
        error : req.flash('error'),
        success : req.flash('success'),
        userlog:  req.user.username,
        numerob :numerob,
        vetor : vetor
      });

    }

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

app.get('*', function (req, res) {

    res.render('Error404.hbs',{
      error : req.flash('error'),
      success : req.flash('success'),
      userlog: "Não Logado"

    });


});

app.use(function(error, req, res, next) {
  res.status(500);
  res.render('5XX.hbs');
 })

 app.use(function (req, res, next) {
    if (config.globals.maintenanceModeEnabled) {

        // Need this condition to avoid redirect loop
        if (req.url !== '/503') {
             res.status(503).render('Error503.hbs');
        } else {
            next();
        }

    } else {
        next();
    }
});
