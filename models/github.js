var mongoose = require('mongoose');

var githubSchema = new mongoose.Schema({
  "id": Number,
  "name": String,
  "html_url": String,
  "description": String,
  "icon": String,
  "stargazers_count": Number,
  "forks_count": Number,
  "open_issues": Number,
  "language": String
});

module.exports = mongoose.model("Github", githubSchema);