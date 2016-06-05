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

campSchema.pre('find', function(popula) {
  // do stuff
  console.log("deu");
  this.populate('chaves.times');
  popula();
});


var Camp = mongoose.model('Camp', campSchema);
module.exports = Camp;
