const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lectureSchema = new Schema({
  name: {
    type: String,
  },

  books: [],

  creationDate: {
    type: Date,
    default: Date.now,
  },
});

lectureSchema.pre('save', async function(next) {
  try {
    next();
  } catch (e) {
    next(e);
  }
});

const Lecture = mongoose.model('lecture', lectureSchema);

module.exports = Lecture;
