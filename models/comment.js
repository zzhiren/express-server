var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  "id": String,
  "avatarImg": String,
  "userName": String,
  "userEmail": String,
  "userSite": String,
  "theComment": String,
  "creationTime": String,
  "OS": String,
  "browser": String
});

module.exports = mongoose.model("Comment", commentSchema);