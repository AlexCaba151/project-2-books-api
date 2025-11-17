const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: true
    },
    genre: {
      type: String,
      required: true,
      trim: true
    },
    publishedYear: {
      type: Number,
      required: true
    },
    pages: {
      type: Number,
      required: true
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    language: {
      type: String,
      required: true,
      trim: true
    },
    inStock: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
