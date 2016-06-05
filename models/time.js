var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var timeSchema =  new Schema({
  nometime: String,
  integrantes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

timeSchema.pre('find', function(popula) {
  // do stuff
  this.populate('integrantes');
  popula();
});

var Time = mongoose.model('Time', timeSchema);
module.exports = Time;
