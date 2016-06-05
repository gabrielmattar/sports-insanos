var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var usersSchema =  new Schema({
  nome: String,
  sobrenome: String,
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  sexo: String

});
 

var User = mongoose.model('User', usersSchema);

module.exports = User;
