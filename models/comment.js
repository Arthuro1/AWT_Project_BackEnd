const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  message: {
    type: String,
  },

  author: {
    id: {
      type: String,
    },
    username: {
      type: String,
    },
  },

  commentedBookId: {
    type: String,
  },

  likes: {
    type: Number,
  },

  commentIds: [],

  creationDate: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.pre('save', async function(next) {
  try {
    this.commentIds = [];
    this.likes = 0;
    next();
  } catch (e) {
    next(e);
  }
});

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
