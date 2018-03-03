var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
  "projectName": String,
  "projectIcon":String
});

module.exports = mongoose.model("Project", projectSchema);