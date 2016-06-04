var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var timeSchema =  new Schema({
  nometime: String,
  integrantes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});




var Time = mongoose.model('Time', timeSchema);
module.exports = Time;
