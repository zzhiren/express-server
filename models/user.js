var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  "userName": String,
  "userPwd": String,
  "token": String,
  'permissions': String,
  "role": String,  
  "motto": String,
  "headPortrait": String,
  "dsc": String,
  "music": String,
  "love": String,
  "email": String,
  "birthday": String,
  "location": String
});

module.exports = mongoose.model("User", userSchema);