const Book = require('../models/book');
const Author = require('../models/author');

const validateBook = (data) => {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    errors.push('title is required and must be a non-empty string');
  }

  if (!data.author || typeof data.author !== 'string') {
    errors.push('author is required and must be a valid author ID');
  }

  if (!data.genre || typeof data.genre !== 'string' || !data.genre.trim()) {
    errors.push('genre is required and must be a non-empty string');
  }

  if (data.publishedYear === undefined || typeof data.publishedYear !== 'number') {
    errors.push('publishedYear is required and must be a number');
  }

  if (data.pages === undefined || typeof data.pages !== 'number') {
    errors.push('pages is required and must be a number');
  }

  if (!data.isbn || typeof data.isbn !== 'string' || !data.isbn.trim()) {
    errors.push('isbn is required and must be a non-empty string');
  }

  if (!data.language || typeof data.language !== 'string' || !data.language.trim()) {
    errors.push('language is required and must be a non-empty string');
  }

  if (data.inStock !== undefined && typeof data.inStock !== 'boolean') {
    errors.push('inStock must be a boolean');
  }

  return errors;
};

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('author');
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const book = await Book.findById(id).populate('author');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const errors = validateBook(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // Verificar que exista el autor
    const authorExists = await Author.findById(req.body.author);
    if (!authorExists) {
      return res.status(400).json({ message: 'Author does not exist' });
    }

    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({ message: 'ISBN must be unique', error: error.message });
    }

    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const errors = validateBook(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    if (req.body.author) {
      const authorExists = await Author.findById(req.body.author);
      if (!authorExists) {
        return res.status(400).json({ message: 'Author does not exist' });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true
    });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};
