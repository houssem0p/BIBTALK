const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  default:'Other',
    enum: ['Arts & Music','Biography','Business','Comics','Computer & Tech','Cooking','Crime','Drama','Education','Entertainment','Fiction','Health','History','Horror','Kids','Literature','Medical','Mystery','Religion','Romance','Science Fiction & Fantasy','Science & Math','Sports' , 'Romance', 'Travel','Thriller','Western', 'Other'],

  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
    },
    comments: [{
      type: String,
    }],
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  }],
  cover: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  language : {
    type: String,
  },
  publishedDate : {
    type: Date,
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
