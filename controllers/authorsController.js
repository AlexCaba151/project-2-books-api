const Author = require('../models/author');

// Validación simple
const validateAuthor = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('name is required and must be a non-empty string');
  }

  if (data.bio && typeof data.bio !== 'string') {
    errors.push('bio must be a string');
  }

  if (data.nationality && typeof data.nationality !== 'string') {
    errors.push('nationality must be a string');
  }

  if (data.birthDate && isNaN(Date.parse(data.birthDate))) {
    errors.push('birthDate must be a valid date');
  }

  return errors;
};

exports.getAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching authors', error: error.message });
  }
};

exports.getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: 'Invalid author ID format' });
    }

    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json(author);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching author', error: error.message });
  }
};

exports.createAuthor = async (req, res) => {
  try {
    const errors = validateAuthor(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const author = new Author(req.body);
    const savedAuthor = await author.save();
    res.status(201).json(savedAuthor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating author', error: error.message });
  }
};

exports.updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: 'Invalid author ID format' });
    }

    const errors = validateAuthor(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const updatedAuthor = await Author.findByIdAndUpdate(id, req.body, {
      new: true
    });

    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating author', error: error.message });
  }
};

exports.deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: 'Invalid author ID format' });
    }

    const deletedAuthor = await Author.findByIdAndDelete(id);

    if (!deletedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting author', error: error.message });
  }
};
