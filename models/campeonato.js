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


var Camp = mongoose.model('Camp', campSchema);
module.exports = Camp;
