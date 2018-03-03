var mongoose = require('mongoose');
var blogSchema = new mongoose.Schema({
    "id": String,
    "author": String,
    "state": String,
    "title": String,
    "creationTime": String,
    "firstPic": String,
    "tag": Array,
    "content": String,
    "picDelList": Array,
    "eyes": Number,
    "love": Number,
    "preface": String,
    "comment": Number
});

module.exports = mongoose.model("Blog", blogSchema);