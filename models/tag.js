var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
  "name": String,
  "aliasName": String,
  "icon": String,
  "dsc": String,
  "svg": String
});

module.exports = mongoose.model("Tag", tagSchema);