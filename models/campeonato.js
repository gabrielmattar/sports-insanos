var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var campSchema =  new Schema({
  nome: {type: String, required: true, unique: true},
  adm: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  numerotimes: Number,
  chaves:[{
    times: [{
      type: Schema.Types.ObjectId,
      ref: 'Time'
    }]
  }]
});



campSchema.pre('find', function(next) {
  // do stuff
  this.populate('adm');
  this.populate('chaves.times');
  next();
});

campSchema.pre('findOne', function(next) {
  // do stuff
  this.populate('adm');
  this.populate('chaves.times');
  next();
});

campSchema.methods.Cria = function(tamanho, nomec, admin, nomet, User, Time) {

  var timesc = nomet;
  var times = [];
    for(var time of timesc){
      Time.findOne({nometime: time}, function(err, team){
        if(err){
          console.log(err);
        }
        else {
          User.findOne({username: admin}, function(err, admi){
            if(err){
              console.log(err);
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
                      req.flash('error', 'Campeonato Criado!!');
                      res.redirect('/cadastrocamp');
                    }
                    else{
                      req.flash('error', 'Campeonato Criado!!');
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
}

var Camp = mongoose.model('Camp', campSchema);
module.exports = Camp;
