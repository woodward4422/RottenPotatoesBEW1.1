// comment.js

const mongoose = require('mongoose')

const Comment = mongoose.model('Comment', {
  title: String,
  content: String
});

module.exports = Comment