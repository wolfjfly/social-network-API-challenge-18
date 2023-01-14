const { Schema, model } = require('mongoose');

// Schema for what makes up a thought
const commentSchema = new Schema({
    text: String,
    username: String,
  });
  
  // Initialize the Comment model
  const Comment = model('comment', commentSchema);
  
  module.exports = Comment;