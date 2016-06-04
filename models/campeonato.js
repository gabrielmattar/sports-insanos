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




var Camp = mongoose.model('Camp', campSchema);
module.exports = Camp;
