var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var timeSchema =  new Schema({
  nometime: String,
  integrantes: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }]


});




var Time = mongoose.model('Time', timeSchema);
module.exports = Time;
