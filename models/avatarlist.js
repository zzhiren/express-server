var mongoose = require('mongoose');

var avatarListSchema = new mongoose.Schema({
  "list": Object
});

module.exports = mongoose.model("AvatarList", avatarListSchema);