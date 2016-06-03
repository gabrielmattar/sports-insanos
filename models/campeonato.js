var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var campSchema =  new Schema({
  nome: {type: String, required: true, unique: true},
  adm: {type: Schema.ObjectID, ref: 'users'}
  numerotimes: Number,
  times: [{type: Schema.ObjectID, ref: 'time'}]

});




var Camp = mongoose.model('Camp', campSchema);
module.exports = Camp;
